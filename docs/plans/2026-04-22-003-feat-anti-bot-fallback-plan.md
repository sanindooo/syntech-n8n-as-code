---
title: Anti-Bot Fallback via Zyte API for syntech-content-sourcing
type: feat
status: phases-1-3-complete
date: 2026-04-22
origin: docs/brainstorms/2026-04-22-anti-bot-fallback-requirements.md
implementation_pr: https://github.com/sanindooo/syntech-content-sourcing/pull/3
---

> **Status note (2026-04-22):** Phases 0-3 complete and opened as
> [syntech-content-sourcing PR #3](https://github.com/sanindooo/syntech-content-sourcing/pull/3).
> Phase 0 (Zyte sanity against BBC/machinery-market/eadt) passed live. Code
> lands behind `SCRAPING_API_PROVIDER=none` so no production change ships
> until Railway env vars are set in Phase 4. The PR description carries the
> full Phase 4 + Phase 5 handoff; resume from there in a new session.

# Anti-Bot Fallback via Zyte API for syntech-content-sourcing

## Overview

Integrate Zyte API as a pay-as-you-go anti-bot fallback inside `syntech-content-sourcing/app/extraction.py::fetch_html`, so that Railway-side fetches of Cloudflare/Akamai-protected sites (BBC, machinery-market.co.uk) succeed without changing any handler call-site. The direct path remains unchanged for domains that work; the fallback only fires on anti-bot failure signals. Stacked free mitigations (rotating realistic headers, fast-fail on `403`/`429`) reduce how often the paid fallback triggers.

This plan is the prerequisite unblock for the source/author field-contract cutover parked in `project_pending_source_author_deployment` — the final phase here executes that cutover sequence.

## Problem Statement

From Railway, several anti-bot-protected sites return binary challenge pages instead of HTML. Same code from a residential laptop gets clean content. Confirmed-failing URLs (live Railway test, 2026-04-22):

| URL | Railway `articles_returned` | From laptop |
|---|---|---|
| `machinery-market.co.uk/.../41835` | **0** | ✅ 2,179 chars clean text |
| `bbc.co.uk/news/articles/c8x9v4k8zdko` | **0** | ✅ 4,327 chars clean text (Akamai) |
| `eadt.co.uk/.../26022486` | **1** (1,845 chars) | ✅ (no anti-bot) |

PR #2's UTF-8 guard (`validate_content` high-replacement-char check) prevents the binary garbage from poisoning the dashboard, but `articles_returned` drops to 0 instead of retrieving content. The client loses BBC-tier sources. See origin: `docs/brainstorms/2026-04-22-anti-bot-fallback-requirements.md` §Problem Frame.

## Proposed Solution

Three-stage extraction, early-exit on success:

1. **Stage 0 (free, compile-time):** Upgrade `DEFAULT_HEADERS` to a small pool of realistic Chrome/Firefox User-Agents with matching `Sec-Ch-Ua` hints; add per-domain `Referer` spoofing for news-like paths. Rotate per `fetch_html` call, pin within a single call's retry sequence.
2. **Stage 1 (free, runtime):** Direct fetch via existing httpx client. Fast-fail on `403`/`429` — no retry. Keep retries for `5xx` and timeouts. After decode, check `�`-density; >5% counts as failure.
3. **Stage 2 (paid, runtime):** If Stage 1 signalled anti-bot failure AND `SCRAPING_API_PROVIDER=zyte` AND per-request budget not exhausted, call Zyte API (`POST https://api.zyte.com/v1/extract`, HTTP Basic auth, `{"url": url, "httpResponseBody": true}` request body, Base64-decode response). If Zyte fails or returns garbled content, return `None` — do **not** degrade-to-direct.

See origin §Key Decisions for the rationale — provider, profile, cap, trigger set, retry semantics.

## Technical Approach

### Architecture

New module boundary: `app/scraping_api.py` (Zyte client, isolated behind a narrow interface). `fetch_html` gains a thin orchestration layer that decides whether to call the fallback. Config follows the established `AI_SEARCH_PROVIDER` three-layer pattern (`Settings` → `ResolvedConfig` → call-site branch).

**Why direct httpx POST, not the `zyte-api` Python SDK:** the SDK uses `aiohttp`, while the entire repo is built on `httpx` (`app/extraction.py:16`, all handlers). Keeping httpx means one fewer dependency, consistent retry/timeout semantics, and shared client configuration. Zyte's API is a single `POST /v1/extract` with JSON — trivial to wrap.

**Per-request budget counter:** use a dedicated `contextvars.ContextVar[int]` in `app/logging.py` (or a sibling `app/context.py`), initialised inside `RequestContextMiddleware` (logging.py:51-63) so each FastAPI request gets its own counter. This piggybacks on the existing middleware rather than introducing a new one. The final count is bound into structlog context so it appears in the per-request JSON log line.

**SSRF invariant:** `is_safe_url` (extraction.py:113-148) runs before any direct fetch and must also run before Zyte calls. We are not allowed to pass private/metadata URLs to a third-party service (per `docs/solutions/architecture-patterns/content-extraction-library-migration-patterns.md`).

### Module additions and changes

#### `app/config.py` (modify)

```python
# --- Scraping API fallback (Zyte) ---
# Provider switch: "zyte" | "none" (default none = fallback disabled)
scraping_api_provider: str = "none"
zyte_api_key: str | None = None
# Per /search request fallback call cap (safety net)
scraping_api_max_per_request: int = 20
# Timeout for the scraping API itself (Zyte anti-ban mode can be slow)
scraping_api_timeout_seconds: float = 60.0
```

#### `app/handlers/base.py` (modify `ResolvedConfig` + `from_request`)

Mirror the existing `ai_search_provider` treatment at lines 38-41 and 64-67 — add fields, thread from `Settings`. `fetch_html` reads from `ResolvedConfig` via the existing plumbing.

#### `app/logging.py` (modify)

- Add `zyte_api_key` to `_REDACT_KEYS` (line 13-23). Matches the pattern used for every other secret.
- Add a module-level `ContextVar[int]` for the fallback budget, and either extend `RequestContextMiddleware.dispatch` to initialise/reset it, or create `BudgetContextMiddleware` immediately after it in `main.py:71`.

#### `app/main.py` (modify boot log)

At line 55, include `scraping_api_provider=settings.scraping_api_provider` in `service_started` — matches the existing `ai_search_provider` announcement.

#### `app/scraping_api.py` (new file)

```python
"""Zyte API client for anti-bot HTML fallback.

Wraps POST https://api.zyte.com/v1/extract with HTTP Basic auth.
Returns decoded HTML on success, None on any failure.

Called by app/extraction.py::fetch_html only when direct fetch
signals anti-bot failure AND per-request budget allows.
"""

from __future__ import annotations

from base64 import b64decode

import httpx
import structlog

from app.config import Settings

logger = structlog.get_logger()

ZYTE_ENDPOINT = "https://api.zyte.com/v1/extract"


async def fetch_via_zyte(url: str, settings: Settings) -> str | None:
    """Fetch HTML via Zyte API. Returns None on failure.

    Caller must have already verified settings.scraping_api_provider=="zyte"
    and that the per-request budget allows another call.
    """
    if not settings.zyte_api_key:
        logger.warning("zyte_no_api_key", url=url[:100])
        return None

    payload = {"url": url, "httpResponseBody": True}

    try:
        async with httpx.AsyncClient(
            timeout=settings.scraping_api_timeout_seconds,
        ) as client:
            response = await client.post(
                ZYTE_ENDPOINT,
                json=payload,
                auth=(settings.zyte_api_key, ""),
            )
            if response.status_code != 200:
                logger.warning(
                    "zyte_non_200",
                    url=url[:100],
                    status=response.status_code,
                    body=response.text[:200],
                )
                return None

            body_b64 = response.json().get("httpResponseBody")
            if not body_b64:
                logger.warning("zyte_empty_body", url=url[:100])
                return None

            html_bytes = b64decode(body_b64)
            return html_bytes.decode("utf-8", errors="replace")

    except httpx.TimeoutException:
        logger.warning("zyte_timeout", url=url[:100])
        return None
    except httpx.HTTPError as e:
        logger.warning("zyte_http_error", url=url[:100], error=str(e))
        return None
    except Exception as e:
        logger.warning("zyte_unexpected_error", url=url[:100], error=str(type(e).__name__))
        return None
```

#### `app/extraction.py` (modify)

1. Replace the single `DEFAULT_HEADERS` constant with a UA pool (2–3 Chrome versions + 1 Firefox) and a `_build_headers(url)` helper that picks a UA, emits the matching `Sec-Ch-Ua`, and sets a `Referer` based on URL (Google search referer for news domains, omit otherwise).
2. Split `fetch_html` into `_fetch_direct(url, ...)` (today's logic with two semantic tweaks below) and a new `fetch_html` that orchestrates direct → fallback.
3. Inside `_fetch_direct`:
   - On `403`/`429` response: **do not retry** — return a sentinel that triggers fallback.
   - After decode: compute `�`-density (`text.count("�") / max(len(text), 1)`); if >0.05, return the sentinel.
   - Keep existing retry semantics for timeouts and `5xx`.
4. `fetch_html` orchestration:
   - Call `_fetch_direct`. If it returns HTML, return it.
   - If it returns the fallback sentinel AND `settings.scraping_api_provider == "zyte"` AND budget allows → call `fetch_via_zyte(url, settings)`.
   - Decrement the budget counter regardless of Zyte success (prevents infinite Zyte thrashing on a domain Zyte also can't clear).
   - If Zyte returns HTML, run the same `�`-density check; >5% → return None.
   - Log one structured event per fallback path: `fetch_fallback_invoked`, `fetch_fallback_success`, `fetch_fallback_garbled`, `fetch_fallback_error`, `fetch_fallback_budget_exhausted`.

The five existing call-sites (`handlers/keyword.py:379,485`, `handlers/rss.py:159`, `handlers/website.py:58`, `handlers/google.py:217`) get the fallback for free — no handler code changes.

#### `.env.example` (modify)

Add a new section after the existing AI Search block (line 23-28 is the template):

```
# ===== Anti-Bot Scraping API Fallback =====
# Which provider to use: zyte | none (default none disables fallback)
SCRAPING_API_PROVIDER=none
# Required when SCRAPING_API_PROVIDER=zyte
ZYTE_API_KEY=your-zyte-api-key
# Safety cap: max fallback invocations per /search request
SCRAPING_API_MAX_PER_REQUEST=20
# Zyte's anti-ban mode can be slow (30-60s for hard sites)
SCRAPING_API_TIMEOUT_SECONDS=60.0
```

#### `tests/test_extraction.py` + `tests/test_scraping_api.py` (new/modify)

- Use `pytest-httpx` (already a dev dep per `pyproject.toml:28`). No test currently uses it — we're setting the precedent.
- Unit matrix (8 cases):
  1. Direct 200 clean → no fallback, returns content
  2. Direct 200 garbled (>5% `�`) → fallback invoked, returns Zyte HTML
  3. Direct 403 → fallback invoked, returns Zyte HTML
  4. Direct 429 → fallback invoked (no retry on direct)
  5. Direct 5xx-then-200 → retry succeeds, no fallback
  6. Direct 403 + Zyte 500 → returns None
  7. Direct 403 + `SCRAPING_API_PROVIDER=none` → returns None (no Zyte call made)
  8. Direct 403 + budget exhausted → returns None
- Opt-in integration test (`pytest -m integration`, gated by `SCRAPING_API_INTEGRATION=1` env):
  - Hits real Zyte API against the 3 known URLs
  - Asserts clean HTML (>500 chars, <1% `�`)
- Golden HTML fixtures for the 3 known URLs under `tests/fixtures/anti_bot/` — captured via a one-time `scripts/capture_golden_fixtures.py`.

### Implementation Phases

#### Phase 0 — Zyte provider sanity check (no code)

**Purpose:** prove Zyte anti-ban actually clears BBC's Akamai before committing code. If this fails, the provider choice needs revisit before writing anything.

**Tasks:**

1. Stephen creates a Zyte account, generates a production API key.
2. Stephen sets Zyte account spending cap to $50/mo via Zyte dashboard (note: the `$100/mo` tier has no monthly commitment).
3. Agent runs a throwaway `curl` against the 3 known URLs through Zyte with `{"url": url, "httpResponseBody": true}`:
   ```bash
   for URL in \
     "https://www.bbc.co.uk/news/articles/c8x9v4k8zdko" \
     "https://www.machinery-market.co.uk/news/41835/..." \
     "https://www.eadt.co.uk/news/26022486..."
   do
     curl -s --user "$ZYTE_API_KEY:" \
       -H 'Content-Type: application/json' \
       --data "{\"url\": \"$URL\", \"httpResponseBody\": true}" \
       --compressed https://api.zyte.com/v1/extract \
     | jq -r '.httpResponseBody // .title // .'  | head -c 500
   done
   ```
4. **Gate:** If BBC returns empty or Akamai challenge even through Zyte → STOP, reopen the provider question (escalate to Zyte's browser-html mode, or switch to ScrapFly). If BBC returns article HTML → proceed.
5. Estimated cost: ~3 × $0.005 = $0.015 (covered by $5 free credit).

**Exit criteria:** all 3 URLs return clean HTML through the raw Zyte API from a command line.

#### Phase 1 — Config + Zyte client module (isolated, testable)

**Tasks:**

1. Add `scraping_api_provider`, `zyte_api_key`, `scraping_api_max_per_request`, `scraping_api_timeout_seconds` to `app/config.py`.
2. Add the 4 fields to `ResolvedConfig` in `app/handlers/base.py:38-41` and wire through `from_request` at `:64-67`.
3. Add `zyte_api_key` to `_REDACT_KEYS` in `app/logging.py:13-23`.
4. Create `app/scraping_api.py` with `fetch_via_zyte` (signature and body as above).
5. Write `tests/test_scraping_api.py` — 4 cases via `pytest-httpx`: success, 429, 520, timeout.
6. Update `.env.example` with the new section.

**Exit criteria:** new tests green, `pytest` still green overall, no runtime behaviour change yet.

#### Phase 2 — Header rotation + fast-fail + fallback orchestration

**Tasks:**

1. Replace `DEFAULT_HEADERS` with `_UA_POOL` and `_build_headers(url)`:
   - 3 Chrome versions (e.g. 120, 122, 124) each paired with its own `Sec-Ch-Ua`
   - 1 Firefox UA (no `Sec-Ch-Ua`)
   - Referer: `https://www.google.com/` when URL path suggests news (`/news/`, `/article/`, year-based slugs); omit otherwise
   - Rotate per `fetch_html` call via `random.choice`, pinned for that call's retry loop
2. Add `_REPLACEMENT_DENSITY_THRESHOLD = 0.05` module constant.
3. Refactor `fetch_html` into `_fetch_direct` (returns `str | _AntiBotSignal | None`) and `fetch_html` (orchestrates).
4. In `_fetch_direct`:
   - On status `403`/`429`: log `fetch_direct_blocked` with status, return `_AntiBotSignal`.
   - After decode, compute `�`-density; if >threshold: log `fetch_direct_garbled`, return `_AntiBotSignal`.
   - All other outcomes unchanged (timeout retries, 5xx retries, 4xx non-403/429 still return None without fallback — those are real 404s etc., Zyte won't fix).
5. In `fetch_html`:
   - Read `scraping_api_provider` and budget from `settings` (pass through call chain, or read module-level singleton — follow the existing `Settings()` usage pattern in `main.py`).
   - If direct signals anti-bot AND provider is `zyte` AND budget > 0:
     - Decrement budget via the ContextVar
     - Call `fetch_via_zyte`
     - On HTML returned: run `�`-density check; clean → return; garbled → return None
     - On None: return None
   - Log the appropriate `fetch_fallback_*` event
6. Add the `BUDGET` ContextVar to `app/logging.py` and extend `RequestContextMiddleware.dispatch` to `.set(settings.scraping_api_max_per_request)` before `call_next` and `.reset(...)` in `finally`.
7. Emit boot-log update at `main.py:55` to include `scraping_api_provider`.

**Exit criteria:**
- All 8 unit test cases pass
- Running the service locally with `SCRAPING_API_PROVIDER=none` gives identical output to main
- Running with `SCRAPING_API_PROVIDER=zyte` + real key + `ZYTE_API_KEY` env in `.env` extracts BBC content

#### Phase 3 — Golden fixtures + integration tests

**Tasks:**

1. Write `scripts/capture_golden_fixtures.py` — one-shot script that hits the 3 known URLs through Zyte and saves the resulting HTML to `tests/fixtures/anti_bot/{bbc,machinery_market,eadt}.html`. Checked into the repo.
2. Write `tests/test_anti_bot_regression.py`:
   - Loads the golden fixture
   - Feeds it to `extract_article`
   - Asserts >500 chars, <1% `�`, non-empty title
3. Write `tests/test_extraction_integration.py` (opt-in, marked `integration`):
   - Gated by `SCRAPING_API_INTEGRATION=1`
   - Hits real Zyte API against the 3 URLs
   - Same assertions as golden
4. Configure `pytest.ini` or `pyproject.toml` to register the `integration` marker and skip by default.

**Exit criteria:** `pytest` green without env; `SCRAPING_API_INTEGRATION=1 pytest -m integration` green with $5 Zyte credit spent.

#### Phase 4 — PR, Railway config, live verification

**Tasks:**

1. Open PR in `syntech-content-sourcing` with Phases 1–3 as a single change. Title: `feat(extraction): Zyte anti-bot fallback for fetch_html`.
2. Stephen sets Railway env vars for `syntech-content-sourcing` service:
   - `SCRAPING_API_PROVIDER=zyte`
   - `ZYTE_API_KEY=<prod key>`
   - (Leave `SCRAPING_API_MAX_PER_REQUEST` / `SCRAPING_API_TIMEOUT_SECONDS` at defaults unless tuning needed)
3. Agent merges PR via `gh pr merge --squash` only AFTER Stephen confirms Railway vars are set. Railway auto-deploys.
4. Wait for `/readyz` green, then run the diagnostic one-liner from `project_railway_antibot_finding`:
   ```bash
   CONTENT_SOURCING_TOKEN=<token> bash -c '
   for URL in <the 3 URLs>; do
     curl -s -X POST "https://syntech-content-sourcing-production.up.railway.app/search" \
       -H "Authorization: Bearer $CONTENT_SOURCING_TOKEN" \
       -H "Content-Type: application/json" \
       --max-time 120 \
       -d "{\"source_type\":\"Website\",\"url_or_keyword\":\"$URL\",\"source_name\":\"Test\",\"source_category\":\"News\",\"test_mode\":true}" \
       | jq "{articles_returned, first_len: (.articles[0].content | length), repl_chars: (.articles[0].content | [scan(\"�\")] | length)}"
   done'
   ```
5. **Regression gate:** all 3 URLs must report `articles_returned: 1`, `first_len > 500`, `repl_chars: 0` (or <1% of first_len). If any fails, immediately revert via `gh pr revert` or `Settings → Rollback` on Railway.

**Exit criteria:** 3 URLs verified against live Railway; Zyte dashboard shows <5 calls consumed for the verification run.

#### Phase 5 — Execute the parked source/author cutover

Per `project_pending_source_author_deployment`, these steps now become safe to execute because fetch_html can actually retrieve content from BBC-tier sources.

**Tasks (strict order — see memory note for full detail):**

1. **Phase 5a — Dashboard** (`syntech-intelligence-dashboard` PR #17)
   - Stephen: `cd syntech-intelligence-dashboard && DATABASE_URL="$DATABASE_URL_DIRECT" npx drizzle-kit migrate`
   - Agent: `gh pr merge 17 --squash` → wait for Vercel deploy
   - Verify: `POST /api/webhooks/ingest` with `{"source":"FooBar",...}` → 422; with `{"source":"LinkedIn","author":"Test",...}` → 200
2. **Phase 5b — Classifier** (`syntech-article-classifier` PR #10)
   - Pre-flight: `SELECT count(*) FROM classifier.dashboard_sync_outbox WHERE attempts=0 AND delivered_at IS NULL` — flush if >100
   - Stephen: `cd syntech-article-classifier && DATABASE_URL="$DATABASE_URL_DIRECT" alembic upgrade head`
   - Agent: `gh pr merge 10 --squash` → wait for Railway `/readyz` green
   - Verify: `POST /classify` with valid source → 200; with `"source":"FooBar"` → 400
3. **Phase 5c — Content-sourcing** (`syntech-content-sourcing` PR #1)
   - Agent: `gh pr merge 1 --squash` → wait for Railway deploy
   - Verify: `POST /search` with LinkedIn fixture → `articles[0].author == source_name`; with Keyword fixture → `unique(articles[].source) == ["Google","Keyword"]`
4. **Phase 5d — n8n end-to-end**
   - Stephen re-enables `News Sourcing Production (V2)` workflow in the n8n UI for a bounded window (30 min).
   - Run one real LinkedIn source end-to-end.
   - Query: `SELECT source, author FROM public.articles WHERE created_at > now() - interval '10 minutes'` → expect `LinkedIn` row with non-null `author`.
   - Run one real BBC-URL source end-to-end → confirm non-empty content (this is the whole reason we did this work).
   - Re-disable the workflow.

**Critical invariants** (from the memory note):
- Phase 5a must ship before 5b/5c (dashboard rejects new payload shape with 422 otherwise).
- Phase 5b must ship before 5c (classifier rejects missing `source` with 400 otherwise; outbox dead-letters).
- Do NOT skip the outbox backlog check before 5b migration.
- Do NOT push n8n workflow changes from the branch `feat/biofuel-relevance-cutover` (explicit 2026-04-22 instruction).

**Exit criteria:** BBC URL runs through the full n8n → content-sourcing → classifier → dashboard pipeline and produces a row in `public.articles` with `source='Website'`, non-null `author`, non-empty `content`.

## Alternative Approaches Considered

| Alternative | Why rejected |
|---|---|
| **ScrapingBee** (Option B candidate from origin) | $49/mo subscription floor vs Zyte's PAYG under $100 spend; stealth proxy costs 75 credits/request which puts us at the $49 ceiling fast. Cost bite without meaningful upside. |
| **ScrapFly** (Option B candidate) | Comparable on cost to ScrapingBee Discovery ($30), less battle-tested against Akamai than Zyte. Good free-tier safety net but loses on primary goal ("best results"). |
| **Playwright / headless Chrome on Railway** (Option A escalation) | Out of scope per origin — CPU-heavy, memory-hungry, slow, still gets IP-flagged by Akamai. Zyte solves the IP + TLS fingerprinting together. |
| **Always-via-API** | Pays Zyte for every request including ~80% that work fine direct. 5× the cost for no extraction upside. |
| **Per-domain allowlist** | Premature — we don't yet know which domains need fallback beyond the 3 observed. Requirements doc defers to "learn from R10 logs, add later if justified." |
| **zyte-api Python SDK** | Uses aiohttp; the entire repo is httpx. One dependency and one HTTP client per codebase. |
| **Multi-provider escalation** (Zyte → ScrapingBee → ScrapFly) | Triple the integration surface, triple the env-var complexity, near-zero real-world benefit given Zyte covers our 3 known cases. |
| **Scraping-API response cache** | Dedup layer (`app/dedup.py`) + n8n dedup already prevent re-fetches in prod. YAGNI. |

## System-Wide Impact

### Interaction Graph

`/search` (FastAPI `main.py`) → `RequestContextMiddleware.dispatch` (new: binds `BUDGET` ContextVar) → handler (keyword/rss/website/google) → `fetch_html` → `_fetch_direct` (httpx) → [on anti-bot signal] → `fetch_via_zyte` (httpx) → `extract_article` → `validate_content` → `ArticleResponse`. The chain reaction is linear; no callbacks or observers added.

### Error & Failure Propagation

- `_fetch_direct` returns `_AntiBotSignal` sentinel → `fetch_html` translates to Zyte call or None (never raises).
- `fetch_via_zyte` swallows all httpx errors into None and logs (intentional — extraction is best-effort, never blocks a handler).
- SSRF failures in `is_safe_url` continue to return None at the top of `fetch_html` before any network call.
- Handlers already handle `fetch_html` returning None (they skip the article).

### State Lifecycle Risks

None. `fetch_html` is pure — no DB writes, no cache writes, no cross-request state. The `BUDGET` ContextVar is reset per request and cannot leak.

### API Surface Parity

All 5 `fetch_html` call-sites get the fallback equally — no surface divergence. No public API changes. The `/search` response contract is unchanged.

### Integration Test Scenarios

1. **Full pipeline, easy domain:** `POST /search {source_type:"Website", url_or_keyword:"https://www.eadt.co.uk/..."}` → `articles_returned: 1`, zero Zyte calls in logs.
2. **Full pipeline, hard domain:** `POST /search {..., url_or_keyword:"https://www.bbc.co.uk/news/articles/..."}` → `articles_returned: 1`, one `fetch_fallback_success` in logs.
3. **Full pipeline, provider disabled:** Same BBC request with `SCRAPING_API_PROVIDER=none` → `articles_returned: 0`, one `fetch_direct_blocked`, no Zyte call logged.
4. **Budget exhaustion:** Craft a `/search` that triggers 21 fallbacks in one request (21 anti-bot URLs); 21st should log `fetch_fallback_budget_exhausted`.
5. **Zyte outage simulation:** unit-level via `pytest-httpx` returning 520 on Zyte endpoint → direct anti-bot + Zyte fail → None; `fetch_fallback_error` logged.

## Acceptance Criteria

### Functional Requirements

- [ ] **[R1]** Direct-fetch behaviour on non-blocked domains (e.g. `eadt.co.uk`) is unchanged — no added latency, no Zyte calls in logs.
- [ ] **[R2]** Direct fetch fails on `403`/`429`/`503`, all-retries-timeout, or post-decode `�`-density >5% → fallback fires when provider=zyte and budget allows.
- [ ] **[R3]** The 3 known URLs (BBC, machinery-market, eadt) return clean extracted content (>500 chars, <1% `�`) when POSTed to the live Railway `/search` endpoint.
- [ ] **[R4]** `DEFAULT_HEADERS` is replaced with a rotating UA pool (3 Chrome + 1 Firefox) with matching `Sec-Ch-Ua` hints and conditional `Referer` spoofing.
- [ ] **[R5]** Direct fetch fast-fails on `403`/`429` (no retry). Timeouts and `5xx` still retry as today.
- [ ] **[R6]** When Zyte itself fails (`5xx`, `429`, `402`, timeout, garbled body), `fetch_html` returns `None`. No degrade-to-direct.
- [ ] **[R7]** Per-request fallback budget cap (default 20) prevents runaway cost from a single `/search` request.
- [ ] **[R8]** `SCRAPING_API_PROVIDER=none` fully disables the fallback path — no Zyte module imports evaluated at call time, no cost.
- [ ] **[R9]** Scraping-API client is testable via `pytest-httpx` mocks; integration tests gated by `SCRAPING_API_INTEGRATION=1`; golden fixtures under `tests/fixtures/anti_bot/`.
- [ ] **[R10]** Every fallback invocation logs a structured event with `url`, `provider`, `status`, `direct_failure_reason`, `budget_used`.

### Non-Functional Requirements

- [ ] `zyte_api_key` is in `_REDACT_KEYS` and never appears in JSON logs (verify with a manual `SCRAPING_API_PROVIDER=zyte` run grep'd for the key).
- [ ] SSRF guard (`is_safe_url`) runs before any URL is handed to Zyte (verified by unit test passing a `192.168.0.1` URL).
- [ ] Zyte HTTP client timeout is explicit and bounded (default 60s, overridable).
- [ ] No new top-level module dependencies beyond what's in `pyproject.toml` (uses `httpx` + `base64` stdlib).

### Quality Gates

- [ ] All existing tests pass.
- [ ] 8 new unit tests (the matrix above) all pass.
- [ ] 3 golden-fixture regression tests pass offline.
- [ ] Opt-in integration suite passes against real Zyte with $5 free credit.
- [ ] PR reviewed by the `kieran-python-reviewer` agent before merge (code-quality gate).

## Success Metrics

- The 3 known-failing URLs extract clean text from live Railway (primary, binary).
- Zyte monthly spend stays within $50 cap. Expected steady-state: $5–10/mo.
- Fallback invocation rate visible in logs; Stephen/agent can verify <30% of requests hit Zyte (otherwise header audit needs re-tuning).
- The parked source/author cutover (Phase 5) completes end-to-end with a real LinkedIn + a real BBC source producing rows in `public.articles`.

## Dependencies & Prerequisites

- **Stephen's actions (cannot be done by agent):**
  - Create Zyte account, generate API key
  - Set Zyte account spending cap to $50/mo
  - Set Railway env vars (`SCRAPING_API_PROVIDER`, `ZYTE_API_KEY`) on `syntech-content-sourcing` service
  - Run Drizzle + Alembic migrations during Phase 5
  - Re-enable + re-disable the n8n workflow during Phase 5d
- **Phase 0 must pass before Phase 1 starts.** If Zyte anti-ban doesn't clear BBC raw, this entire plan needs revision.
- **Phase 5 depends on Phase 4 being verified live.** Do not merge parked PRs #17, #10, #1 until the 3-URL regression test passes on Railway.
- **Branch hygiene:** this plan's PR opens from a fresh branch in `syntech-content-sourcing` (not `feat/biofuel-relevance-cutover`, which is the n8n-side branch). Stephen's explicit 2026-04-22 instruction: do NOT push n8n workflow changes from that branch.

## Risk Analysis & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Zyte anti-ban doesn't clear BBC's Akamai | Low | High | Phase 0 sanity check gates the whole plan. ~$0.02 to prove/disprove. |
| Zyte pricing shifts (they introduce a min commitment) | Low | Medium | Spending cap at $50/mo is a hard ceiling; billing surprises are bounded. Stephen watches Zyte dashboard month-one. |
| Regression: direct-path behaviour changes for easy sites | Medium | High | Unit tests 1, 5, 7 pin the no-fallback path. Phase 4 regression test on `eadt.co.uk` (known-good) catches latency/parsing drift. |
| Header rotation breaks a site that requires a specific UA | Low | Medium | Keep the UA pool small and realistic. If a handler domain starts failing, logs will show it; we add a UA to the pool or pin one for that domain. |
| Zyte call latency (30–60s for hard sites) triggers upstream timeouts | Medium | Medium | Our `/search` endpoint already has generous per-handler budgets. If p99 spikes, revisit `healthcheckTimeout` in `railway.toml` (see `docs/solutions/2026-railway-python-service.md` §3). |
| PR #1 (parked source/author) conflicts with this work | Low | Low | This PR only touches `extraction.py`, `scraping_api.py` (new), `config.py`, `handlers/base.py` (adds fields, doesn't rename). PR #1 changes response shape (author field). No overlap expected; rebase resolves any stray merge conflict. |
| SSRF escape via Zyte (someone POSTs a private-IP URL and Zyte doesn't know it's private) | Low | High | `is_safe_url` already runs at the top of `fetch_html` before any network call — this invariant is preserved in the refactor. Add explicit unit test. |
| Cost overrun during integration test loops | Low | Low | `$50/mo` Zyte cap + `SCRAPING_API_MAX_PER_REQUEST=20` per-request cap + opt-in integration gate. Worst case: Stephen's $5 free credit burns in one bad test run, no real charge. |

## Resource Requirements

- Agent-hours: ~4h for Phases 1–3 implementation + tests. ~1h for Phase 4 deploy + verify. ~1h for Phase 5 cutover sequence (mostly waiting on Railway/Vercel deploys).
- Stephen-hours: ~30 min (Zyte account + Railway vars + migration runs + n8n toggles).
- Budget: $5 free credit for Phase 0 + Phase 3 integration run. $50/mo cap thereafter.

## Future Considerations

- **Observability dashboard:** once logs show real fallback patterns, consider a lightweight metric (e.g. `anti_bot_fallback_invocations_total{provider,status,domain}`) surfaced on a Grafana/Railway dashboard. Deferred.
- **Per-domain policy:** if logs show certain domains ALWAYS need fallback, add a deny-list that skips direct entirely — saves ~2s latency per known-failing domain. Deferred pending log evidence.
- **Secondary provider:** if Zyte ever has prolonged outage affecting us, adding ScrapFly as a secondary would be straightforward — the `app/scraping_api.py` interface is provider-agnostic by design.
- **JS rendering for SPA sites:** if a future site needs `browserHtml: true` (client-side-rendered content), add a per-request override or per-domain rule. Deferred — no known need today.

## Documentation Plan

- Write a solution doc at `syntech-content-sourcing/docs/solutions/integration-issues/2026-zyte-anti-bot-fallback.md` after Phase 4 ships. Contents:
  - Provider selection rationale (why Zyte over ScrapingBee/ScrapFly at our volume)
  - The 403/429-means-don't-retry rule and why
  - Per-request budget cap pattern (ContextVar in middleware)
  - `�`-density as an anti-bot signal
  - How to add a second provider later
- Cross-reference `architecture-patterns/content-extraction-library-migration-patterns.md` so future contributors know the fallback must still feed `bare_extraction()`.

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-04-22-anti-bot-fallback-requirements.md](../brainstorms/2026-04-22-anti-bot-fallback-requirements.md) — key decisions carried forward: (1) Zyte API on PAYG for anti-ban profile with $50 cap, (2) direct-first with fast-fail on 403/429, (3) `�`-density >5% as a fallback trigger alongside status codes and timeouts.

### Internal References

- `syntech-content-sourcing/app/extraction.py:151-226` — current `fetch_html` to refactor
- `syntech-content-sourcing/app/extraction.py:34-49` — `DEFAULT_HEADERS` to replace with pool
- `syntech-content-sourcing/app/config.py:36-38` — `ai_search_provider` pattern to mirror
- `syntech-content-sourcing/app/handlers/base.py:38-41,64-67` — `ResolvedConfig` wire-up pattern
- `syntech-content-sourcing/app/handlers/keyword.py:123-131` — call-site provider-branch pattern
- `syntech-content-sourcing/app/logging.py:13-23,51-63` — `_REDACT_KEYS` and `RequestContextMiddleware`
- `syntech-content-sourcing/app/main.py:55` — boot-log announcement pattern
- `syntech-content-sourcing/pyproject.toml:28` — `pytest-httpx` already a dev dep
- `syntech-content-sourcing/docs/solutions/architecture-patterns/content-extraction-library-migration-patterns.md` — extraction contract, SSRF invariant, error sanitization
- Memory: `project_railway_antibot_finding` — failure matrix + diagnostic one-liner
- Memory: `project_pending_source_author_deployment` — parked cutover sequence Phase 5 executes

### External References

- Zyte API HTTP reference: https://docs.zyte.com/zyte-api/usage/http — `POST /v1/extract`, Basic auth, `{"url": ..., "httpResponseBody": true}`, Base64-encoded response
- Zyte pricing page: https://www.zyte.com/zyte-api/ — $5 free credit, $100 spending limit has no monthly commitment, profiles $0.0004–$0.005/req

### Related Work

- Parked PRs (Phase 5): `syntech-intelligence-dashboard` #17 (dashboard migration + enum guard), `syntech-article-classifier` #10 (classifier enum guard), `syntech-content-sourcing` #1 (source/author field contract)
- Already-merged: `syntech-content-sourcing` #2 (UTF-8 replacement-char guard — the partial fix that masks the symptom this plan actually solves)
