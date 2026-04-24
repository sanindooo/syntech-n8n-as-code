---
title: Defer HTML extraction to url_work_queue drainer for Keyword/Google/RSS/Website handlers
type: refactor
status: completed
date: 2026-04-24
deepened: 2026-04-24
completed: 2026-04-24
parent_architecture: docs/brainstorms/2026-04-23-sourcing-url-work-queue-requirements.md
parent_plan: docs/plans/2026-04-23-001-feat-sourcing-url-work-queue-plan.md
shipped_prs:
  - https://github.com/sanindooo/syntech-content-sourcing/pull/18  # Phases 1-6
  - https://github.com/sanindooo/syntech-content-sourcing/pull/19  # Phases 7-8
---

# Defer HTML extraction to url_work_queue drainer

## Enhancement Summary

**Deepened on:** 2026-04-24 via `compound-engineering:deepen-plan` — 13 review agents (correctness, architecture, python, testing, performance, reliability, maintainability, simplicity, api-contract, data-integrity, pattern-recognition) + 2 research agents (best-practices, framework-docs) + 1 skill agent (simplify).

### Key changes baked in from deepen-plan

1. **BLOCKING CORRECTNESS FIX** — `search_query` must be gated by `source_type`, not populated unconditionally (multiple reviewers). Otherwise RSS/Website/LinkedIn articles regress to non-null `search_query`, breaking `feedback_output_fields_are_schema`.
2. **BLOCKING CORRECTNESS FIX** — Pre-extracted fast-path (Tavily raw_content, RSS full-content) must run `is_article_too_old` *before* attaching `pre_extracted`. Otherwise re-introduces the `rss-undated-entries-bypass-age-filter` incident for undated Tavily/RSS content.
3. **BLOCKING CORRECTNESS FIX** — All new `ctx` keys must use defensive `.get()` reads, never hard lookup. Old rows mid-deploy lack `url_or_keyword`/`seeds`/`extraction_source`.
4. **BLOCKING REGRESSION TEST** — Add explicit `source_category` round-trip tests (data-integrity). Prior regression `1cbded5` was this exact shape of change.
5. **Drop the `_fetch_and_extract_inline` rollback-insurance** (unanimous from architecture, maintainability, simplicity, pattern) — rollback is `git revert`.
6. **`source_override` becomes a first-class `DiscoveredURL` field** (architecture, maintainability, python, simplify) — not `extra: dict`.
7. **Typed `RequestContext` pydantic model + `FailureReason` StrEnum + `ExtractPath` StrEnum** (python, maintainability, simplify) — replace stringly-typed dicts and ad-hoc strings.
8. **Failure taxonomy is `{reason: FailureReason, category: "transient|permanent"}`** (best-practices external consensus: Kafka DLQ, Confluent, Celery) — retry policy keys off `category`, reporting keys off `reason`. Eliminates brittle `split_part(last_error, ':', 1)` dependency.
9. **Drainer supervision wrapper** required (reliability + FastAPI 2026 docs) — `task.add_done_callback` that logs + flips a `/readyz` flag so Railway restarts on silent task death.
10. **New Phase 7: Batch `mark_*` writes** (performance) — per-tick drainer DB-conn usage drops from 10 → 1. Unblocks safe `drain_batch_size` increases.
11. **Memory safety inside drainer gather** — internal `asyncio.Semaphore(5)` inside batch gather to cap peak transient RAM from ~400 MB → ~200 MB.
12. **Graceful shutdown** — lifespan shutdown releases `in_flight` rows held by this replica back to `queued` so next replica picks up immediately (10-min stale-lock window becomes 0s on planned redeploys).
13. **`search_query` for Google-direct sources preserved** — Google handler today sets `search_query = request.url_or_keyword` for all Google articles (`app/handlers/google.py:307`). The refactor must replicate that for `source_type == "Google"`, not only for Keyword.
14. **Controlled vocabulary + `max_attempts_exhausted` preserves underlying reason** — `last_error = "max_attempts_exhausted:fetch_exhausted"` so the dashboard can tell "exhausted on transient" from "immediate permanent".
15. **p99 target loosened for Keyword/RSS** — <15s, not <10s (Tavily fanout alone is 8s p99). Website/Google stay <10s.

### New considerations discovered

- **Event-naming style inconsistency in codebase** (`search_request_started` flat vs `drain_loop.started` dotted). This plan uses flat snake_case for the new `extract_path_taken` event, consistent with `extract_*`/`search_*`/`fetch_*` precedent. Documenting this as a deliberate choice, not drift.
- **OTel semantic conventions** have no `extraction.method` attribute. If OTel adoption happens later, attribute should be `syntech.extraction.method` / `.outcome` / `.attempt`. Not adopting now — structlog events are the existing contract.
- **Retry storm on Zyte recovery** — with extraction deferred to the drainer, a Zyte outage bounces every URL through `waiting_retry` simultaneously. Need jittered backoff + Zyte-specific circuit breaker. Added as P1 follow-up, not blocking for this PR.
- **Drainer throughput ceiling** — realistic sustained rate is ~3600 URLs/hour with Zyte in the loop, ~36K/hour without. Explicit ceiling documented; if 2500-URL bursts regularly exceed the settle-timer window, Deferred §1 (advisory lock + 2 replicas) becomes mandatory.
- **TOAST trap at 2 KB JSONB** — `seed_content` (Tavily raw_content, up to ~10 KB) must NOT be persisted to `request_context`. Consumed at enqueue time to build `pre_extracted`, then discarded. Persisting it would 10× the queue row size and trigger TOAST decompression on every SELECT.

### Research sources added

- psycopg 3.2 AsyncConnectionPool lifecycle: https://www.psycopg.org/psycopg3/docs/advanced/pool.html
- FastAPI lifespan background-task supervision: https://leapcell.io/blog/understanding-pitfalls-of-async-task-management-in-fastapi-requests
- pydantic v2 `model_validate_json` / `model_dump(mode='json')`: https://docs.pydantic.dev/latest/concepts/performance/
- structlog contextvars in async workers: https://www.structlog.org/en/stable/contextvars.html
- Postgres 16/17 JSONB indexing + TOAST: https://www.crunchydata.com/blog/indexing-jsonb-in-postgres
- Kafka DLQ error.category + error.reason pattern: https://www.confluent.io/learn/kafka-dead-letter-queue/
- Transactional outbox with `FOR UPDATE SKIP LOCKED` in psycopg 3: https://www.npiontko.pro/2025/05/19/outbox-pattern
- OTel semconv 1.40 (for future, not adopted now): https://opentelemetry.io/docs/specs/semconv/

---

## Overview

Finish the discovery/extraction split that the url_work_queue requirements ([R4/R5](../brainstorms/2026-04-23-sourcing-url-work-queue-requirements.md)) specified but the implementation did not honor for four handlers. Override `discover_urls()` on `KeywordHandler`, `GoogleHandler`, `RSSHandler`, and `WebsiteHandler` so their `/search` calls return quickly with seed metadata only — the drainer does the HTML fetch + Zyte fallback + content extraction asynchronously. LinkedIn / Instagram / X / Twitter handlers are unchanged (Apify already returns extracted content; `pre_extracted` stays the right path).

**Not a new feature.** The scaffolding (`DiscoveredURL.pre_extracted`, `DiscoveredURL.seed_*`, `extract_one` slow-path) is already shipped. This plan lands the missing 4 handler overrides, threads seed metadata through `request_context`, normalizes failure reasons to a controlled vocabulary, and adds one observability event.

## Problem Statement

### Symptoms

On 2026-04-24 during a production sourcing run, n8n surfaced 25 errored items (50% of a ~50-item batch) with two error shapes:

- `ERR_BAD_RESPONSE` status 503 — LinkedIn, RSS, Google Alerts sources.
- `ECONNABORTED` status null — every Keyword source in the batch.

n8n had already been tuned with batching + delay, and `DB_POOL_CHECKOUT_TIMEOUT_SEC` raised to 15s. Neither helped. Logs (`logs.1777015826212.json`, 1001 events over a 2-minute window) show:

- Successful `/search` calls took **70–132 seconds** (LinkedIn/RSS/Instagram/X).
- Keyword calls never completed — 12× `search_discovery_timeout` at the server's 60s `wait_for`.
- **Zero `db_pool_timeout`** events. Pool is not the bottleneck.
- Only one Railway replica (`619cd9e9-…`); 33 distinct `/search` request IDs; 20 completed.

### Root cause

`app/handlers/base.py:139` defines a default `discover_urls()` that delegates to `fetch()`:

```python
async def discover_urls(self, request, config) -> list[DiscoveredURL]:
    articles = await self.fetch(request, config)
    return [DiscoveredURL(url=a.url, pre_extracted=a) for a in articles]
```

Every handler inherits this default. `fetch()` for Keyword/Google/RSS/Website runs the full extraction pipeline — `fetch_html` → Zyte anti-bot fallback (up to 60s per URL) → `validate_content` → `smart_summary` — inside the synchronous `/search` request. The `/search` route (`app/api/routes.py:82`) wraps this in a per-source `asyncio.wait_for` (60s for Keyword, 30s for RSS/Website/Google, 120s for Apify) so it can't run forever, but the budget is already consumed long before extraction finishes for sources whose Tavily/SERP results hit Zyte-banned sites.

Consequences:
- **Keyword** requests consistently hit the 60s wait_for and return `status="partial"`. n8n's client sees `ECONNABORTED` before the 200 arrives (the response races the Railway edge's idle handling; the client abort wins).
- **LinkedIn / RSS / Instagram / X** blow past 120s occasionally, and with only one replica serving the flood of concurrent requests, Railway's edge layer returns `503` for connections it can no longer hold open. No `db_pool_timeout` event accompanies these — they are edge-layer 503s, not application 503s.

### Why the parent plan left this unfinished

The url_work_queue requirements ([R5](../brainstorms/2026-04-23-sourcing-url-work-queue-requirements.md)) explicitly said "Extraction (HTML fetch, readability, validation, ArticleResponse construction) moves out of the request path and into the drainer." But the implementation took the path of least change: keep handlers calling `fetch()` (which does both), wrap each `fetch()` result as `pre_extracted`, and rely on the drainer's pre_extracted fast-path. That works functionally — every URL reaches a terminal state — but it preserves the synchronous extraction cost inside `/search`, defeating the split's point.

## Proposed Solution

Override `discover_urls()` on the four slow handlers so they return lightweight `DiscoveredURL` objects. Extend `request_context` (JSONB) with seed metadata + `url_or_keyword` so the drainer can rebuild an `ArticleResponse` with parity to the current inline path. Normalize failure reasons to a controlled vocabulary. Add one log event.

