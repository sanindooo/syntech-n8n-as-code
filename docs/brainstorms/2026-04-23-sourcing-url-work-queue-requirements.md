---
date: 2026-04-23
topic: sourcing-url-work-queue
---

# Content-Sourcing URL Work Queue (Fully Async + Webhook Reconciliation)

## Problem Frame

A single `/search` call against `syntech-content-sourcing` today does URL discovery (Apify/Tavily/SERP/RSS) **and** per-URL HTML fetch + article extraction inside one synchronous request. When a client adds a new keyword that surfaces ~100+ fresh URLs — or, realistically, a 2,500-URL sourcing run across dozens of Notion sources — the request times out long before all URLs have been processed. Unprocessed URLs are silently dropped from the response. After PR #7 (test-mode dedup fix), they at least stay un-seen and are eligible for re-processing on the next run, but:

- The scheduled workflow runs **once per day**. A delay of "next run" is unacceptable — important news on the drop day never surfaces until the following day.
- Raising timeouts or semaphore concurrency masks the issue; the cap reappears at larger batch sizes.
- There's no crash-resilience — a Railway restart mid-extraction drops whatever was in flight.

The goal is a durable, crash-resilient URL work queue inside `syntech-content-sourcing` (Neon-backed, same Postgres instance), modelled on the proven `classifier.dashboard_sync_outbox` + `drain_loop` pattern already running in `syntech-article-classifier`. Every URL that enters the system is persisted, extracted asynchronously, and delivered to the existing n8n downstream pipeline via a webhook trigger, so **no URLs are dropped and all articles complete the full classifier → Notion → Slack chain**.

## Requirements

### Queue + State Machine

- **R1.** Create table `content_sourcing.url_work_queue` in Neon. Each row represents one URL + enough source-request context to produce an `ArticleResponse` on successful extraction. Exact schema deferred to planning; must persist through restarts and support atomic claim via `FOR UPDATE SKIP LOCKED`.

- **R2.** Rows progress through an explicit state machine:

    | State           | Meaning                                                            | Blocks flush? |
    |-----------------|--------------------------------------------------------------------|---------------|
    | `queued`        | Enqueued, `attempts = 0`, never touched by the drainer             | **Yes**       |
    | `in_flight`     | Drainer is actively extracting                                     | **Yes**       |
    | `waiting_retry` | Attempted, failed transiently, backoff scheduled via `next_attempt_at` | No        |
    | `ready`         | Extracted successfully, `ArticleResponse` stored in the row, sitting in the flush buffer | — |
    | `sent`          | Included in a webhook flush that succeeded. Terminal.              | —             |
    | `failed`        | Permanent failure (4xx, validation, dead-letter). Terminal.        | —             |

- **R3.** Split the current `pending` shape into **`queued`** (never attempted) and **`waiting_retry`** (attempted, awaiting backoff) so the flush predicate can distinguish them. This is essential to R9.

### Discovery vs Extraction Split

- **R4.** Keep **discovery** (Apify / Tavily / SERP / RSS feed parse — whatever produces a URL list) synchronous inside `/search`. The existing handler code keeps its current shape up to the point where URLs are identified.

- **R5.** Extraction (HTML fetch, readability, validation, `ArticleResponse` construction) moves **out of the request path** and into the drainer. `/search` no longer does per-URL work; it only enqueues.

- **R6.** `POST /search` becomes "discover + enqueue + return". Response shape:

    ```json
    { "status": "queued", "queued": 47, "skipped_dedup": 12 }
    ```

    The caller (n8n) does not block waiting for articles. The `articles` array is removed from the response.

- **R7.** **Retire `POST /search/batch`.** Once discovery is cheap and return-fast, batching at the HTTP layer adds no value and keeps two near-identical code paths alive. All traffic funnels through `/search`.

### Drainer

- **R8.** A single asyncio task (`drain_loop`) spawned by the FastAPI lifespan on Railway startup, shut down cleanly on termination. Same pattern as `classifier.dashboard_sync.drain_loop`:
    - Polls `url_work_queue` every ~0.5–1s.
    - Claims batches of `queued` or `waiting_retry` rows where `next_attempt_at <= now()` via `FOR UPDATE SKIP LOCKED`.
    - Runs extraction in parallel within the batch.
    - Routes each outcome into the state machine (ready / waiting_retry / failed).
    - Handles stale-lock recovery for `in_flight` rows whose drainer crashed (~10 min threshold, same as classifier).
    - No external cron or scheduler — the loop is self-driven while the process is up.

