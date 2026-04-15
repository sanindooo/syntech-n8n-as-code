---
title: Article Classifier Microservice (Stage 4 Dedup/Extract)
type: feat
status: active
date: 2026-04-15
origin: docs/brainstorms/2026-04-15-article-classifier-microservice-requirements.md
---

# Article Classifier Microservice (Stage 4 Dedup/Extract)

## Enhancement Summary

**Deepened on:** 2026-04-15
**Sections enhanced:** Architecture, schema, classification pipeline, phases, acceptance criteria, risks, testing.
**Research agents used:** framework-docs-researcher (pgvector/Neon), best-practices-researcher (small-LLM fact extraction), framework-docs-researcher (FastAPI/Railway), best-practices-researcher (parity testing), code-simplicity-reviewer, correctness-reviewer, data-integrity-guardian.

### Key improvements
1. **HNSW over ivfflat, 512-dim over 1536-dim** — HNSW is GA on Neon with no rebuild as corpus grows; 512-dim Matryoshka truncation of `text-embedding-3-small` retains ~99% retrieval quality at 1/3 the index size. Single decision, dropped an entire "index migration" risk row.
2. **Anthropic forced tool-use for fact extraction** — measured 0.2% schema-failure rate vs. 2–4% for prompt-return-JSON; closed-vocab `Literal` enums for the interpretive fields (`policy_terms`, `impacts`).
3. **Corrected transaction boundary** — LLM + embedding calls run *before* the DB transaction, not inside it. Earlier wording would have starved the Neon pool.
4. **Candidate-filter tightening** — require `topic_action` match (not just `topic_subject`) before the update-path can fire, fixing the "construction vs protest on Sizewell-C" collision case.
5. **Shadow run isolated on a Neon branch**, not writing to prod `articles`. Cleanest path; Neon branches are copy-on-write and free.
6. **Embedding-model versioning column** added to schema so a future model swap is safe and calibration invalidation is explicit.
7. **Scope cuts**: `/stats` endpoint, `idx_articles_pub_date`, env-var threshold overrides, Haiku-fallback-for-everything signature path, and Phase 4 as a distinct phase are all removed. Plan is now 2 phases.

### New considerations discovered
- **URL idempotency vs. corpus drift** — deliberate decision: a URL seen before short-circuits to the cached classification (idempotency honored); reclassification requires an explicit `?force=true` flag.
- **Prompt caching on Anthropic is load-bearing for the cost target** — at ~90% cache hit rate, steady-state cost projects to £0.80–1.50/day; without it, we'd eat margin.
- **Old LLM is not ground truth** — the 50-fixture must be human-adjudicated; we also measure self-agreement of the old LLM (ceiling ~95–98% at temp 0).
- **URL canonicalization before hashing** — strip UTM/AMP/query-only tracking params, or `url_hash` collisions under-match.
- **Log-field allowlist** — article body/title/summary/token and `fact_extraction.entities` (can contain PII) are never logged; only `url_hash` + decision metadata.

---

## Overview

Replace the n8n sub-workflow `sK-5ZAHQNG8DcOcN6Ggch` ("Filter Articles By Topic (Prod)") — currently a full Claude Sonnet 4.5 call that compares each article against the Notion corpus — with a self-hosted FastAPI microservice on Railway. The service classifies each article as `unique` / `update` / `duplicate`, produces the topical signature, and extracts facts, using a layered rule: deterministic topic-signature bucketing in Neon Postgres → pgvector (HNSW, 512-dim) similarity → fact-delta disambiguation, with a single small-LLM call (Claude Haiku 4.5, forced tool-use) for fact extraction + action-enum normalization.

Target: cut the £30–40/day LLM spend on this step to **<£5/day** (projected £0.80–1.50/day with prompt caching) while preserving byte-for-byte output parity so every downstream n8n stage — including the Notion write — runs unchanged.

## Problem Statement / Motivation

**Cost driver:** The current sub-workflow sends the full article body plus a corpus comparison prompt to Claude Sonnet 4.5 per article — £30–40/day at daily cadence. Webhook-triggered ingestion (planned) will push volume past 100/day and costs scale linearly.