Apify handlers (LinkedIn/Instagram/X/Twitter) stay on the default `discover_urls` — they already have extracted content from the Apify response; deferring their extraction would force a re-fetch of platform URLs that actively block scraping (LinkedIn especially).

## Technical Approach

### Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│ BEFORE                                                                 │
│ n8n ──POST /search──▶ handler.fetch()  ← discovery + extract + Zyte   │
│                        (60–130s)                                       │
│                        │                                               │
│                        ▼                                               │
│                       enqueue as 'ready' (pre_extracted)              │
│                                                                        │
│ drainer wakes up, flushes 'ready' rows to webhook.                     │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│ AFTER                                                                  │
│ n8n ──POST /search──▶ handler.discover_urls()  ← discovery only       │
│                        (1–10s)                                         │
│                        │                                               │
│                        ▼                                               │
│                       enqueue as 'queued' + seed metadata             │
│                                                                        │
│ drainer claims 'queued' → extract_one → fetch_html + Zyte →            │
│ 'ready' (success) | 'waiting_retry' (transient) | 'failed' (permanent) │
│                                                                        │
│ flush predicate fires → webhook POST.                                  │
└───────────────────────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Seed metadata plumbing (typed)

Introduce a typed `RequestContext` pydantic model colocated with `QueueRow` in `app/queue/schema.py`. Replaces the `dict[str, Any]` contract that `_request_context` currently produces at `app/queue/enqueue.py:27`.

```python
# app/queue/schema.py  (NEW)
from typing import Literal
from pydantic import BaseModel

class SeedMetadata(BaseModel):
    title: str | None = None
    summary: str | None = None
    publication_date: str | None = None
    author: str | None = None

class RequestContext(BaseModel):
    v: int = 1                                                    # schema version — DO NOT remove
    source_type: str
    source_name: str
    source_category: str | None = None
    prompt: str | None = None
    additional_formats: list[str] | None = None
    test_mode: bool = False
    url_or_keyword: str | None = None                             # populated only where downstream wants search_query
    seeds: SeedMetadata = SeedMetadata()                          # nested so the top level stays tidy
    extraction_source: Literal["apify", "tavily", "rss"] | None = None  # drives extract_path_taken path value

    model_config = {"extra": "ignore"}                            # tolerate unknown keys on old rows
```

Note `v: int = 1`. Every future non-backward-compatible extension bumps this. `extract_one` can branch on version before the first incompatible change lands.

`enqueue_bulk` (`app/queue/enqueue.py:62-135`) builds per-row `RequestContext` via a new helper:

```python
def _row_context(request: SearchRequest, d: DiscoveredURL) -> RequestContext:
    # seed_content is intentionally NOT persisted — used in-process to build pre_extracted
    # at enqueue time, then discarded. Persisting it would trip the Postgres TOAST threshold
    # (2 KB) per row and force decompression on every SELECT.
    ctx = RequestContext(
        source_type=d.source_override or request.source_type,    # first-class field on DiscoveredURL
        source_name=request.source_name,
        source_category=request.source_category,
        prompt=request.prompt,
        additional_formats=request.additional_formats,
        test_mode=request.test_mode,
        url_or_keyword=(
            request.url_or_keyword if request.source_type in ("Keyword", "Google") else None
        ),
        seeds=SeedMetadata(
            title=d.seed_title,
            summary=d.seed_summary,
            publication_date=d.seed_publication_date,
            author=d.seed_author,
        ),
        extraction_source=d.extra.get("extraction_source"),      # set by handlers: "apify"|"tavily"|"rss"|None
    )
    return ctx
```

`enqueue_bulk` then calls `Json(ctx.model_dump(mode="json"))` per row. `mode="json"` ensures `datetime` fields serialize deterministically before psycopg's `Json` adapter wraps them.

**Invariant** (testable): within a single `enqueue_bulk` call, every row's `ctx` must have identical `source_name`, `source_category`, `prompt`, `additional_formats`, `test_mode`, `url_or_keyword`, `v`. Only `source_type` (if `source_override` differs across rows), `seeds`, and `extraction_source` may vary. Add a cheap assertion guard + a test (see Phase 5).

**Update `app/queue/extract.py::extract_one` (line 62)** to:

```python
# Parse ctx via RequestContext; extra='ignore' tolerates old rows with no seeds/url_or_keyword
ctx = RequestContext.model_validate(row.request_context or {})

# 1. Populate search_query — ONLY for source_types where it was populated pre-refactor.
#    KeywordHandler sets it to the keyword; GoogleHandler sets it to request.url_or_keyword
#    (app/handlers/google.py:307). RSS/Website/LinkedIn/Instagram/X/Twitter emit search_query=None.
#    Do NOT set it for any other source_type — that would widen the contract and regress
#    feedback_output_fields_are_schema.
search_query = ctx.url_or_keyword if row.source_type in ("Keyword", "Google") else None

# 2. Title fallback order: extracted.title wins when present; seed.title only when extracted is empty.
#    Precedence MUST be (extracted OR seed OR "Untitled") — never (seed OR extracted), because
#    seeds are frequently clipped/truncated from Tavily snippets and RSS titles.
title = extracted.title or ctx.seeds.title or "Untitled"

# 3. Publication date fallback.
pub_date = extracted.publication_date or ctx.seeds.publication_date

# 4. Summary fallback.
summary = extracted.summary or smart_summary(content, None) or ctx.seeds.summary
```

`row.source_type` comes from the queue column (written at enqueue time from `d.source_override or request.source_type` — see Phase 2-D). No contract shift: `source=row.source_type` preserves the `source_vs_author` invariant.

**No migration.** Nested JSONB extension is backward-compatible. Old rows validate through `RequestContext.model_validate({...})` with `extra="ignore"` and every new field defaulted. **Test-coverage requirement:** Phase 5 MUST include a test that enqueues a row with the pre-refactor JSONB shape (`{"source_type": "RSS", "source_name": "Example", "source_category": "News", "prompt": None, "additional_formats": None, "test_mode": false}` only — no `seeds`, no `url_or_keyword`, no `v`, no `extraction_source`) and drives it through `extract_one` to a terminal state. Without this test, the "rollback-safe" claim is unverified.

### Research insights (Phase 1)

- **Typed ctx model** avoids the scattered `ctx.get("seeds", {}).get("title")` pattern and catches drift at the boundary (not at read sites). pydantic v2 `model_validate` is ~5-50× faster than v1, so the per-extraction cost is negligible. See https://docs.pydantic.dev/latest/concepts/performance/.
- **`mode="json"` on `model_dump()`** is required before writing to JSONB; psycopg's `Json` adapter doesn't convert `datetime` natively. See https://www.psycopg.org/psycopg3/docs/basic/adapt.html#json-adaptation.
- **TOAST threshold**: Postgres TOASTs JSONB rows over ~2 KB, forcing decompression on every SELECT even when you read one key. Tavily `raw_content` routinely runs 5–15 KB. Never persist it to `request_context`. See https://www.snowflake.com/en/engineering-blog/postgres-jsonb-columns-and-toast/.
- **`extra="ignore"` on RequestContext** guarantees forward compatibility: if a future PR adds a `ctx["foo"]` key, an in-flight older replica deserializing won't crash.

#### Phase 2: Handler overrides

Four handler overrides. The old `fetch()` methods on these four handlers are **deleted** in the same PR — rollback is `git revert <merge-sha>`, not preserved dead code. This decision is unanimous across architecture, maintainability, simplicity, and pattern reviewers; a "preserved-for-rollback" private helper would rot against the live path and the "revert in 2 weeks" trigger has no forcing function.

**Prerequisite schema changes** (same PR as Phase 2):

1. **Add `source_override: str | None = None` as a first-class field on `DiscoveredURL`** in `app/handlers/base.py:14-34`. Untyped `extra: dict["source_override"]` smuggles a load-bearing queue-column value through a schemaless dict — strongly flagged. Keep `extra: dict` for genuinely handler-specific scratch that never hits the queue schema.

2. **Shared helper for pre_extracted fast-paths** in `app/handlers/base.py` (or a new `app/handlers/_seed.py`):

    ```python
    def seed_to_pre_extracted(
        seed_content: str,
        url: str,
        seed_title: str | None,
        seed_publication_date: str | None,  # required — we DO NOT build pre_extracted without one
        seed_summary: str | None,
        source_type: str,
        source_name: str,
        source_category: str | None,
        prompt: str | None,
        additional_formats: list[str] | None,
        max_age_days: int,
    ) -> ArticleResponse | None:
        """Build a pre_extracted ArticleResponse from handler-provided seed content.

        Returns None when:
          - seed_content < 200 chars
          - validate_content(seed_content, url) fails
          - seed_publication_date is None or older than max_age_days
            (prevents the rss-undated-entries-bypass-age-filter regression class)
        """
        if not seed_content or len(seed_content) < 200:
            return None
        ok, _ = validate_content(seed_content, url)
        if not ok:
            return None
        if seed_publication_date is None:
            return None  # never pre_extract without a date — drainer path has the age gate
        if is_article_too_old(seed_publication_date, max_age_days):
            return None
        content = clean_content(seed_content)
        summary = smart_summary(content, seed_summary) if seed_summary else (extracted_summary or "")
        return ArticleResponse(
            title=seed_title or "Untitled",
            content=content,
            url=url,
            summary=summary,
            search_query=None,  # caller overrides if applicable
            publication_date=seed_publication_date,
            prompt=prompt,
            additional_formats=additional_formats,
            source=source_type,
            author=None,
            source_category=source_category or "News",
            source_name=source_name,
            mode=None,
        )
    ```

    **BLOCKING CORRECTNESS**: Returning `None` on `seed_publication_date is None` is load-bearing. Without it, Tavily rows where the API didn't return `published_date` (common) would land as `ready` with `publication_date=None` and bypass the drainer's `is_article_too_old` gate — exact regression class of `rss-undated-entries-bypass-age-filter.md`. Covered by `test_pre_extracted_requires_publication_date` in Phase 5.

**A. `WebsiteHandler.discover_urls`** (`app/handlers/website.py`) — trivial:

```python
async def discover_urls(self, request, config):
    try:
        url = request.url_or_keyword
        if not passes_ssrf_guard(url):       # existing guard in app.extraction; import it
            logger.info("website_ssrf_rejected", url=url[:100])
            return []
        is_seen = (await check_seen(self._db_pool, [url])).get(url, False)
        if is_seen:
            return []
        return [DiscoveredURL(url=url)]
    except Exception as e:
        logger.error("website_discover_urls_raised", error=str(e), url=url[:100])
        return []
```

The `try/except Exception` wrapper enforces the "handlers never raise" contract (explicit per the reliability review). Add identical wrappers in each of the other three overrides.

**B. `RSSHandler.discover_urls`** (`app/handlers/rss.py:45-108`):