### Flush Predicate (Core Mechanism)

- **R9.** **Flush condition:** the drainer flushes `ready` rows to the n8n webhook when **all** of the following hold:

    ```
    count(status = 'queued')    = 0
    count(status = 'in_flight') = 0
    count(status = 'ready')     > 0
    ```

    This is the only flush trigger. No size caps, no absolute time caps, no cohort IDs. The queue's state is the "sourcing burst has settled" signal, and it scales equally to 50 and 2,500 URLs.

- **R10.** **30-second settle timer** on top of R9:
    - When the flush condition first becomes true, start a `FLUSH_SETTLE_SEC` countdown (default 30s, ENV-tunable).
    - On every drainer tick, re-check the predicate. If `queued > 0` or `in_flight > 0` re-appears, **cancel** the timer. Next time the condition re-becomes true, the timer restarts fresh.
    - If the timer expires uninterrupted, the flush fires.
    - Rationale: catches 1st-retry backoffs (10s) and 2nd-retry edge (30s) so imminent retries consolidate into the main batch; absorbs small gaps between successive `/search` calls during a sourcing run so semantic dedup sees the largest possible cross-source array.

### Webhook Delivery

- **R11.** **Target URL:** `https://syntech-biofuels.granite-automations.app/webhook/flush-syntech-queue` (n8n-hosted).

- **R12.** **Payload shape:** single POST per flush containing **an array of articles**:

    ```json
    { "articles": [ { ...ArticleResponse }, { ...ArticleResponse }, ... ] }
    ```

    Each element is shape-identical to the per-article item `/search` returns today (same `ArticleResponse` model) so the n8n downstream nodes work unchanged. The webhook is explicitly designed to accept arbitrary shape, so the envelope (`{articles: [...]}` vs raw array) can be finalized during planning.

- **R13.** **Delivery semantics:** one flush → one POST → one webhook invocation. The webhook feeds into the **same** classifier → Notion → Slack chain used by the existing scheduled workflow (n8n workflow gets a new `Webhook` trigger node wired into the same downstream, so both triggers share one canonical downstream).

- **R14.** **Failure handling on the POST itself:**
    - 2xx → all included rows transition to `sent`.
    - Transient (timeout, 5xx, 429) → all included rows revert to `ready` and the flush retries with backoff on the next drainer tick. The batch is not broken apart.
    - Permanent (non-429 4xx) → dead-letter the batch (rows move to `failed` with the response body in `last_error`) and surface via admin log/metric. This is a configuration failure; alerting should page on it.

- **R15.** **Straggler waves are expected and accepted.** A URL on its 3rd+ retry (2-minute+ backoff) will complete after the main flush, trigger the flush predicate again, and fire as its own smaller wave. Semantic dedup and Notion-URL dedup still run on those waves; arrays of 1–3 stragglers work correctly.

### Retry / Backoff / Dead-Letter

- **R16.** Reuse the classifier outbox backoff schedule: attempt 1 → 10s, attempt 2 → 30s, attempt 3 → 2m, attempt 4 → 10m, attempts 5+ → 1h, dead-letter at `MAX_ATTEMPTS` (default 50 ≈ two days of sustained outage). Exact constants live in config; this requirement just anchors the shape.

- **R17.** Classify extraction outcomes explicitly:
    - **Permanent** (→ `failed`): 404, 410, hard 403, content validation failure, garbled/anti-bot junk content caught by existing guards.
    - **Transient** (→ `waiting_retry`): network error, 5xx, 429, timeout, IP-level rate limit (see anti-bot-fallback work).
    - Never raise; every handler outcome maps deterministically to one of the two.

### Enqueue-Time Dedup

- **R18.** Enqueue is the dedup gate. Before inserting a row, check the URL against:
    1. `content_sourcing.seen_urls` (existing table, terminal `sent`/`failed` history).
    2. Any row currently in `queued` / `in_flight` / `waiting_retry` / `ready` in `url_work_queue` (prevents a second `/search` call in an overlapping run from re-enqueuing the same URL).

    Duplicates are counted in the `/search` response (`skipped_dedup`) and not inserted. Exact URL-normalization rules deferred to planning (already deferred in the parent microservice brainstorm, R9).