**Architectural issue:** Classification-by-LLM-over-full-corpus conflates three separable concerns — bucketing (signature), matching (similarity), and structured extraction — into one expensive call. Bucketing and matching are cheap, deterministic problems; only structured extraction benefits from an LLM, and a small model is sufficient.

**Operational issue:** Notion is the classification source of truth today, forcing periodic backfills and blocking similarity search. Moving the machine-facing corpus to Neon eliminates recurring backfill and unlocks pgvector.

See origin: [`docs/brainstorms/2026-04-15-article-classifier-microservice-requirements.md`](../brainstorms/2026-04-15-article-classifier-microservice-requirements.md).

## Proposed Solution

A Python (FastAPI) microservice on Railway with a single POST endpoint that is a **drop-in replacement** for the current sub-workflow node. The n8n workflow swaps one `executeWorkflow` invocation for one `httpRequest` call; nothing downstream changes.

### Classification pipeline (per article)

1. **Normalize input** — unwrap the stringified `article` JSON; canonicalize URL (strip UTM/AMP/tracking params, lowercase host, drop trailing slash); compute `url_hash = sha256(canonical_url)`.
2. **Idempotency short-circuit** — if `url_hash` exists and request is not `?force=true`, return the cached classification + signature + facts (from the Neon row). Keeps behavior idempotent on retries per origin R9.
3. **Fact extraction + action-enum + subject-raw** in a single Haiku 4.5 call using Anthropic tool-use with forced `tool_choice`. Temperature 0, prompt-cached system message containing schema + rules + 2 few-shots + closed-vocab enums for `policy_terms`, `impacts.category`, `impacts.direction`, and `topic_action`.
4. **Deterministic topic_subject slug** — post-process `topic_subject_raw` from the LLM: lowercase → strip stopwords → kebab-case → resolve through a canonical alias table (small seed list in `app/aliases.py`, extendable). Fixes slug-variant drift.
5. **Embed `title + summary`** via `text-embedding-3-small` at `dimensions=512`, normalized post-truncation. Cached by `sha256(title+summary+model_version)`.
6. **Candidate lookup in Neon** — `SELECT … WHERE topic_subject = $1 AND topic_action = $2` (no temporal filter — pgvector + subject+action index is fast enough; the earlier 90-day window would drop long-running stories). If empty → `unique`.
7. **Score candidates** — HNSW cosine similarity with iterative scan. Apply the layered decision rule with thresholds hardcoded in `app/config.py`:
   - `cos ≥ 0.92` → `duplicate`, `classified_against = argmax`
   - `0.75 ≤ cos < 0.92` → **fact-delta** against the candidate *cluster union* (top-K + anything reachable via `classified_against`), using normalized comparison (parse numeric values to floats with unit conversion; parse dates to ISO; entities to casefold). Non-empty delta on `entities ∪ numerical_values ∪ dates` → `update`; empty → `duplicate`. `policy_terms` / `impacts` are excluded from the delta (too interpretive to stabilize).
   - `cos < 0.75` → `unique` (subject+action collision, different story)
8. **Upsert** into Neon in a short transaction (the LLM/embedding calls are already done; tx is SELECT + INSERT ON CONFLICT only). `ON CONFLICT (url_hash) DO UPDATE` excludes `classification` and `classified_against` from the SET list so re-runs don't silently mutate downstream-visible labels.
9. **Respond** — JSON matching the exact contract the current sub-workflow produces.

### Drop-in swap in n8n

Replace the `executeWorkflow` calls in `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts` at lines 1771 and 1812 with `httpRequest` nodes:

- `POST https://<railway-host>/classify`
- `Authorization: Bearer ${CLASSIFIER_TOKEN}` (n8n predefined credential, same pattern as the Notion POST at workflow lines 2530–2543)
- `retryOnFail: true, waitBetweenTries: 5000, maxTries: 3`
- `onError: 'continueErrorOutput'`
- Response flows into the existing "Map Data for Notion" nodes unchanged.

## Technical Approach

### Architecture

**Repo:** New standalone repo `syntech-article-classifier` on Railway. Lives outside `syntech-n8n-as-code` because the n8n repo follows a TypeScript-workflow + Python-execution pattern scoped to n8n internals, not long-running services.