- **Wrap blocking `feedparser.parse()` in `asyncio.to_thread()`** — `feedparser` is synchronous; calling it from an `async def` without `to_thread` blocks the event loop for the duration of the feed HTTP GET + XML parse (the exact bug this refactor exists to eliminate). Verify the current code already does this; if not, fix now.
- Apply `_get_entry_date` pre-filter — per `rss-undated-entries-bypass-age-filter.md`: only reject on a concrete stale date, never silently drop undated entries.
- `filter_unseen` against dedup.
- For each surviving entry, attempt `seed_to_pre_extracted()` first with `seed_content = entry.content[0].value if entry.content else None`. Returns `None` when entry has no content / no date / fails validation → fall through to the plain `DiscoveredURL` below.
- Build:
  ```python
  DiscoveredURL(
      url=entry.link,
      seed_title=entry.title,
      seed_summary=getattr(entry, "summary", None) or None,
      seed_publication_date=pub_date_str,      # from _get_entry_date — may be None
      seed_content=(entry.content[0].value if entry.content else None),
      pre_extracted=pre,                       # None or the ArticleResponse from seed_to_pre_extracted
      extra={"extraction_source": "rss" if pre is not None else None},
  )
  ```
- `seed_content` stays local; `enqueue_bulk._row_context` does NOT persist it to JSONB (TOAST protection).
- Post-extraction age gate in `extract_one` remains — undated entries that fall through to drainer extraction have their recovered date re-checked there.

**C. `GoogleHandler.discover_urls`** (`app/handlers/google.py:39-127`):

- Call SERP API (existing).
- For each result, parse `pub_date` (existing `_extract_date_from_serp_result`).
- **Preserve the fail-closed undated-drop** at discovery (current `google.py:282-288`). Cheaper than dropping in `extract_one`.
- Drop stale-dated URLs here too.
- `filter_unseen`.
- Build `DiscoveredURL(url, seed_title, seed_summary, seed_publication_date, pre_extracted=None)`. No fast-path — SERP results never carry body content.

**D. `KeywordHandler.discover_urls`** (`app/handlers/keyword.py:50-195`, `244-306`):

Keyword fans out to Google + Tavily + (optional) Perplexity **concurrently** via `asyncio.gather(return_exceptions=True)` (explicit — the plan previously only said "in parallel"). Each leg has its own try/except returning `[]` on failure; `gather` absorbs residual exceptions.

```python
async def discover_urls(self, request, config):
    async def _google_leg() -> list[DiscoveredURL]:
        try:
            google_handler = get_handler("Google")
            if not google_handler:
                return []
            discovered = await google_handler.discover_urls(request, config)
            for d in discovered:
                d.source_override = "Google"    # first-class field; enqueue writes to source_type column
            return discovered
        except Exception as e:
            logger.error("keyword_google_leg_raised", error=str(e))
            return []

    async def _tavily_leg() -> list[DiscoveredURL]:
        try:
            # ... existing fan-out across Tavily variants, merge by URL ...
            # For each Tavily result:
            pre = seed_to_pre_extracted(
                seed_content=result.get("raw_content"),
                url=result["url"],
                seed_title=result.get("title"),
                seed_publication_date=result.get("published_date") or result.get("date"),
                seed_summary=result.get("content"),
                source_type="Keyword",
                source_name=request.source_name,
                source_category=request.source_category,
                prompt=request.prompt,
                additional_formats=request.additional_formats,
                max_age_days=config.max_age_days,
            )
            return [
                DiscoveredURL(
                    url=result["url"],
                    seed_title=result.get("title"),
                    seed_summary=result.get("content"),    # Tavily snippet
                    seed_publication_date=result.get("published_date") or result.get("date"),
                    # seed_content intentionally NOT retained on DiscoveredURL that hits enqueue
                    pre_extracted=pre,
                    extra={"extraction_source": "tavily" if pre is not None else None},
                )
                for result in ...
            ]
        except Exception as e:
            logger.error("keyword_tavily_leg_raised", error=str(e))
            return []

    async def _perplexity_leg() -> list[DiscoveredURL]:
        try:
            return await self._perplexity_urls_only(request, config)
        except Exception as e:
            logger.error("keyword_perplexity_leg_raised", error=str(e))
            return []

    results = await asyncio.gather(
        _google_leg(), _tavily_leg(), _perplexity_leg(), return_exceptions=True
    )

    # URL-level dedup across legs (existing pattern)
    merged: list[DiscoveredURL] = []
    seen: set[str] = set()
    for result in results:
        if isinstance(result, BaseException):
            continue
        for d in result:
            if d.url in seen:
                continue
            seen.add(d.url)
            merged.append(d)
    return merged
```

**Delete**: `_fetch_tavily_single`'s extraction half, `_process_tavily_results`, `_tavily_result_to_article`, `_url_to_article`, the `asyncio.Semaphore(16)` fan-out at `keyword.py:342`, and `_process_perplexity_citations`'s per-URL fetch loop. Keep only the discovery-phase helpers (Tavily API call, keyword-variant expansion, Perplexity citation fetch).

**Enqueue hook** (`app/queue/enqueue.py:62`) uses the first-class field:

```python
row_source_type = d.source_override or request.source_type
```

### Research insights (Phase 2)

- **`asyncio.gather(..., return_exceptions=True)` is the 2026 canonical pattern** for fan-out from an async orchestrator with partial-failure tolerance. Each leg's own try/except is still needed (gather + exception=True gives you a `BaseException` instance in the result list but doesn't log context). See https://docs.python.org/3/library/asyncio-task.html#asyncio.gather.
- **feedparser is synchronous** — always wrap in `asyncio.to_thread()` inside an async handler.
- **`DiscoveredURL.source_override` as typed field** catches typos at ruff-time with `Literal["Google", "Keyword", "RSS", "Website", "LinkedIn", "Instagram", "X", "Twitter"] | None`. Stronger than `extra: dict` smuggling.
- **Shared `seed_to_pre_extracted` helper** eliminates triplicate code across RSS and Tavily paths. A future handler that wants to pre-extract from seed content reuses it without reimplementing the age-gate pre-check.

#### Phase 3: Failure reason normalization (typed, two-dimensional)

Rather than concatenated colon-strings (`split_part` convention), use a `FailureReason` `StrEnum` + a separate `category` classification. This is the Kafka DLQ / Confluent pattern — retry policy keys off `category`, reporting/alerting keys off `reason`. Kills the `split_part(last_error, ':', 1)` dependency before it's introduced.

```python
# app/queue/reasons.py (NEW)
from enum import StrEnum

class FailureReason(StrEnum):
    ARTICLE_TOO_OLD = "article_too_old"
    CONTENT_INVALID = "content_invalid"
    NO_CONTENT = "no_content"
    FETCH_EXHAUSTED = "fetch_exhausted"
    EXTRACTOR_ERROR = "extractor_error"
    PRE_EXTRACTED_INVALID = "pre_extracted_invalid"
    MAX_ATTEMPTS_EXHAUSTED = "max_attempts_exhausted"

class FailureCategory(StrEnum):
    TRANSIENT = "transient"   # drainer will retry (→ waiting_retry)
    PERMANENT = "permanent"   # dead-letter on first hit (→ failed)
    # "poison" is implicit: PERMANENT + max_attempts reached
```

**Canonical mapping** (add to `app/queue/reasons.py`):

| FailureReason | FailureCategory | Mapping rule |
|---|---|---|
| `article_too_old` | permanent | pub_date older than max_age_days |
| `content_invalid` | permanent | `validate_content` returned false |
| `no_content` | permanent | `extract_article` produced empty content |
| `fetch_exhausted` | **transient** on 5xx/429/timeout/network, **permanent** on 4xx after retries | Classify via exception type / status code |
| `extractor_error` | permanent | `extract_article` raised unexpectedly |
| `pre_extracted_invalid` | permanent | pydantic validation of row.article_response failed |
| `max_attempts_exhausted` | permanent | always — dead-letter |

`ExtractOutcome.permanent()` / `.transient()` accept a `FailureReason` enum and optional detail string:

```python
# app/queue/extract.py
return ExtractOutcome.permanent(
    reason=FailureReason.ARTICLE_TOO_OLD,
    detail=None,
)
return ExtractOutcome.transient(
    reason=FailureReason.FETCH_EXHAUSTED,
    detail="network_timeout_after_3_retries",
)
```

**Stored shape in `url_work_queue.last_error`** (still a single TEXT column today, but now structured):

- Plain permanent: `"content_invalid:short_content"` (reason + optional detail, single colon).
- `max_attempts_exhausted` wraps the **original** reason so the dashboard can tell "exhausted transient" from "immediate permanent": `"max_attempts_exhausted:fetch_exhausted:network_timeout"`.
- `split_part(last_error, ':', 1)` still works as an escape hatch, but the preferred dashboard query becomes (after the deferred migration to a `failure_reason` column): `SELECT failure_reason, count(*) FROM url_work_queue WHERE status='failed' GROUP BY 1;`.

All changes land in `app/queue/extract.py::extract_one`, `app/queue/drain.py::_dispatch`, and the new `app/queue/reasons.py`.

### Research insights (Phase 3)

- **No universal industry taxonomy** exists — Sidekiq uses the exception class name, Celery DLQ uses exception class + traceback, SQS DLQ keeps payloads untagged with reasons via message attributes. The Kafka/Confluent DLQ pattern of `error.category` + `error.reason` as separate fields is the strongest convention and what this plan adopts. See https://www.confluent.io/learn/kafka-dead-letter-queue/ and https://www.kai-waehner.de/blog/2022/05/30/error-handling-via-dead-letter-queue-in-apache-kafka/.
- **`FailureReason` as a StrEnum** keeps `last_error = reason.value + (":" + detail if detail else "")` readable for humans while giving ruff/mypy a typed boundary. A future migration adding a `failure_reason VARCHAR(32)` column is now trivial: the enum is already the source of truth.
- **Pairing reason + category** means the drainer's retry decision (`outcome.category == TRANSIENT`) is separate from the dashboard's grouping (`WHERE reason = 'fetch_exhausted'`). The two concerns don't have to share a string.

#### Phase 4: Observability — `extract_path_taken` event (single emission site)

`ExtractPath` as a typed `StrEnum`, emitted at **one** site per extraction via an async context manager — avoids the 5 near-duplicate `logger.info(...)` calls that scatter otherwise and drift during future edits.