### Observability & Admin

- **R19.** Structured log events at minimum: `queue_enqueue`, `queue_claim_batch`, `extract_success`, `extract_transient`, `extract_permanent`, `flush_predicate_true`, `flush_settle_started`, `flush_settle_cancelled`, `flush_fired`, `webhook_post_ok`, `webhook_post_transient`, `webhook_post_permanent`, `stale_lock_recovered`. Each event carries `url_hash` (never raw URL), source context, and counters.

- **R20.** Admin endpoint `GET /admin/queue/status` (bearer-gated, ops-only) returning:

    ```json
    {
      "counts_by_status": {"queued": N, "in_flight": N, "waiting_retry": N, "ready": N, "sent": N, "failed": N},
      "oldest_queued_age_sec": N,
      "oldest_ready_age_sec": N,
      "settle_timer_active": bool,
      "seconds_until_flush": N | null
    }
    ```

    Sufficient for a human to answer "is the queue healthy right now?" without direct SQL access.

- **R21.** Admin endpoint `GET /admin/queue/failed` listing dead-lettered rows (URL, last_error, last_status_code, attempts) so failures can be inspected and optionally re-queued.

### Config Knobs (ENV, overridable per deploy)

- **R22.** Minimum tunables (exact variable names finalized in planning):
    - `FLUSH_SETTLE_SEC` (default 30) — R10.
    - `DRAIN_POLL_INTERVAL_SEC` (default 1.0).
    - `DRAIN_BATCH_SIZE` (default 10 — mirrors classifier outbox).
    - `WEBHOOK_URL` — R11.
    - `WEBHOOK_TIMEOUT_SEC` (default 30).
    - `MAX_ATTEMPTS` (default 50).
    - `STALE_LOCK_SEC` (default 600).

### n8n Integration

- **R23.** Add one `Webhook` trigger node to `"News Sourcing Production (V2)"` workflow at the path `/webhook/flush-syntech-queue`. Its `main` output connects to the same node that currently receives the `/search` HTTP node's output (i.e., the Split In Batches → classifier → Notion → Slack chain). The Schedule trigger and the Webhook trigger share one canonical downstream.

- **R24.** The workflow must be published for the webhook URL to activate. Stephen enables this at integration-test time; agent must pause and signal rather than assume it is live.

- **R25.** The existing scheduled `/search` calls remain, but they now always return `articles: []`. The downstream from the scheduled trigger side is expected to become a no-op per-run (the Schedule trigger effectively just kicks off discovery; all article work flows through the Webhook trigger path). Planning must confirm this doesn't break any n8n-side assertion / count / filter that assumes the scheduled path sees articles.

## Success Criteria

- 100% of discovered URLs eventually reach a terminal state (`sent` or `failed`); none are silently dropped between `/search` calls or across Railway restarts.
- For a 100-URL fresh-keyword run, all 100 articles arrive in n8n (as one flush of ~N successful + optional smaller straggler waves) **within the same scheduled workflow tick that triggered them** — i.e., same-day delivery for the daily schedule, validated by Notion CMS + Slack notification traces.
- For a 2,500-URL sourcing run, no flush fragments into size-capped batches; semantic dedup operates on the full cross-source array.
- Queue state is introspectable without SQL via `/admin/queue/status`.
- Recovery from a mid-extraction crash is automatic (stale-lock sweep + `queued` rows persist).
- No regressions in current `/search` callers other than the intentional contract change (empty `articles`, new `queued` / `skipped_dedup` counters).

## Scope Boundaries

- **Not** replacing n8n as the downstream orchestrator; classifier → Notion → Slack remains in n8n.
- **Not** moving discovery (Apify / Tavily / SERP / RSS) into the queue. Discovery stays synchronous in `/search`. If slow-Apify discovery becomes the next bottleneck, a two-tier queue (`discovery` + `extraction` work types) is a future follow-up — captured as deferred.
- **Not** building a UI for queue inspection; admin HTTP endpoints + Railway logs are sufficient.
- **Not** changing the classifier, dashboard sync, or Notion/Slack nodes. The webhook rejoins the existing chain at a shape-identical point.
- **Not** horizontally scaling the drainer. Single instance on Railway is sufficient at current volumes; the `FOR UPDATE SKIP LOCKED` claim path is compatible with future scale-out but not a goal for this cut.
- **Not** migrating historical un-processed URLs; the queue starts empty and fills from new `/search` calls.