**Stack:**
- Python **3.12** on Nixpacks (3.13 free-threaded wheels still thin in 2026; I/O-bound workload, GIL is not the bottleneck)
- FastAPI + uvicorn, **single worker** (workload is <1 req/s peak)
- `psycopg` v3 async pool against Neon **pooler endpoint** (`-pooler.neon.tech:6432`, transaction mode)
- `pgvector` for similarity
- `anthropic` SDK (Haiku 4.5, tool-use + prompt caching)
- `openai` SDK for embeddings
- `pydantic` v2 for request/response schemas + `Literal` enums for closed vocab
- `structlog` → stdout JSON (Railway log viewer auto-parses)
- `alembic` for migrations (from Phase 1 — not deferred)

### Neon schema

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE articles (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url                    TEXT NOT NULL,                -- canonical form; non-unique
  url_hash               TEXT NOT NULL UNIQUE,         -- sha256(canonical_url), idempotency key
  title                  TEXT NOT NULL,
  summary                TEXT,
  publication_date       TIMESTAMPTZ,
  source_name            TEXT,
  topic_subject          TEXT NOT NULL,
  topic_action           TEXT NOT NULL,
  topic_entities         TEXT[] NOT NULL DEFAULT '{}',
  topic_geo              TEXT,
  topic_signature        TEXT NOT NULL,
  embedding              VECTOR(512) NOT NULL,
  embedding_model        TEXT NOT NULL,                -- e.g. 'text-embedding-3-small@512'
  embedding_generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  fact_extraction        JSONB NOT NULL,
  classification         TEXT NOT NULL CHECK (classification IN ('unique','update','duplicate')),
  classified_against     UUID REFERENCES articles(id) ON DELETE SET NULL,
  similarity_score       REAL,
  source_env             TEXT NOT NULL DEFAULT 'prod' CHECK (source_env IN ('prod','shadow')),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK ((classification = 'unique') = (classified_against IS NULL)),
  CHECK ((classification = 'unique') OR (similarity_score IS NOT NULL)),
  CHECK (classified_against IS NULL OR classified_against <> id)
);

CREATE INDEX idx_articles_subject_action ON articles (topic_subject, topic_action);

-- HNSW from day 1. No ivfflat rebuild needed at scale.
SET maintenance_work_mem = '2GB';
CREATE INDEX idx_articles_embedding_hnsw
  ON articles USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Updated-at trigger
CREATE FUNCTION touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER articles_touch_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

Per-query: `SET LOCAL hnsw.ef_search = 40;` (raise to 80 only if a recall eval shows <0.95).

### API contract

**`POST /classify`**

Request (matches current n8n upstream output; `article` arrives stringified):
```json
{ "article": "<stringified JSON blob — see brainstorm input example>" }
```
Optional query: `?force=true` to bypass idempotency and reclassify.

Response (byte-for-byte identical to the current sub-workflow output — origin R1):
```json
{
  "classification": "unique | update | duplicate",
  "topical_signature": {
    "topic_subject": "...",
    "topic_action": "...",
    "topic_entities": ["...","..."],
    "topic_geo": "...",
    "topic_signature": "<subject>__<action>__<geo>__<geo>-<entities>"
  },
  "fact_extraction": {
    "entities": ["..."], "actions": ["..."],
    "numerical_values": ["..."], "policy_terms": ["..."],
    "dates": ["..."], "impacts": ["..."]
  }
}
```

**Error envelope** (per AGENTS.md §99–132, returned with matching HTTP 4xx/5xx):
```json
{ "status": "error", "error_code": "snake_case_code", "message": "..." }
```

**`GET /healthz`** — liveness, no DB. **`GET /readyz`** — pool + `SELECT 1`.

**Backfill** is a plain CLI script (`scripts/backfill_from_notion.py`), not an HTTP endpoint. Flags: `--dry-run`, `--resume`, `--force-reembed`. Resumable on `url_hash`; `--force-reembed` re-embeds rows whose `embedding_model` ≠ current.

### Directory layout