```python
# app/queue/extract.py

from enum import StrEnum
from contextlib import asynccontextmanager

class ExtractPath(StrEnum):
    PRE_EXTRACTED_APIFY = "pre_extracted_apify"
    PRE_EXTRACTED_TAVILY = "pre_extracted_tavily"
    PRE_EXTRACTED_RSS = "pre_extracted_rss"
    DIRECT = "direct"
    ZYTE = "zyte"

@dataclass
class _PathState:
    path: ExtractPath | None = None
    outcome: Literal["success", "transient", "permanent"] | None = None

@asynccontextmanager
async def _log_extract_path(row: QueueRow):
    start = time.perf_counter()
    state = _PathState()
    try:
        yield state
    finally:
        logger.info(
            "extract_path_taken",
            url_hash=row.url_hash,
            source_type=row.source_type,
            path=state.path.value if state.path else None,
            outcome=state.outcome,
            latency_ms=int((time.perf_counter() - start) * 1000),
        )

# In extract_one — usage:
async def extract_one(row, settings):
    async with _log_extract_path(row) as path_state:
        if row.article_response:
            path_state.path = ExtractPath(f"pre_extracted_{ctx.extraction_source or 'unknown'}")
            # ... validate + return success, set path_state.outcome = "success"
            return outcome

        # slow path — fetch_html, extract_article, etc.
        # set path_state.path = ExtractPath.ZYTE or ExtractPath.DIRECT based on whether
        # app.extraction.fetch_html emitted fetch_fallback_invoked for this URL
        # (threaded via a contextvar inside fetch_html — see "contextvar instrumentation" below).
```

**Path taxonomy** (as above): `pre_extracted_apify`, `pre_extracted_tavily`, `pre_extracted_rss`, `direct`, `zyte`.

**Distinguishing pre-extracted sources** reads `ctx.extraction_source` (populated by handlers in `DiscoveredURL.extra["extraction_source"]` at enqueue time — see Phase 2). LinkedIn/Instagram/X/Twitter handlers set it to `"apify"`; Tavily leg sets `"tavily"` on the pre_extracted result; RSS sets `"rss"`. Defaulting to `"unknown"` when absent tolerates old rows.