## Key Decisions

- **Fully async over hybrid sync+async.** Every article flows through the webhook; `/search` never returns articles. One path eliminates reconciliation bugs and makes the "100% success, no flakiness" guarantee tractable.
- **Webhook reconciliation over direct-to-classifier POST.** Downstream Notion write + Slack notify live in n8n; bypassing n8n would leave those articles invisible in Notion/Slack. The webhook trigger is the cheapest point that keeps the full pipeline in a single orchestrator.
- **State-based flush predicate over time/size caps.** Fixed thresholds misfire at both ends of the volume range; the queue's own state is a lossless signal of "the sourcing burst has settled." This also eliminates two tunable magic numbers.
- **30s settle timer on top of the predicate.** Small latency cost (+30s on a multi-minute flow) in exchange for catching 1st-retry consolidations and smoothing over micro-gaps between successive `/search` calls, which in turn maximises semantic-dedup effectiveness.
- **Port the classifier outbox pattern rather than invent.** `classifier.dashboard_sync_outbox` + `drain_loop` is already production-hardened with backoff, stale-lock recovery, and `FOR UPDATE SKIP LOCKED`. Reusing the shape minimises novelty risk.
- **Retire `/search/batch`.** Once discovery is cheap, batching at the HTTP layer is redundant. One endpoint, one code path.

## Dependencies / Assumptions

- Neon database is the same Postgres instance already used by `content_sourcing.seen_urls` and `classifier.*` — no new infra.
- `syntech-biofuels.granite-automations.app/webhook/flush-syntech-queue` will be publishable in the existing n8n instance.
- The anti-bot fallback work (project memory: `project_anti_bot_fallback_phase4.md`) lands independently; this queue design is orthogonal and does not assume either outcome.
- The existing `ArticleResponse` model continues to be the canonical per-article contract into the n8n downstream.
- n8n webhooks accept arbitrary JSON shape, per Stephen's confirmation.

## Outstanding Questions

### Resolve Before Planning

- *(none — every product-level decision is captured above)*

### Deferred to Planning

- [Affects R1][Technical] Exact `url_work_queue` schema — columns for source-request context, indices for the claim + flush-predicate queries, FK to `seen_urls`, and retention policy for `sent`/`failed` rows.
- [Affects R10][Technical] Implementation of the settle timer — asyncio timer task, debounced check loop, or single-tick-check-against-elapsed — choose during planning with testability in mind.
- [Affects R11][User decision] Webhook auth mechanism — n8n webhook bearer header vs HMAC signature vs IP allow-list. Default recommendation: bearer header matching the pattern already used for `httpBearerAuth` in the workflow (memory: `feedback_n8n_bearer_auth.md`).
- [Affects R12][User decision] Envelope shape — `{articles: [...]}` vs raw array. Drive from whichever the Webhook trigger + downstream nodes unwrap most cleanly.
- [Affects R14][Needs research] Retry behaviour when the webhook returns 2xx but one or more articles fail downstream validation in n8n — out of scope to re-deliver; ensure the drainer treats 2xx as success regardless of n8n-internal outcome.
- [Affects R18][Technical] URL normalization rules shared with `seen_urls` (query-param stripping, trailing-slash handling, case folding). Tied to parent brainstorm R9 (still open).
- [Affects R25][Technical] Audit the scheduled-trigger branch of the n8n workflow to confirm no node downstream of the `/search` HTTP node breaks when its output is always empty. Specifically check any `IF`, `Filter`, or error-on-empty nodes.
- [Affects R4][Needs research] **Deferred follow-up**: two-tier queue (discovery + extraction) if Apify discovery latency becomes the new bottleneck. Not in scope for this cut.
- [Affects drainer][Technical] Whether a request-level `asyncio.wait_for` guard is still needed inside the *discovery* call path (Apify actors that hang). Likely yes for safety; exact timeout deferred.
- [Affects R20/R21][Technical] Admin endpoint auth — reuse existing `require_admin_token` pattern in `app/auth.py`.

## Next Steps

→ `/ce:plan` for structured implementation planning.