```
syntech-article-classifier/
├── app/
│   ├── main.py              # FastAPI app, lifespan, middlewares, routes
│   ├── classify.py          # pipeline orchestration
│   ├── signature.py         # deterministic slug + alias resolver
│   ├── aliases.py           # canonical alias table (seed + extendable)
│   ├── embeddings.py        # OpenAI embedding client + content-hash cache
│   ├── similarity.py        # Neon queries, HNSW scoring, decision rule
│   ├── extract.py           # Haiku tool-use call, forced tool_choice
│   ├── fact_delta.py        # normalized-value diffing (numerics, dates, entities)
│   ├── db.py                # psycopg async pool, upsert
│   ├── auth.py              # bearer middleware with comma-split rotation
│   ├── logging.py           # structlog config + log-field allowlist
│   ├── schemas.py           # pydantic models (Literal enums)
│   └── config.py            # thresholds, model versions, constants
├── scripts/
│   └── backfill_from_notion.py
├── migrations/              # alembic
├── tests/
│   ├── fixtures/            # 50 human-adjudicated articles + expected labels
│   ├── test_signature.py
│   ├── test_fact_delta.py
│   ├── test_similarity.py
│   └── test_classify_parity.py
├── railway.toml
└── pyproject.toml
```

### Key snippets

**`railway.toml`:**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'"
healthcheckPath = "/healthz"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
numReplicas = 1
```

**Bearer middleware (comma-split → zero-downtime rotation):**
```python
import hmac, os
from fastapi import Header, HTTPException, status

def _tokens() -> list[str]:
    return [t.strip() for t in os.environ["CLASSIFIER_TOKEN"].split(",") if t.strip()]