**Direct vs Zyte distinction**: `app/extraction.py::fetch_html` knows whether it used the Zyte fallback (it emits `fetch_fallback_invoked` / `fetch_fallback_success`). Thread this via a `contextvar` (structlog's `bind_contextvars` pattern):

```python
# app/extraction.py
from contextvars import ContextVar
_fetch_fallback_used: ContextVar[bool] = ContextVar("fetch_fallback_used", default=False)

async def fetch_html(url, settings):
    _fetch_fallback_used.set(False)
    # ... direct attempt ...
    if needs_fallback:
        _fetch_fallback_used.set(True)
        # ... Zyte call ...
```

`extract_one` reads `_fetch_fallback_used.get()` after `fetch_html` returns and sets `path_state.path = ExtractPath.ZYTE if used else ExtractPath.DIRECT`.

**Event-naming style decision (deliberate):** `extract_path_taken` uses flat snake_case, consistent with `extract_pre_extracted_invalid`, `extract_fetch_raised`, `search_request_started`, `fetch_fallback_invoked`. The codebase has one competing style — `drain_loop.started` (dotted) — but flat snake_case wins on event count. Do not adopt OpenTelemetry's `syntech.extraction.method` namespaced-dotted convention here; that would require changing every existing event to match or accepting mixed conventions. If OTel adoption happens later, it's a separate refactor.

### Research insights (Phase 4)

- **Context manager emission** is the 2026 structlog idiom for "one event per operation, regardless of return path or exception." Survives early returns, exceptions, `asyncio.CancelledError`. See https://www.structlog.org/en/stable/recipes.html.
- **`contextvars` + `asyncio.create_task`**: contextvars are copied one-way into the child task at schedule time (PEP 567). Setting a contextvar inside a drainer worker's `extract_one` does NOT leak to sibling rows processed concurrently via `asyncio.gather`. Safe for per-row `_fetch_fallback_used`. See https://www.structlog.org/en/stable/contextvars.html.
- **`clear_contextvars()` at drainer-tick boundaries** prevents accidental leakage across ticks. Add to `drain_loop`'s top-of-iteration: `structlog.contextvars.clear_contextvars()`.
- **OTel semconv alignment** deferred intentionally — no standard `extraction.method` attribute exists in OTel 1.40; would have to mint `syntech.extraction.method`. Not worth the mixed-convention cost today.

#### Phase 5: Tests

Test harness conventions (adopt in this PR, codify in `tests/conftest.py`):
- **Time freezing**: add `freezegun` as a dev dep. All new dated-entry tests use `@freeze_time("2026-04-24")`. Retrofit the existing 4 undated-date tests to match — without frozen time, any test using `max_age_days=30` with hardcoded dates drifts into flakiness.
- **Structlog capture**: canonical pattern is `with structlog.testing.capture_logs() as caplog:`. Add a `caplog_events` fixture in `conftest.py` that wraps this.
- **Mid-deploy ctx-shape fixture**: `legacy_ctx` fixture in `conftest.py` returns `{"source_type": ..., "source_name": ..., "source_category": ..., "prompt": None, "additional_formats": None, "test_mode": False}` (pre-refactor shape; no `v`, no `seeds`, no `url_or_keyword`, no `extraction_source`).

**Handler tests:**

- **`tests/test_keyword_handler.py`** — add:
  - `test_discover_urls_returns_seeded_discovered_urls`
  - `test_tavily_raw_content_at_boundary_becomes_pre_extracted` — parametrized over `[199, 200, 201]` chars × both `has_pub_date=True/False`, asserts pre_extracted is set only at len≥200 AND has pub_date.
  - `test_tavily_raw_content_without_publication_date_defers_to_drainer` — BLOCKING against rss-undated-entries-bypass-age-filter regression class.
  - `test_google_fanout_urls_get_source_override_google`
  - `test_fanout_legs_run_concurrently` — mocks Google leg with `asyncio.sleep(0.5)` + Tavily leg with `asyncio.sleep(0.5)`, asserts total elapsed < 0.8s (proves `asyncio.gather` not sequential).
  - `test_any_leg_raising_does_not_kill_discovery` — one leg raises, other legs still return results, `discover_urls` returns merged results with no KeyError.

- **`tests/test_rss_handler.py`** — add:
  - `test_discover_urls_entry_with_full_content_pre_extracts`
  - `test_discover_urls_entry_with_full_content_but_no_date_defers` — BLOCKING against regression.
  - `test_discover_urls_entry_without_content_defers`
  - `test_discover_urls_mixed_dated_undated_batch` — feed with `[fresh_dated, stale_dated, undated]`, asserts result has `[fresh, undated]` only.
  - `test_feedparser_wrapped_in_to_thread` — mock `feedparser.parse` to sleep 100ms, verify event loop wasn't blocked (other tasks could run concurrently).
  - Preserve the 4 existing undated-date tests; retrofit them with `@freeze_time`.

- **`tests/test_google_handler.py`** — add:
  - `test_discover_urls_drops_undated_results`
  - `test_discover_urls_drops_stale_results`
  - `test_discover_urls_populates_search_query_via_ctx` (indirect — asserts `ctx.url_or_keyword` is set on enqueued rows for Google-direct requests).

- **`tests/test_website_handler.py`** — add:
  - `test_discover_urls_returns_single_url`
  - `test_discover_urls_rejects_ssrf_urls`
  - `test_check_seen_failure_returns_empty_not_raise` — BLOCKING against "handlers never raise" contract.

**Queue + extract_one tests:**

- **`tests/test_queue_integration.py`** — add:
  - `test_extract_one_handles_legacy_ctx_without_seeds` (uses `legacy_ctx` fixture) — BLOCKING for rollback safety.
  - `test_extract_one_uses_seed_title_fallback_when_extraction_empty`
  - `test_extracted_title_beats_seed_title_when_both_present` — inverse direction; guards against accidental `seed or extracted` precedence.
  - `test_extract_one_uses_seed_publication_date_fallback`
  - `test_pre_extracted_fast_path_validates_model_before_success` — guards against "pydantic validation of row.article_response failed" dropping silently.
  - `test_article_response_json_roundtrip_is_lossless` — `ArticleResponse(...).model_dump(mode="json")` → `json.dumps` → `json.loads` → `ArticleResponse.model_validate(...)` equal to original.
  - `test_extract_path_taken_emitted_once_per_extraction` (parametrized over 5 ExtractPath variants × 3 outcomes) via `structlog.testing.capture_logs`.
  - `test_search_query_is_null_for_non_keyword_non_google_source_types` — BLOCKING against contract widening. Parametrized over `["RSS", "Website", "LinkedIn", "Instagram", "X", "Twitter"]`.
  - `test_search_query_populated_for_keyword_and_google_source_types` — the positive case.
  - `test_enqueue_bulk_preserves_source_category_in_ctx` — BLOCKING against the `1cbded5` regression shape.
  - `test_extract_one_populates_article_source_category_from_row` — BLOCKING against the same.
  - `test_drain_batch_mixed_legacy_and_new_schema_rows` — drainer claims a batch with one legacy row and one new row; both reach terminal state.
  - `test_enqueue_bulk_ctx_invariant_within_batch` — asserts all rows in a single `enqueue_bulk` call have identical non-seed ctx fields.
  - `test_enqueue_bulk_concurrent_same_url_preserves_first_ctx` — two parallel enqueues with overlapping URLs; ON CONFLICT DO NOTHING; asserts surviving row's ctx is deterministic.
  - `test_drain_loop_survives_extract_one_raise` — inject an unraisable into extract_one, assert drain_loop continues and next row is claimed (BLOCKING for reliability).

- **`tests/test_extract_failure_reasons.py`** (new) — parametrized over `FailureReason` enum:
  - Assert every `ExtractOutcome.permanent(reason=...)` writes `last_error` starting with `reason.value`.
  - Assert `max_attempts_exhausted` wraps the original reason: `"max_attempts_exhausted:fetch_exhausted:..."`.
  - Assert `category` maps correctly per the Phase 3 table (fetch_exhausted on 5xx → transient, fetch_exhausted on 4xx → permanent).

- **`tests/test_extract_path_taken.py`** (new) — isolated tests for the `_log_extract_path` context manager. Verifies single emission under: normal return, early return, unhandled exception, `asyncio.CancelledError`.

#### Phase 6: Cutover verification

Unchanged from the original plan — deploy to staging, run 50-source batch, verify p99s and webhook parity. Refinement: **loosen p99 target to <15s for Keyword/RSS, <10s for Google/Website** (Tavily fanout alone p99 is 8s; RSS feedparser on slow feeds occasionally exceeds 10s). Success criterion for this PR is "0 ECONNABORTED / 0 unexplained 503s," not absolute latency.

Also capture:
- `queue_claim_batch.claimed` rate vs `queue_enqueue.inserted` rate over the run — document the drainer's observed steady-state throughput.
- `oldest_queued_age_sec` p95 (new success metric — see Success Metrics section).
- `fetch_html` observed `len(html)` histogram (informs whether `MAX_CONTENT_LENGTH` can be safely lowered to 2 MB).
- Count `extract_path_taken` events by path; verify the distribution matches expectations (Apify/Tavily/RSS vs direct/zyte).

#### Phase 7: Drainer DB-write batching (performance)

Cut drainer per-tick DB-connection usage from ~13 to ~3 by batching the per-row `mark_ready` / `mark_retry` / `mark_failed` calls into single `UPDATE ... FROM (VALUES ...)` statements. Pattern:

```python
# app/queue/db.py — NEW helpers, replace per-row mark_* in drain.py's _dispatch loop

async def mark_batch(
    db_pool: DatabasePool,
    transitions: list[tuple[int, QueueRow, ExtractOutcome]],
) -> None:
    """Bulk update a batch of extract_one outcomes in 3 UPDATE statements (one per status)."""
    readys  = [(id, row, oc) for id, row, oc in transitions if oc.kind is SUCCESS]
    fails   = [(id, row, oc) for id, row, oc in transitions if oc.kind is PERMANENT or exhausted(row, oc)]
    retries = [(id, row, oc) for id, row, oc in transitions if oc.kind is TRANSIENT and not exhausted(row, oc)]

    if readys:  await _bulk_mark_ready(db_pool, readys)
    if fails:   await _bulk_mark_failed(db_pool, fails)
    if retries: await _bulk_mark_retry(db_pool, retries)
```

Each `_bulk_mark_*` issues a single `UPDATE url_work_queue SET ... FROM (VALUES %s) AS v(id, ...) WHERE url_work_queue.id = v.id`. Postgres handles this efficiently; psycopg's `execute_values` / manual VALUES-clause pattern works.

**Impact:**
- Pre: per-tick DB conns = 1 (claim) + `batch_size` × mark + 1 (status_counts) + 1 (flush check) = 13 at `batch_size=10`.
- Post: per-tick DB conns = 1 (claim) + 3 (bulk marks) + 1 (status_counts) + 1 (flush) = 6.
- Unblocks raising `drain_batch_size` from 10 to 20 safely against `DB_POOL_MAX_SIZE=15`. **Until this phase lands, cap `drain_batch_size` at `DB_POOL_MAX_SIZE // 2 = 7`.** The plan's earlier "raise to 20" guidance without batching was unsafe.

**Also in Phase 7:** add a `status_counts` cheap-mode — cache the result for 5 seconds rather than running `SELECT status, COUNT(*) ... GROUP BY 1` every tick. At 2500+ queue rows with 1 Hz polling, the uncached query becomes a seqscan-class DB load. `EXPLAIN ANALYZE` on a populated queue pre-deploy; if seqscan, add an index hint or accept the 5s cache staleness as the mitigation.

#### Phase 8: Drainer reliability (supervision, shutdown, memory)

**A. Task supervision.** The lifespan-created `drain_loop` task today has no done-callback; an unhandled exception silently kills it and the replica continues serving `/search` (enqueuing rows) while nothing drains. Add:

```python
# app/main.py inside lifespan

drain_task = asyncio.create_task(drain_loop(settings, db_pool), name="drain_loop")
app.state.drain_task = drain_task  # keep strong reference

def _on_drain_done(task: asyncio.Task):
    if task.cancelled():
        logger.info("drain_loop.cancelled")
        return
    exc = task.exception()
    if exc is not None:
        logger.error("drain_loop.died", error=str(exc), exc_info=exc)
        app.state.drainer_healthy = False  # /readyz flips to 503

drain_task.add_done_callback(_on_drain_done)
app.state.drainer_healthy = True
```

Update `/readyz` (`app/api/routes.py:43-79`) to consult `app.state.drainer_healthy` and return 503 if the drainer died. Railway's health check will restart the replica automatically.

**B. Heartbeat event.** Add a once-per-N-seconds `drain_loop.tick` log (N=10) emitting `queued`, `in_flight`, `ready`, `failed` counts. Absence of this heartbeat for >2 minutes is the alert rule: "drainer silent."

**C. Graceful shutdown.** On lifespan shutdown:

```python
# Release in_flight rows this replica holds, so the next replica picks them up immediately.
# Without this, Railway redeploys orphan up to DRAIN_BATCH_SIZE rows for STALE_LOCK_SEC (10 min).
drain_task.cancel()
with contextlib.suppress(asyncio.CancelledError):
    await drain_task

if db_pool.enabled:
    async with db_pool.connection() as conn:
        await conn.execute(
            """
            UPDATE content_sourcing.url_work_queue
            SET status = 'queued', locked_at = NULL, locked_by = NULL
            WHERE status = 'in_flight' AND locked_by = %s
            """,
            (settings.replica_id,),  # assumes replica_id column or session-scoped marker
        )
```

Requires either a `locked_by` column on `url_work_queue` (if absent today, skip this optimization and accept the 10-min window) or a replica-scoped session id. Add as a follow-up if the column doesn't exist.

**D. Memory safety in extract_one batch gather.** `drain.py:64` uses `asyncio.gather(*(extract_one(row, settings) for row in rows))`. At `drain_batch_size=10` × `MAX_CONTENT_LENGTH=10 MB`, peak transient RAM is ~100 MB of HTML + ~200 MB of trafilatura AST → ~300-400 MB spikes per batch. On a 512 MB Railway replica, that's near the limit.

Fix: add an internal semaphore inside the gather to cap concurrent `fetch_html` without shrinking batch size (so DB work stays batched):

```python
_fetch_sem = asyncio.Semaphore(5)  # module-level

async def extract_one(row, settings):
    async with _log_extract_path(row) as path_state:
        if row.article_response:
            # pre_extracted path — no fetch, no memory pressure
            ...
            return outcome
        async with _fetch_sem:
            html = await fetch_html(row.url, settings=settings)
        # process html outside the semaphore — release the lock ASAP
        ...
```

Peak transient RAM drops from ~400 MB to ~200 MB. Monitor `fetch_html` `len(html)` histogram in Phase 6; if p99 < 500 KB (likely), consider lowering `MAX_CONTENT_LENGTH` to 2 MB as a separate tightening.

### Research insights (Phase 7 + Phase 8)

- **Batched UPDATE via `UPDATE ... FROM (VALUES ...)`** is the psycopg 3 / asyncpg canonical bulk-update pattern, avoiding N round-trips for N rows. See https://www.postgresql.org/docs/current/sql-update.html and https://www.psycopg.org/psycopg3/docs/basic/copy.html (for alternatives).
- **FastAPI lifespan task supervision with `add_done_callback`** is the 2026 idiom; without it, `asyncio.create_task` exceptions vanish silently. See https://leapcell.io/blog/understanding-pitfalls-of-async-task-management-in-fastapi-requests.
- **`SELECT ... GROUP BY status` on a growing queue** can drift into seqscan territory even with a status index, because Postgres may not pick the index for a GROUP BY on a low-cardinality column without statistics. `EXPLAIN ANALYZE` is mandatory before deploy; short-cache is the cheapest mitigation.
- **Railway replica memory budget** is typically 512 MB–1 GB unless explicitly raised. Running trafilatura on 10 MB HTML in parallel across a batch pushes toward OOM without the internal semaphore.

#### Phase 6: Cutover verification

- Deploy to Railway staging.
- Run a 50-source sourcing batch from n8n.
- Verify `/search` p99 drops below 10s for Keyword/Google/RSS/Website sources, remains under 120s for Apify sources.
- Verify webhook flush still delivers complete article batches (no regression in article count vs. the pre-refactor run).
- Verify no 503 / ECONNABORTED errors in n8n logs across the 50-source batch.
- `/admin/queue/status` shows healthy transitions: `queued` peaks during enqueue, `in_flight` peaks during drain, `ready` accumulates, flush fires on predicate + settle.

## Alternative Approaches Considered

1. **Horizontally scale replicas + add `pg_try_advisory_lock` to flush.** Rejected as primary fix: doesn't address the root cause (inline extraction is wasteful regardless of replica count). Retained as **deferred work** in case herd persists post-refactor.

2. **Source-type routing in n8n** — different `Split In Batches` configs per source type. Rejected: user-facing complexity for a backend problem; also, the fix below makes the routing pointless.

3. **Further raise discovery timeouts + DB pool size.** Rejected: masks the issue, reappears at higher volumes (same argument the parent requirements doc rejected for its own round). No `db_pool_timeout` in logs anyway.

4. **Split `/search` into `/discover` and `/extract`.** Rejected: the url_work_queue already is that split — it just wasn't honored. Adding HTTP endpoints duplicates what the queue does.

5. **Migrate `url_work_queue` with new columns for seeds** (instead of JSONB). Rejected for this PR: schema migrations on a live queue add risk, and JSONB nested under an existing column is zero-risk. Revisit when dashboard work adds a `failure_reason` enum column.

## System-Wide Impact

### Interaction Graph

```
POST /search (routes.py:82)
  └─▶ handler.discover_urls(request, config)      [NEW: 4 handlers override]
       │
       ├─ RSS: feedparser → filter_unseen → seed build (+ pre_extracted if content≥200)
       ├─ Google: serpapi → undated-drop → stale-drop → filter_unseen → seed build
       ├─ Keyword: Google leg + Tavily leg merge → seed build (+ pre_extracted if raw_content≥200)
       ├─ Website: SSRF + dedup → single DiscoveredURL
       └─ Apify (unchanged): fetch() → pre_extracted for every result
  └─▶ enqueue_bulk(discovered)                     [MODIFIED: per-row ctx, source_override]
       └─▶ INSERT ON CONFLICT DO NOTHING → rows land 'queued' or 'ready'
  └─▶ mark_seen(fresh URLs)                        [UNCHANGED]
  └─▶ return {"status": "queued", "queued": N, "skipped_dedup": M}

drain_loop (drain.py):
  └─▶ claim_batch (FOR UPDATE SKIP LOCKED)          [UNCHANGED]
  └─▶ extract_one(row)                              [MODIFIED]
       │
       ├─ row.article_response: emit extract_path_taken(pre_extracted_*), return success
       └─ else:
          │
          ├─ fetch_html → extract_article → validate_content → is_article_too_old
          ├─ build ArticleResponse using seeds + url_or_keyword from ctx
          └─ emit extract_path_taken(direct | zyte), return outcome

  └─▶ _dispatch(outcome) → mark_ready | mark_retry | mark_failed [normalized reason]
  └─▶ check_and_flush → webhook POST (unchanged)
```

### Error & Failure Propagation

- Handlers `discover_urls` must preserve the "never raise" contract (see `app/handlers/keyword.py:171-176`). Failures log and return `[]`.
- `enqueue_bulk` still uses `ON CONFLICT DO NOTHING` — race-safe against concurrent `/search` calls for the same URL.
- `extract_one` never raises (contract); every failure maps to `ExtractOutcome.permanent` or `ExtractOutcome.transient` with a normalized reason string.
- **Failure cascade the dashboard will care about**: transient `fetch_exhausted` loops should show up as `waiting_retry` rows with growing `attempts`. Dead-letter hits at `max_attempts` (default 50).

### State Lifecycle Risks

- **Seed metadata loss if enqueue succeeds but extract fails permanently**: row ends up in `failed` with no article. Seeds (title/summary/date) are still in `request_context` for a future re-queue operation — admin can inspect `/admin/queue/failed`. No silent data loss.
- **Old queue rows mid-deploy**: rows enqueued by the pre-refactor code have `pre_extracted` set and no `seeds` in ctx. `extract_one`'s pre_extracted fast-path handles them unchanged. Rollback-safe in both directions.
- **RSS undated-age regression**: *explicitly guarded against* — the `rss-undated-entries-bypass-age-filter` fix stays in place via the post-fetch gate in `extract_one` (line 103).

### API Surface Parity

- `POST /search` response shape unchanged: `{"status": "queued", "queued": N, "skipped_dedup": M, "source_name": ..., "source_type": ...}`.
- Webhook flush payload unchanged: `{"articles": [...], "articles_returned": N, ...}`.
- `ArticleResponse` schema unchanged — seed fallbacks populate the same fields the inline path used. Honors `feedback_output_fields_are_schema`.
- `/admin/queue/status`, `/admin/queue/failed` unchanged.

### Integration Test Scenarios

1. **50-source Apify+Keyword mix**: every source returns `queued: N` in <10s; drainer processes in background; single webhook flush after settle; no 503/ECONNABORTED.
2. **Tavily raw_content present**: URL lands as `ready` immediately, no drainer fetch_html call, `extract_path_taken=pre_extracted_tavily` logged.
3. **Tavily raw_content absent + target site Zyte-banned**: URL lands as `queued`, drainer attempts direct → garbled → Zyte → 520 ban → `fetch_exhausted:exhausted` after retries → `failed` at `max_attempts_exhausted`.
4. **Google fanout under Keyword request**: enqueued rows have `source_type="Google"` (not `"Keyword"`), Tavily-fanout rows have `source_type="Keyword"`, both deliver to the same webhook.
5. **Railway restart mid-extraction**: rows in `in_flight` recover via stale-lock sweep after `STALE_LOCK_SEC`; `queued` rows untouched; drainer resumes.

## Acceptance Criteria

### Functional Requirements

- [ ] `WebsiteHandler.discover_urls` returns a single `DiscoveredURL` (no HTML fetch in request path). Wrapped in try/except to honor "never raise" contract.
- [ ] `RSSHandler.discover_urls` wraps `feedparser.parse()` in `asyncio.to_thread()`; returns URLs with seed_title/summary/pub_date; pre_extracted only when embedded content ≥200 chars AND has a concrete pub_date AND passes age gate.
- [ ] `GoogleHandler.discover_urls` drops undated + stale results at discovery; returns URLs with seed_title/summary/pub_date.
- [ ] `KeywordHandler.discover_urls` fans out Google + Tavily + Perplexity concurrently via `asyncio.gather(return_exceptions=True)`; each leg has its own try/except; Google URLs carry `source_override="Google"` as a typed first-class field; Tavily URLs go through `seed_to_pre_extracted` helper which enforces the age gate before attaching pre_extracted.
- [ ] Apify handlers (LinkedIn/Instagram/X/Twitter) unchanged; enqueue with `extra["extraction_source"]="apify"` so drainer logs `extract_path_taken=pre_extracted_apify`.
- [ ] `DiscoveredURL` gains typed `source_override: str | None = None` field. `extra: dict` keeps `extraction_source` only.
- [ ] `RequestContext` pydantic model added to `app/queue/schema.py` with `v=1` schema version and `extra="ignore"`.
- [ ] `request_context` JSONB carries `v`, `url_or_keyword` (only when source_type in {Keyword, Google}), `seeds.{title,summary,publication_date,author}`, `extraction_source`. Never `seed_content` (TOAST trap).
- [ ] `extract_one` validates row.request_context through `RequestContext.model_validate()` — no ad-hoc `ctx.get()` calls. Uses seed metadata as fallbacks only when extraction is empty.
- [ ] `ArticleResponse.search_query` is non-null ONLY when `row.source_type in ("Keyword", "Google")` — parametrized test guards this.
- [ ] `FailureReason` StrEnum + `FailureCategory` StrEnum added in `app/queue/reasons.py`. `ExtractOutcome.permanent()` / `.transient()` accept typed `FailureReason` + optional detail.
- [ ] `last_error` strings take form `"{reason.value}[:{detail}]"`; `max_attempts_exhausted` wraps the original reason (`"max_attempts_exhausted:fetch_exhausted:..."`).
- [ ] `extract_path_taken` event emitted exactly once per extraction via `_log_extract_path` async context manager. `path` is a typed `ExtractPath` StrEnum value. `outcome` ∈ {success, transient, permanent}. Includes `latency_ms`.
- [ ] `structlog.contextvars.clear_contextvars()` called at top of each drain_loop iteration.
- [ ] Drainer DB writes batched via `mark_batch` (Phase 7) — per-tick pool checkouts ≤ 6 (not 13).
- [ ] Drain loop task has `add_done_callback` that flips `app.state.drainer_healthy = False` on unhandled exception; `/readyz` consults that flag.
- [ ] Drainer emits `drain_loop.tick` heartbeat log every ~10s with status counts.
- [ ] Lifespan shutdown cancels the drain task cleanly and releases in_flight rows (if `locked_by` column exists).
- [ ] Internal `asyncio.Semaphore(5)` inside extract_one gather caps concurrent `fetch_html` calls.
- [ ] Old `fetch()` methods on the 4 refactored handlers are **deleted** in this PR (not preserved as `_fetch_and_extract_inline`).

### Non-Functional Requirements

- [ ] `/search` p99 latency for **Google/Website**: **< 10 seconds** (from 60–130s).
- [ ] `/search` p99 latency for **Keyword/RSS**: **< 15 seconds** (Tavily fanout p99 + RSS feedparser tail can push past 10s).
- [ ] `/search` p99 latency for LinkedIn/Instagram/X/Twitter: **< 120 seconds** (unchanged — Apify-bound).
- [ ] 503 / ECONNABORTED rate in n8n's Call Content Sourcing node: **0 unexplained** on a 50-source batch.
- [ ] **NEW**: `oldest_queued_age_sec` p95 during a 500-URL burst: **< 10 minutes** (proves drainer absorbs discovery rate).
- [ ] No regression in delivered article count vs. pre-refactor baseline. Direction: post-refactor count ≥ baseline (drainer retries can rescue transient failures that previously surfaced as permanent).
- [ ] Webhook still fires exactly once per sourcing burst (settle predicate preserved).
- [ ] Memory: peak transient RAM per drainer batch < 250 MB (observable via Railway metrics). Without the semaphore this can hit 400 MB.

### Quality Gates

- [ ] ruff clean (`ruff check .` in `syntech-content-sourcing`).
- [ ] pytest green (`pytest -m 'not integration'` — matches `pyproject.toml` default). New test count: ~30 new tests across Phase 5.
- [ ] `freezegun` added to dev deps; existing undated-date tests retrofitted with `@freeze_time`.
- [ ] `/admin/queue/status` inspected on staging before prod cutover — `queued` drains to 0 under load, `ready` accumulates, flush fires, `oldest_queued_age_sec` stays bounded.
- [ ] Staging run completes a 50-source batch with 0 unexplained errors before prod deploy.
- [ ] `EXPLAIN ANALYZE` of `status_counts` query on a populated queue — confirm index scan or cache (Phase 7).

## Success Metrics

- `/search` p99 latency drop (measured via structlog `search_request_completed.latency_ms`): from 70–130s → <10s for non-Apify sources.
- Drainer throughput (measured via `queue_claim_batch.claimed` rate): should absorb the extraction load; tune `DRAIN_BATCH_SIZE` if `in_flight` persistently >= batch size.
- Error rate in n8n's Call Content Sourcing node: 25 → 0 per 50-source run.
- No new categories of failed rows (monitor `failed` counts by normalized reason for 7 days post-deploy).

## Dependencies & Prerequisites

- **Parent architecture:** [url_work_queue requirements](../brainstorms/2026-04-23-sourcing-url-work-queue-requirements.md) + its [plan](2026-04-23-001-feat-sourcing-url-work-queue-plan.md). This plan **completes** those — both assume the queue machinery (drainer, settle timer, stale-lock, admin endpoints) is already live. It is, per memory `project_url_work_queue_live.md`.
- **No new infra.** Same Neon pooler, same Railway replica, same webhook URL.
- **No contract change.** `ArticleResponse` shape unchanged; webhook envelope unchanged; `/search` response unchanged.
- **Anti-bot fallback** (`docs/plans/2026-04-22-003-feat-anti-bot-fallback-plan.md`) already deployed — the Zyte path the drainer uses is live.

## Risk Analysis & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | `search_query` contract widens to all source_types | **High** if Phase 1 shipped without the source-type gate | Medium — RSS/Website/LinkedIn articles regress | Phase 1 gates `search_query` on `source_type in ("Keyword", "Google")`. BLOCKING test `test_search_query_is_null_for_non_keyword_non_google_source_types` (parametrized). |
| R2 | Pre_extracted fast-path bypasses age gate (rss-undated-entries-bypass-age-filter regression class) | **High** if `seed_to_pre_extracted` shipped without date-required check | **High** — 42+ stale articles already hit prod once this way | `seed_to_pre_extracted` returns `None` when `seed_publication_date is None` or `is_article_too_old`. BLOCKING tests `test_tavily_raw_content_without_publication_date_defers_to_drainer` + `test_discover_urls_entry_with_full_content_but_no_date_defers`. |
| R3 | source_category regression (matches shape of `1cbded5` incident) | Medium — ctx assembly restructured from shared-per-batch to per-row | **High** — downstream Notion routing and classifier tagging break | BLOCKING tests `test_enqueue_bulk_preserves_source_category_in_ctx` + `test_extract_one_populates_article_source_category_from_row`. Also the per-batch-invariant test. |
| R4 | Old queue rows (pre-refactor JSONB shape) fail in new extract_one | Low | Medium — drainer raises on missing keys | `RequestContext.model_validate(..., extra="ignore")` with every field defaulted tolerates old shape. BLOCKING test `test_extract_one_handles_legacy_ctx_without_seeds` + `test_drain_batch_mixed_legacy_and_new_schema_rows`. |
| R5 | Drainer task dies silently; `/search` keeps enqueuing, nothing drains | Medium | **High** — full data loss until replica restart | Phase 8 supervision wrapper + `/readyz` gate + heartbeat event. BLOCKING test `test_drain_loop_survives_extract_one_raise`. |
| R6 | Drainer throughput < enqueue rate at target scale (2500-URL burst) | Medium | Medium — webhook flush delayed >30 min; settle window may miss | Phase 7 batch mark_* cuts DB-conn pressure. Phase 8D semaphore caps memory. Phase 6 measures observed throughput. Deferred §1 (replicas + advisory lock) unblocked by Phase 7. |
| R7 | Retry storm on Zyte recovery hammers Zyte simultaneously | Medium | Medium — recovery converts transient outage to prolonged one | Deferred §6 (Zyte circuit breaker + jittered backoff). Monitor `zyte_fallback_invoked` rate post-deploy; alert if spike. |
| R8 | Memory pressure on single Railway replica (10 × 10 MB HTML batches) | Medium | Medium — OOM kills replica, triggers restart loop | Phase 8D internal `Semaphore(5)` on `fetch_html`. Phase 6 captures `len(html)` histogram to validate future tightening of `MAX_CONTENT_LENGTH` to 2 MB. |
| R9 | Racing concurrent `/search` calls for same URL produce divergent per-row ctx | Low | Low — ON CONFLICT DO NOTHING already wins one; other is silently dropped | Test `test_enqueue_bulk_concurrent_same_url_preserves_first_ctx` documents the winner semantics. |
| R10 | DB pool contention shifts from long-hold (inline extraction) to short-burst (drainer marks) | Medium | Low-Medium — if Phase 7 not landed, pool saturation at high queue depth | Phase 7 batching. Until it lands, cap `drain_batch_size ≤ DB_POOL_MAX_SIZE / 2 = 7`. |
| R11 | `status_counts` query becomes seqscan at scale (1 Hz polling) | Low-Medium | Medium — elevated DB CPU during bursts | `EXPLAIN ANALYZE` pre-deploy; 5s cache in Phase 7 if seqscan confirmed. |
| R12 | Graceful shutdown orphans in_flight rows for STALE_LOCK_SEC (10 min) on every redeploy | Medium | Low — stale-lock sweep recovers; just adds 10 min latency to those rows | Phase 8C shutdown hook releases in_flight rows held by this replica (if `locked_by` column exists). |
| R13 | Article count regression vs. baseline | Low | **High** — lost articles in n8n downstream | `fetch_html` is the same function in both paths. Phase 6 staging compares counts. Direction expected: post-refactor ≥ baseline. |
| R14 | `source_override` as new typed field breaks older serialization / tests | Low | Low | Default `= None`; only set by Keyword handler Google leg. All enqueue paths unchanged unless explicitly setting it. |

## Deferred / Future Work

Captured here so we don't rediscover them next time we hit herd problems.

### 1. Flush-path advisory lock + horizontal replicas

**When to do it:** If post-refactor monitoring shows 503s returning under load despite lightweight `/search`.

**What's needed:**
- Wrap `check_and_flush` in `pg_try_advisory_lock` (scoped by a stable key, e.g. `hashtext('url_work_queue_flush')`). Only the lock-holder fires `flush_once`.
- Each replica's in-memory `SettleState` becomes best-effort; the lock is the source of truth.
- Stress-test with 2 replicas hammering the same queue.
- Only then scale Railway to 2 replicas.

### 2. n8n source-type routing

**When to do it:** If a single replica + lightweight `/search` still can't absorb Apify bursts.

**What's needed:** Split the Call Content Sourcing node by source type, run LinkedIn/Instagram/X with lower concurrency (batchSize=2, wait=60s) while Keyword/Google/RSS/Website run at full batch.

### 3. `failure_reason` enum column

**When to do it:** When the main dashboard adds a "queue failures" view.

**What's needed:** Migration to add `failure_reason` varchar(32) NOT NULL DEFAULT '' on `content_sourcing.url_work_queue`. Backfill from `split_part(last_error, ':', 1)` for existing rows. Update `mark_failed` / `mark_retry` to write to the column. Drop the `split_part` dashboard query. Zero-downtime with `status IN (...) DEFAULT '' NOT NULL` + backfill job.

### 4. Two-tier queue (discovery / extraction)

**When to do it:** If Apify discovery (120s per request) becomes the new bottleneck *after* this plan ships.

**What's needed:** separate `discovery_work_queue` for Apify requests with its own drainer. Out-of-scope speculation today.

### 5. Seed-only fallback article

**When to do it:** If users complain that Zyte-banned URLs vanish entirely from Notion instead of showing up with Tavily's snippet.

**What's needed:** In `extract_one`, on `fetch_exhausted` after max_attempts, build a minimal `ArticleResponse` from `seed_title + seed_summary + seed_publication_date` and return `success` instead of `permanent`. Requires downstream classifier to accept short-content articles — currently it does not.

### 6. Zyte circuit breaker + jittered backoff (reliability hardening)

**When to do it:** If a Zyte outage triggers a retry storm — observable as a spike in `fetch_fallback_invoked` followed by a spike in `fetch_fallback_error`, followed by the whole queue bouncing through `waiting_retry`.

**What's needed:**
- Module-level semaphore capping concurrent Zyte calls across all drainer workers (e.g. `asyncio.Semaphore(8)`).
- Circuit breaker: if Zyte error rate >50% over a 5-minute rolling window, short-circuit to `fetch_exhausted:circuit_open` without calling Zyte for a cooldown (e.g. 2 min).
- Add ±25% jitter to the retry backoff schedule in `app/queue/backoff.py::compute_backoff_sec` to prevent synchronized convoys on recovery.
- Alert rule: `fetch_fallback_error` rate > N/min → ops notified.

### 7. `failure_reason` + `failure_category` columns (dashboard readiness)

**When to do it:** When the main dashboard begins surfacing queue-failure analytics.

**What's needed:** Migration adding:
- `failure_reason VARCHAR(32) NULL` (values from `FailureReason` enum)
- `failure_category VARCHAR(16) NULL` (values from `FailureCategory` enum)

Backfill from existing `last_error` via `split_part(last_error, ':', 1)`. Update `mark_failed` / `mark_retry` to write the columns alongside `last_error`. Drop the `split_part` convention from future dashboard queries. Zero-downtime (NULL-allowed ADD COLUMN).

### 8. Seed columns migration (dashboard ergonomics)

**When to do it:** Co-landed with §7, if the dashboard shows seed_title / seed_publication_date in the `/admin/queue/failed` view.

**What's needed:** Migration adding `seed_title VARCHAR(500) NULL`, `seed_publication_date VARCHAR(64) NULL`. Backfill from `request_context->'seeds'`. Keep `seed_summary`, `seed_author` in JSONB (less-queried). This is the compromise between "columns now" (architecture review's recommendation) and "JSONB forever" (simplicity review).

### 9. Failed-row retention / archival policy

**When to do it:** When `SELECT count(*) FROM url_work_queue WHERE status='failed'` crosses ~100k rows, or queue table size exceeds ~100 MB.

**What's needed:** Scheduled job deleting `failed` rows older than 90 days, OR archival to a cold table (`url_work_queue_archive`). Without this, JSONB + seed metadata accumulates unbounded at ~1–4 KB per failed row.

### 10. Delete old `fetch()` methods — **NOT deferred** (in-PR)

Originally queued as a 2-week follow-up. Consensus across reviewers: rollback is `git revert`, not preserved dead code. The deletion happens in this PR. No follow-up.

### 11. Deprecated: `_fetch_and_extract_inline` preservation

Intentionally removed from this plan. Listed here only so a future reader who remembers the idea sees why it was rejected: four reviewers flagged it as dead-code pretending to be a safety net with no forcing function to remove it. Rollback via `git revert <merge-sha>` is the mechanism.

## Documentation Plan

- **This plan** (you are reading it) — lives in `syntech-n8n-as-code/docs/plans/` per project convention.
- **Module docstrings** — update `app/handlers/keyword.py`, `google.py`, `rss.py`, `website.py` top-of-file docstrings to name which operations happen at discovery vs. extraction, and to document the undated-entries policy per handler (per the `rss-undated-entries-bypass-age-filter` prevention checklist).
- **`extract_one` docstring** — document the seed fallback order: extracted → seed → default.
- **No changes to AGENTS.md or README** — the refactor is invisible to callers.