async def require_bearer(authorization: str | None = Header(default=None)) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "missing_bearer")
    presented = authorization.removeprefix("Bearer ").encode()
    for tok in _tokens():
        if hmac.compare_digest(presented, tok.encode()):
            return
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid_bearer")
```
Rotation: set `CLASSIFIER_TOKEN=old,new` → cut n8n to `new` → set `CLASSIFIER_TOKEN=new`.

**psycopg pool (opened in FastAPI `lifespan`, never at import):**
```python
pool = AsyncConnectionPool(
    conninfo=os.environ["DATABASE_URL"],   # -pooler hostname
    min_size=1, max_size=5,
    kwargs={"prepare_threshold": None, "autocommit": True},
    open=False,
)
```

**Haiku extraction (forced tool-use, cached system prompt, temperature 0):**
System message (cached) contains: TypeScript schema + rules ("return only tool call; empty arrays OK; never invent; quote verbatim") + 2 few-shots (1 rich, 1 sparse) + closed-vocab enums for `policy_terms`, `impacts.category`, `impacts.direction`, `topic_action`. On pydantic validation failure, retry once with error appended; if that fails, log and emit empty arrays rather than burn tokens.

Extraction output is **cached by `sha256(title + summary + body_truncated + prompt_version + model_version)`** so retries and reclassifications are free and deterministic despite LLM non-determinism.

### Implementation Phases

Collapsed to **2 phases** (per simplicity review).

#### Phase 1: Build pipeline + seed Neon

- Neon project + `pgvector`; alembic migration creates the schema above.
- Build the full classification pipeline (signature, embed, extract, similarity, fact-delta, upsert). Parity tests against a **50-article human-adjudicated fixture** (not just old-LLM output) stratified by class *and* difficulty (oversample the update/duplicate boundary; include syndication, 24–72h follow-ups, corrections, live-blog entries, republished press releases).
- Point the same pipeline at Notion (iterator + rate limiter) as the one-time backfill path via `scripts/backfill_from_notion.py`. Backfill and live classify share code.
- **Deliverable:** Neon seeded from the Notion corpus; parity ≥85% agreement + Cohen's κ ≥ 0.7 on the fixture; self-agreement of the old LLM measured as ceiling (expect ~95–98% at temp 0); p50 <600ms, p95 <1.5s.

#### Phase 2: Deploy + shadow + cutover

- Deploy to Railway with env: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `CLASSIFIER_TOKEN`, `EMBEDDING_MODEL_VERSION`, `HAIKU_PROMPT_VERSION`.
- **Shadow run on a Neon branch** (not the prod `articles` table) for 48h: old workflow remains authoritative for Notion writes; microservice runs in parallel, writes only to the branched `articles` table (`source_env='shadow'` as a second-line safety), outputs diffed into a Postgres `shadow_runs` table keyed by `url_hash`. Hard env-gated kill switch on any Notion write from the new path.
- Diff dashboard SQL view: rolling 1h/24h confusion matrix + disagreement examples with URLs.
- **Cutover:** replace the two `executeWorkflow` nodes with `httpRequest`, push via `npx n8nac push`, deactivate (not delete) the old sub-workflow via `npx n8nac workflow deactivate sK-5ZAHQNG8DcOcN6Ggch`. Tune thresholds once after the first week of prod logs in-place (no new phase).
- **Deliverable:** end-to-end run on microservice; costs ≤£5/day over 7 consecutive days.

## Alternative Approaches Considered

Carried forward from origin; re-evaluated with research:

- **Pure deterministic NLP for facts:** rejected (parity drops; interpretive fields intractable with rules). Research confirmed small-LLM + closed vocab is the durable answer.
- **ivfflat instead of HNSW:** rejected — HNSW is GA on Neon, avoids rebuild at scale, wins on recall/latency at 1536-dim and 512-dim alike.
- **1536-dim embeddings:** rejected — Matryoshka truncation to 512-dim retains ~99% retrieval quality at 1/3 the index cost.
- **Prompt-return-JSON + pydantic retry:** rejected — 2–4% first-pass failure rate vs 0.2% with Anthropic forced tool-use.
- **Embed full article body:** rejected — title+summary is cleaner, cheaper.
- **Keep Notion as live corpus (no Neon):** rejected — no similarity search; recurring backfill drag.
- **Hybrid rules-first / LLM-fallback for facts:** deferred — simpler to start LLM-only and add rules if cost demands.
- **48h shadow writing to prod `articles`:** rejected — self-poisoning and dual-write races. Neon branch is cleanly isolated.

## System-Wide Impact

### Interaction graph
n8n Stage 3 → `httpRequest` (new) → microservice (normalize → idempotency short-circuit → extract+signature → embed → candidate lookup → scoring → fact-delta → upsert) → response → "Map Data for Notion" → Notion page create/update → Stage 4A/4B scoring (unchanged). Failure on HTTP routes via `continueErrorOutput` to the existing error branch.

### Error propagation
- Microservice errors: structured JSON envelope + non-2xx → n8n error output → existing Slack alerting path.
- Neon: retry once, then 503 `error_code: "neon_unavailable"`.
- LLM providers: 1 retry with backoff; on final failure, log and emit empty-arrays for facts — never silently flip classification to `unique`.
- Pydantic validation failure on Haiku output: 1 retry with error appended; then emit empty arrays + log.

### State lifecycle risks
- **Partial failure between classify and upsert**: LLM calls happen *outside* the DB transaction (they're non-transactional side effects). Short transaction opens only for `SELECT candidates + INSERT ON CONFLICT`; response is sent only on commit. If the upsert fails → 5xx → n8n retries; `url_hash` + idempotency short-circuit make retries safe.
- **Duplicate upsert from n8n retries:** `url_hash UNIQUE` + `ON CONFLICT DO UPDATE` (excluding `classification` / `classified_against` from SET) keeps labels stable.
- **Schema drift Notion ↔ Neon:** backfill is one-shot + resumable; subsequent drift is impossible because the microservice becomes the sole writer.
- **Embedding-model upgrade:** `embedding_model` column + `--force-reembed` backfill flag; thresholds must be re-calibrated on any model swap (CI guard fails if `EMBEDDING_MODEL_VERSION` changes without fixture re-run).
- **URL re-classification months later:** handled via deliberate short-circuit on `url_hash`; `?force=true` is the explicit reclassify path, and it uses `ON CONFLICT` without overwriting `classification` to protect downstream Notion state.

### API surface parity
Only one integration: the two invocations at workflow.ts:1771 and :1812 referencing `sK-5ZAHQNG8DcOcN6Ggch`. Confirmed no other consumers.

### Integration test scenarios
1. **Unknown topic → `unique`:** no candidates. Row created, null `classified_against`.
2. **Same URL resubmitted:** idempotent; no new row, same response.
3. **Syndicated rewording:** high cosine, no new normalized facts → `duplicate`.
4. **Same topic+action, new numeric milestones:** mid-cosine + numeric delta (unit-normalized) → `update`.
5. **Same topic_subject, different action (Sizewell-C construction vs protest):** subject+action filter isolates candidate set → correct `unique` on the protest piece.
6. **Long-running story >90 days apart:** no temporal filter → candidate still found → `update`.
7. **Fact-delta under formatting variance:** `1.2GW` vs `1200MW`, `April 15 2026` vs `2026-04-15` → treated as equal by normalizer.
8. **Embedding-model version change:** CI fails on fixture re-run until thresholds re-tuned.
9. **Neon down mid-request:** 503, no partial write.
10. **Shadow run on Neon branch:** no rows appear in prod `articles`.

## Acceptance Criteria

### Functional
- [ ] `POST /classify` returns the exact shape from origin R1 for every fixture article (no breaking changes to Notion-write node).
- [ ] Layered decision rule implemented (origin R3); candidate filter uses `(topic_subject, topic_action)` both.
- [ ] `topical_signature` matches current output shape (origin R4); `topic_action` from forced-enum LLM output, `topic_subject` deterministic slug + alias.
- [ ] `fact_extraction` populated (origin R5), with closed-vocab Literal enums for `policy_terms` and `impacts.{category,direction}`.
- [ ] Embeddings are 512-dim, computed from `title + summary` only (origin R6), normalized.
- [ ] Every live-mode classification upserts into Neon with `source_env='prod'` (origin R7); backfill CLI seeds once (origin R8).
- [ ] Idempotent on `url_hash`: same URL → same classification, no new row; `?force=true` reclassifies but does not overwrite downstream-visible `classification`/`classified_against` on CONFLICT (origin R9).
- [ ] Railway deploy with bearer auth, `structlog` JSON to stdout, log-field allowlist enforced (origin R10).
- [ ] n8n workflow swaps `executeWorkflow` → `httpRequest` and runs end-to-end unchanged downstream.

### Non-functional
- [ ] p50 <600ms, p95 <1.5s.
- [ ] Steady-state LLM spend ≤£5/day over 7 consecutive days (target £0.80–1.50/day with prompt caching).
- [ ] Classification agreement ≥85% + Cohen's κ ≥ 0.7 vs human labels on the 50-fixture.
- [ ] Old-LLM self-agreement measured and recorded as the ceiling benchmark.
- [ ] Shadow run produces zero writes into prod `articles` (SQL verification: `SELECT count(*) FROM articles WHERE source_env='shadow'` returns 0 in prod DB post-cutover).

### Quality gates
- [ ] `tests/test_classify_parity.py` runs in CI, blocks merge on regression (per-class recall drop >3pp, weighted disagreement up, p95/cost up >20%).
- [ ] CI fails if `EMBEDDING_MODEL_VERSION` or `HAIKU_PROMPT_VERSION` change without a fixture re-run.
- [ ] Error envelope format matches AGENTS.md §99–132 on every failure path.
- [ ] No title/summary/body/url/authorization logged (redaction middleware enforced, not convention).
- [ ] Fixture articles stored as HTML/JSON snapshots in-repo (not live URLs — sites rot).
- [ ] Weekly cron re-runs fixture against prod config to catch silent drift.

## Success Metrics

- **Cost:** drops from £30–40/day to ≤£5/day within 14 days of cutover.
- **Throughput:** sustains ≥10 req/s without queueing.
- **Correctness:** shadow diff shows ≥85% agreement + κ ≥ 0.7 pre-cutover; zero downstream Notion-write failures for 48h post-cutover.
- **Operational:** zero Notion→Neon backfill runs after the initial seed.

## Dependencies & Prerequisites

- Neon project with `pgvector` ≥0.8 and HNSW support.
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `NOTION_API_KEY` available in Railway env.
- 50 **human-adjudicated** labeled classification examples before Phase 1 parity tests run.
- Access to the Notion articles DB schema for the backfill script.
- `npx n8nac push` workflow (per AGENTS.md §134–189).

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Parity <85% or κ <0.7 | Medium | High | Shadow-run on Neon branch; calibrate thresholds against human-labeled fixture; fall back to Haiku-driven classification on mid-band if deterministic path underperforms. |
| Haiku tool-use schema drift | Low | Medium | Forced `tool_choice` + pydantic validation + 1-retry-with-error; closed-vocab Literal enums reduce drift on interpretive fields. |
| Embedding-model silent upgrade | Medium | High | `embedding_model` column + `EMBEDDING_MODEL_VERSION` env var + CI gate on fixture re-run. |
| n8n cutover regresses Notion writes | Low | High | 48h shadow on Neon branch; revert path via `npx n8nac workflow activate sK-5ZAHQNG8DcOcN6Ggch`. |
| URL canonicalization misses a tracking-param variant → duplicate rows | Low | Medium | Conservative normalizer (strip known tracking params only); log unknown variants for review. |
| Prompt-cache hit rate < projected | Low | Medium | Cost target has headroom; fallback is batch API for backfills only. |
| Auth token leak | Low | Medium | Redaction middleware; comma-split rotation; no token in logs. |

## Future Considerations

- **Per-source calibration** — tune thresholds by source type (deferred).
- **Webhook ingestion trigger** — anticipated in brainstorm; no new surface needed.
- **Notion retirement** — once Neon has been authoritative ≥3 months, repoint the human-facing dashboard and retire Notion. Out of scope here.
- **Kappa-monitored rolling re-calibration** — monthly cron compares fresh articles, alerts if κ drops.

## Documentation Plan

- New repo `README.md`: quickstart, env vars, Neon migration, n8n-side swap, rotation procedure.
- `docs/solutions/` in this repo: post-cutover entry once thresholds stabilize (calibration values, Haiku quirks encountered, fixture-building approach). Populates the currently-empty directory.

## Sources & References

### Origin
- **Origin document:** [`docs/brainstorms/2026-04-15-article-classifier-microservice-requirements.md`](../brainstorms/2026-04-15-article-classifier-microservice-requirements.md). Key decisions carried forward:
  1. Layered decision rule (signature → embedding → fact-delta) over signature-only or embedding-only.
  2. Embed `title + summary`, not full article body.
  3. Small-LLM fact extraction (Haiku-class), not pure deterministic NLP.
  4. Microservice owns the Neon upsert; one-time backfill only; no separate sync.
  5. Byte-for-byte output parity so Notion write continues unchanged.

### Research (2026-04-15)
- **pgvector / Neon:** HNSW GA on Neon; `m=16, ef_construction=64`; 512-dim Matryoshka; pooler in transaction mode with `prepare_threshold=None`. Sources: pgvector 0.8.x README; Neon docs on pgvector + HNSW + pooling.
- **Small-LLM fact extraction:** Anthropic forced tool-use (~0.2% failure); prompt caching mandatory at 1000/day; closed-vocab Literal enums for interpretive fields; content-hash caching for idempotency.
- **FastAPI / Railway:** Python 3.12, single uvicorn worker, `lifespan`-managed pool, structlog JSON to stdout, bearer comma-split rotation.
- **Parity testing:** stratified 50-fixture with human adjudication; Cohen's κ + per-class P/R; shadow on Neon branch; pin embedding model version; self-agreement of old LLM as ceiling.

### Internal references
- Current classification sub-workflow invocations: `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts:1771` and `:1812` (sub-workflow id `sK-5ZAHQNG8DcOcN6Ggch`).
- HTTP node pattern to mirror: same file, lines 2530–2543 (predefined credentials + custom headers, `retryOnFail: true, waitBetweenTries: 5000`).
- Upstream Stage 4A/4B prompts (context for the `analysis` blob the classifier receives): [`prompts/news-sourcing-production/stage_4a.md`](../../prompts/news-sourcing-production/stage_4a.md), [`prompts/news-sourcing-production/stage_4b.md`](../../prompts/news-sourcing-production/stage_4b.md).
- Python execution conventions: [`AGENTS.md`](../../AGENTS.md) §99–132.
- n8n push/pull discipline: [`AGENTS.md`](../../AGENTS.md) §134–189.
- Related prior plan (Stage 4 split): [`docs/brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md`](../brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md).

### Related work
- `250a7c2 feat(news-sourcing): split Stage 4 into 4A/4B with Pathway Router`.
- `03e79d5 fix(prompts): review findings — robust parser, tests, doc consolidation`.