## Runbook — diagnosing future 503 / ECONNABORTED bursts

When n8n surfaces errors from `Call Content Sourcing`, work through these in order:

### Step 1 — Identify the error class

```
n8n error.status = 503, error.code = "ERR_BAD_RESPONSE"
  → Either app-level (PoolTimeout → 503) or Railway edge (replica slow / unreachable)

n8n error.status = null, error.code = "ECONNABORTED"
  → Client timeout. n8n's HTTP node exceeded `options.timeout`. Server may or may not still be processing.
```

### Step 2 — Check Railway logs for matching request IDs

```bash
# In Railway dashboard, filter service=syntech-content-sourcing, time window = n8n error window
# Look for:
jq '[.[] | select(.attributes.event == "db_pool_timeout")]' logs.json
jq '[.[] | select(.attributes.event == "search_discovery_timeout")]' logs.json
jq '[.[] | select(.attributes.event == "search_request_completed") | {src: .attributes.source_name, latency: .attributes.latency_ms}] | sort_by(-.latency)' logs.json
```

If `db_pool_timeout` is present → pool is saturated. Jump to step 5.
If `search_discovery_timeout` is present → the handler is timing out. Jump to step 4.
If neither is present but latencies are high (>30s) → Railway edge is dropping slow connections. Jump to step 3.

### Step 3 — Replica health

- `jq '[.[] | .tags.replica] | unique' logs.json` — if only one replica is running and serving a flood, that's the problem. Scale (see Deferred Work §1 for the safe path).
- Check `/readyz` during the incident window.
- Railway's edge idle-timeout for HTTP is ~5m; a single replica swamped by long-running `/search` calls can trip it.

### Step 4 — Discovery timeout root cause

- Which handler? Check `source_type` on the `search_discovery_timeout` events.
- **Keyword / Google / RSS / Website (post-refactor)**: these should never hit timeout — discovery is cheap. If they do, something regressed — inspect the override was not silently removed.
- **LinkedIn / Instagram / X / Twitter**: Apify is slow. 120s timeout is the cap. Check Apify console for actor health. Don't raise the timeout blindly — raise `max_concurrent_apify` in the request instead, or route those sources separately (Deferred §2).

### Step 5 — DB pool saturation

- `/admin/queue/status` — are `in_flight` + `queued` absurdly high?
- `DB_POOL_MAX_SIZE` on Railway → current 15. Check via env. Raising to 20 is safe with Neon pooler (pooler supports 10k connections).
- Confirm `check=AsyncConnectionPool.check_connection` is still set (regressing this bites; see [Neon pooler SSL solution](../../../syntech-article-classifier/docs/solutions/database-issues/neon-pooler-ssl-closed-psycopg-async-pool.md)).

### Step 6 — Drainer health

- **Heartbeat check**: grep Railway logs for `drain_loop.tick` in the last 2 minutes. If absent → drainer is dead. Check `/readyz` — should be 503. If Railway didn't auto-restart, restart manually.
- **Done-callback log**: search for `drain_loop.died` — if present, the task raised an unhandled exception. Capture the traceback.
- **Queue depth**: `/admin/queue/status` — `queued` and `in_flight` counts. If `queued` is high and not shrinking, either drainer is dead or throughput is insufficient (see Step 7).

### Step 7 — Drainer throughput (post-refactor specific)

- **Compare enqueue rate vs. claim rate**: in Railway logs, count `queue_enqueue` events per minute vs. `queue_claim_batch.claimed` per minute over the incident window.
- **Zyte saturation**: high `fetch_fallback_invoked` count → target sites are actively rate-limiting. Expected during partial outages; sustained spikes warrant the circuit breaker (Deferred §6).
- **Extract path distribution**: group `extract_path_taken` by `path` — if `zyte` events dominate, direct fetches are failing en masse, which is a Zyte-side signal not a drainer-side one.

### Step 8 — Dashboard queries for post-mortem

Useful `url_work_queue` queries (replace date window):

```sql
-- Failure distribution by reason (first colon-separated token)
SELECT split_part(last_error, ':', 1) AS reason, count(*)
FROM content_sourcing.url_work_queue
WHERE status = 'failed' AND updated_at > now() - interval '1 day'
GROUP BY 1 ORDER BY 2 DESC;

-- Exhausted-transient vs. immediate-permanent breakdown
-- (after Phase 3 normalization: max_attempts_exhausted:<original_reason>:<detail>)
SELECT
  split_part(last_error, ':', 1) AS outer_reason,
  split_part(last_error, ':', 2) AS inner_reason,
  count(*)
FROM content_sourcing.url_work_queue
WHERE status = 'failed'
GROUP BY 1, 2 ORDER BY 3 DESC;

-- Stuck queued / in_flight
SELECT status, count(*), min(created_at), max(created_at)
FROM content_sourcing.url_work_queue
WHERE status IN ('queued', 'in_flight') GROUP BY 1;

-- Oldest queued age (should be < 10 min under normal load post-refactor)
SELECT EXTRACT(EPOCH FROM (now() - min(created_at))) AS oldest_queued_age_sec
FROM content_sourcing.url_work_queue
WHERE status = 'queued';
```

## Rollback Plan

Rollback is a single `git revert <merge-commit-sha>`. The old `fetch()` methods are NOT preserved as dead code inside each handler — the `git revert` restores them from VCS. Four reviewers independently flagged the "preserved for rollback" pattern as dead-code debt with no forcing function for removal; the revert is the mechanism.

**Effect of revert:**
- Handlers regain their old `fetch()` method and the default `BaseHandler.discover_urls` delegation. Pre-refactor behavior returns.
- Queue rows mid-flight at revert time are safe — `extract_one`'s pre_extracted fast-path handles the pre-refactor shape unchanged.
- New rows enqueued post-revert go through the old inline path.

**Backward-compatibility requirements for the revert to be safe** (both must hold):
1. `extract_one` (reverted) must tolerate new rows with `seeds`, `url_or_keyword`, `extraction_source` in `request_context`. It does — pre-refactor `extract_one` reads `ctx["max_age_days"]` only and ignores other keys.
2. `enqueue_bulk` (reverted) must tolerate `DiscoveredURL.source_override` presence. It does — pre-refactor code doesn't read `source_override`, so the field is simply ignored.

**Partial-revert hazard:** a revert that reverts `keyword.py` but not `enqueue.py` (or vice versa) can silently degrade. Make sure the revert covers all 4 handler files + `enqueue.py` + `extract.py` + `schema.py` + `reasons.py` atomically. The merge commit handles this if the PR was a single merge; cherry-pick reverts must include the full file set.

**Pre-cutover git tag** per the [n8n cutover runbook](../solutions/2026-n8n-to-microservice-cutover.md): `pre-defer-extraction-2026-04-24`.

**No data migration required either direction.** JSONB request_context shape extension is additive and backward-compatible. Old rows validate through the new `RequestContext` model via `extra="ignore"`. New rows validate through the old ctx reader via key-by-key `.get()` (old reader only cares about `max_age_days`).

## Sources & References

### Origin Architecture (parent decisions this plan completes)

- **[url_work_queue requirements](../brainstorms/2026-04-23-sourcing-url-work-queue-requirements.md)** — R4/R5 specify the discovery/extraction split this plan implements. R17 defines the transient/permanent outcome taxonomy the normalized vocabulary aligns with. R19 defines the structured event convention the new `extract_path_taken` event extends.
- **[url_work_queue plan](2026-04-23-001-feat-sourcing-url-work-queue-plan.md)** — the implementation plan for the parent, which left `discover_urls` overrides as implicit.

### Internal code references

- `app/handlers/base.py:14-34` — `DiscoveredURL` dataclass with the 6 seed fields (already in place).
- `app/handlers/base.py:139-155` — default `discover_urls` the 4 handlers will override.
- `app/handlers/keyword.py:50-195, 244-306` — current fetch-and-extract logic; split points marked in Phase 2.
- `app/handlers/google.py:39-127, 224-316` — current flow; undated-drop at 282-288 stays.
- `app/handlers/rss.py:45-108, 126-219` — current flow; pre-filter at 78-82 needs the post-fetch gate discipline.
- `app/handlers/website.py:35-` — trivial handler, smallest override.
- `app/queue/enqueue.py:27` — `_request_context` extends here.
- `app/queue/extract.py:62-124` — `extract_one`; pre_extracted fast-path at 64-72 stays; slow-path at 74-123 picks up seed fallbacks.
- `app/queue/drain.py` — `drain_loop` unchanged.
- `app/api/routes.py:82-203` — `/search` route unchanged (it already calls `discover_urls`).

### Institutional learnings applied

- **[Neon pooler SSL idle-drop](../../../syntech-article-classifier/docs/solutions/database-issues/neon-pooler-ssl-closed-psycopg-async-pool.md)** — pool config in `app/db.py` already follows this. Drainer benefits from the same config; no changes needed.
- **[Deploying Python to Railway](../solutions/2026-railway-python-service.md)** — structlog event-naming convention (`snake_case_event`, `request_id` contextvar in middleware) + Railway `--proxy-headers` pattern. The new `extract_path_taken` event follows this.
- **[n8n → microservice cutover runbook](../solutions/2026-n8n-to-microservice-cutover.md)** — shape-changing cutover discipline: pre-cutover git tag, staging shadow run, n8n node inspection before prod. Applied here even though the `/search` response shape itself doesn't change (behavior does).
- **[Content extraction library migration patterns](../../../syntech-content-sourcing/docs/solutions/architecture-patterns/content-extraction-library-migration-patterns.md)** — extraction stack (trafilatura, SSRF guards, pre-compiled regex) lives in `app.extraction`. Drainer reuses it as-is; don't fork.
- **[RSS undated-entries bypass age filter](../../../syntech-content-sourcing/docs/solutions/logic-errors/rss-undated-entries-bypass-age-filter.md)** — the two-stage age-filtering invariant. Deferring extraction to the drainer preserves the post-extraction `is_article_too_old` gate at `extract_one:103`. Dedicated test covers this.

### Memory references

- `project_url_work_queue_live.md` — queue architecture, env vars, invariants.
- `project_db_pool_config.md` — pool sizing guidance; `DB_POOL_MAX_SIZE=15` current.
- `project_linkedin_thundering_herd.md` — Apify sources converge on DB; this plan addresses the root cause (expensive `/search`), not the herd symptom.
- `feedback_output_fields_are_schema.md` — `ArticleResponse` field stability; seed fallbacks preserve existing fields, no new schema.
- `feedback_source_vs_author.md` — `source` = platform (Google/Keyword/…). `source_override` on DiscoveredURL preserves this for Keyword's Google fanout.
- `feedback_mark_seen_after_queue.md` — `mark_seen` invariant; unchanged (still post-enqueue in `/search`).

### External research added during deepen-plan (2026-04-24)

- https://www.psycopg.org/psycopg3/docs/advanced/pool.html — psycopg 3.2 AsyncConnectionPool canonical lifecycle.
- https://github.com/psycopg/psycopg/discussions/985 — PoolTimeout interaction with FastAPI background tasks.
- https://fastapi.tiangolo.com/advanced/events/ — lifespan API.
- https://leapcell.io/blog/understanding-pitfalls-of-async-task-management-in-fastapi-requests — task supervision via `add_done_callback`.
- https://docs.pydantic.dev/latest/concepts/performance/ — v2 `model_validate_json` fast path.
- https://www.structlog.org/en/stable/contextvars.html — contextvars + asyncio interaction.
- https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING — Postgres 16/17 JSONB indexing.
- https://www.crunchydata.com/blog/indexing-jsonb-in-postgres — GIN `jsonb_path_ops` vs. expression B-tree for JSONB.
- https://www.snowflake.com/en/engineering-blog/postgres-jsonb-columns-and-toast/ — the 2 KB TOAST threshold that motivates NOT persisting `seed_content` to ctx.
- https://www.confluent.io/learn/kafka-dead-letter-queue/ — Kafka DLQ `error.category` + `error.reason` split that Phase 3 adopts.
- https://www.kai-waehner.de/blog/2022/05/30/error-handling-via-dead-letter-queue-in-apache-kafka/ — same pattern, deeper detail.
- https://www.npiontko.pro/2025/05/19/outbox-pattern — transactional outbox in psycopg 3 (matches this repo's pattern).
- https://opentelemetry.io/docs/specs/semconv/ — OTel semconv 1.40 (for future, not adopted now).

### Open follow-ups (to track in docs/TASKS.md or repo issues)

- Post-deploy (within 1 week): measure observed drainer throughput, tune `DRAIN_BATCH_SIZE` if `oldest_queued_age_sec` p95 > 10 minutes.
- Post-deploy (within 1 week): inspect `extract_path_taken` event distribution; if `zyte` dominates, investigate target-site anti-bot escalation.
- Post-deploy (within 2 weeks): `EXPLAIN ANALYZE` `status_counts` on populated queue; add 5s cache if seqscan observed (per Phase 7).
- Before scaling replicas: implement flush advisory lock (Deferred §1).
- Before any new extension to `request_context` JSONB shape that is NOT backward-compatible: bump `RequestContext.v` to `2` and add a compatibility path for `v=1` rows in `extract_one`.
- When queue `failed` rows exceed ~100k: land retention policy (Deferred §9).
- When the main dashboard starts: land `failure_reason` + `failure_category` columns (Deferred §7) and seed columns (Deferred §8) in one migration.
