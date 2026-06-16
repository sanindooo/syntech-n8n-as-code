# Syntech Content Pipeline — Architecture Overview

**This is the canonical architecture document.** All repositories in the pipeline reference this file.

**Location:** `/Users/sanindo/syntech-n8n-as-code/docs/ARCHITECTURE.md`

## Versioning

When making significant architectural changes, archive the current version before updating:
1. Copy this file to `architecture-archive/YYYY-MM-DD-<change-name>.md`
2. Add a header noting what changed and when
3. Update this file with the new architecture

See `architecture-archive/` for previous versions.

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SYNTECH CONTENT PIPELINE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

                              n8n Orchestration
                             (syntech-n8n-as-code)
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│ News Sourcing     │    │ Syntech Mention   │    │ Process Articles  │
│ Production (V2)   │    │ Monitor           │    │ (Drainer)         │
│ 14 nodes          │    │ 8 nodes           │    │ 52 nodes          │
│ Schedule: 8am     │    │ Schedule: 8am     │    │ Webhook trigger   │
└─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
          │                        │                        │
          │ Notion sources         │ Notion sources         │ receives batches
          │ (News category)        │ (Mention category)     │ from content-sourcing
          ▼                        ▼                        │
    ┌──────────────────────────────────────────────────────────────┐
    │            syntech-content-sourcing (FastAPI)                │
    │  ┌─────────────────────────────────────────────────────┐     │
    │  │  Handlers: RSS │ Google │ Keyword │ Website │ Apify │     │
    │  │            (LinkedIn │ Instagram │ X/Twitter)        │     │
    │  └─────────────────────────────────────────────────────┘     │
    │                          │                                    │
    │                          ▼                                    │
    │  ┌────────────────────────────────────────────┐              │
    │  │     url_work_queue (Postgres table)        │              │
    │  │  states: queued → in_flight → ready/failed │              │
    │  └────────────────────────────────────────────┘              │
    │                          │                                    │
    │                          ▼                                    │
    │  ┌────────────────────────────────────────────┐              │
    │  │  Drainer (background task)                 │              │
    │  │  - extracts HTML + Zyte fallback           │              │
    │  │  - flushes batches to webhook              │              │
    │  └────────────────────────────────────────────┘              │
    └──────────────────────────┬───────────────────────────────────┘
                               │
                               │  POST /webhook/flush-syntech-queue
                               ▼
    ┌──────────────────────────────────────────────────────────────┐
    │              Process Articles (n8n Drainer Workflow)         │
    │  - receives batch of extracted articles                      │
    │  - routes by source_category:                                │
    │                                                              │
    │    ┌────────────────────┐    ┌────────────────────┐         │
    │    │ source_category    │    │ source_category    │         │
    │    │ = "Mention"        │    │ ≠ "Mention" (News) │         │
    │    └─────────┬──────────┘    └─────────┬──────────┘         │
    │              │                          │                    │
    │              ▼                          ▼                    │
    │    POST /mentions/analyze      POST /classify → /process    │
    └──────────────┬───────────────────────────┬───────────────────┘
                   │                           │
                   │                           │
                   ▼                           ▼
    ┌────────────────────────────────────────────────────────────┐
    │ syntech-article-processor (FastAPI)                        │
    │                                                            │
    │ POST /process (News)              POST /mentions/analyze   │
    │ - extracts metadata               - sentiment analysis     │
    │ - relevance already classified    - GPT-4o-mini (0-5 scale)│
    │ - persists to articles table      - persists to mentions   │
    │                                     + mention_enrichments  │
    │                                                            │
    │ ──────────────── Shared Neon Postgres ─────────────────────│
    │   articles table    │    mentions + mention_enrichments    │
    └────────────────────────────────────────────────────────────┘
                               │
                               │
    ┌────────────────────────────────────┐
    │ syntech-biofuel-relevance-         │  (News path only)
    │ classifier (FastAPI)               │
    │                                    │
    │ - determines biofuel relevance     │
    │ - cascade: fast model + Claude     │
    │ - returns relevance score/decision │
    └────────────────────────────────────┘

                              (shared database)
                                     │
    ┌────────────────────────────────┼─────────────────────────────┐
    │ syntech-email-digest ◄───── n8n/API trigger                  │
    │ (FastAPI)                                                    │
    │                                                              │
    │ ┌──────────────────────┐    ┌──────────────────────┐        │
    │ │ POST /digest/send    │    │ POST /digest/mentions│        │
    │ │ (News articles)      │    │ /send (Mentions)     │        │
    │ │ - clusters by topic  │    │ - unsent mentions    │        │
    │ │ - LLM summaries      │    │ - sentiment badges   │        │
    │ │ - Gmail delivery     │    │ - Gmail delivery     │        │
    │ └──────────────────────┘    └──────────────────────┘        │
    │                                                              │
    │ API:                                                         │
    │ - GET  /digest/pending         → {topic: count}              │
    │ - POST /digest/preview         → preview without sending     │
    │ - POST /digest/send            → trigger news digest         │
    │ - POST /digest/test-send       → smoke-test today's render   │
    │ - POST /digest/replay          → resend a missed digest      │
    │ - POST /digest/mentions/send   → trigger mentions digest     │
    └──────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Gmail (Team)        │
              └──────────────────────┘

           ┌────────────────────────────────────────────┐
           │  syntech-intelligence-dashboard (Next.js)  │
           │  - reads from same Postgres DB             │
           │  - shows articles + mentions               │
           │  - feedback UI for both                    │
           └────────────────────────────────────────────┘
```

## Repository Index

| Repository | Role | Runtime | Database |
|------------|------|---------|----------|
| `syntech-n8n-as-code` | Workflow orchestration | n8n Cloud | — |
| `syntech-content-sourcing` | URL discovery + extraction | Railway | Own Postgres (url_work_queue) |
| `syntech-biofuel-relevance-classifier` | Relevance classification (News only) | Railway | — |
| `syntech-article-processor` | News processing + Mentions sentiment | Railway | **Neon Postgres (articles, mentions)** |
| `syntech-email-digest` | News + Mentions digest delivery | Railway | **Shares article-processor DB** |
| `syntech-intelligence-dashboard` | Web UI (articles + mentions) | Vercel | **Shares article-processor DB** |

## Local Paths

All repositories live under `/Users/sanindo/`:
- `syntech-n8n-as-code`
- `syntech-content-sourcing`
- `syntech-biofuel-relevance-classifier`
- `syntech-article-processor`
- `syntech-email-digest`
- `syntech-intelligence-dashboard`

## Shared Contracts

### ArticleResponse (canonical shape)

```python
class ArticleResponse:
    url: str                    # canonical URL (after redirect resolution)
    title: str                  # article title
    content: str                # extracted text content
    source: str                 # platform: "LinkedIn" | "RSS" | "Google" | "Website" | "Keyword" | ...
    source_category: str        # user-defined category from source config
    author: str | None          # author name (separate from source)
    published_at: datetime | None
```

### Mentions API (syntech-article-processor)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/mentions/analyze` | POST | Bearer | Sentiment analysis + persistence |

**Request body:**
```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "source": "LinkedIn",
  "summary": "Brief summary",
  "content": "Full article content",
  "publication_date": "2026-05-06T10:00:00Z"  // optional, ISO format
}
```

**Response:**
```json
{
  "id": 123,
  "sentiment_score": 4,        // 0-5 scale
  "sentiment_label": "positive", // negative | neutral | positive
  "reason": "Article praises Syntech's expansion plans"
}
```

**Notes:**
- Sentiment scored using GPT-4o-mini (0-5 scale, mapped to labels)
- Persists to `mentions` + `mention_enrichments` tables
- Idempotent: existing mentions return cached sentiment (use `?force=true` to re-analyze)

### Email Digest API (syntech-email-digest)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/digest/pending` | GET | No | Check unsent article counts per topic |
| `/digest/preview` | POST | Required | Preview digest without sending |
| `/digest/send` | POST | Required | Trigger the daily news digest (cron entrypoint) |
| `/digest/test-send` | POST | Required | Render today's digest to a hardcoded test recipient; never marks articles sent |
| `/digest/replay` | POST | Required | Resend a missed digest to one recipient for a past date (recovery) |
| `/digest/mentions/send` | POST | Required | Trigger mentions digest send |

**Request body** (for `/digest/send` and `/digest/preview`):
```json
{
  "topics": ["Biodiesel", "SAF"],  // optional: filter to topics
  "dry_run": true                   // optional: generate summaries without sending
}
```

**Request body** (for `/digest/mentions/send`):
```json
{
  "sender_name": "Custom Sender",  // optional: override default sender
  "dry_run": true                   // optional: preview without sending
}
```

**Request body** (for `/digest/replay`):
```json
{
  "recipient": "user@example.com",
  "target_date": "2026-06-14"
}
```

**`/digest/test-send` contract:** No request body. The recipient is hardcoded at module level in `syntech-email-digest/app/main.py` (`TEST_DIGEST_RECIPIENT`) so a leaked `WEBHOOK_SECRET` cannot redirect the send to an arbitrary inbox — this was the failure mode of the reverted `/test/send-email` endpoint (commits `6bd9ed0`, `a99de72`). Concurrent calls return `409 Conflict` (serialised by an `asyncio.Lock`). The pipeline times out at 60s (`504 Gateway Timeout`). Never calls `mark_articles_sent`, so the production morning cron still fires normally.

**Response shape (all endpoints):**
- Success: `DigestResponse` — `{status:"ok", topics_sent, stories_sent, articles_marked, topic_results, reason, error, dry_run, test_mode}`.
- Error (HTTP 500): `detail = {status:"error", message:"<human>", error:"<enum>"}`. Same shape across `/digest/send`, `/digest/test-send`, `/digest/replay`, and `/digest/mentions/send`.
- Error enums: `email_auth_expired` (Gmail OAuth needs reauthorising); `all_topics_failed` (articles were queued but every topic failed to deliver to any recipient — most likely a Gmail outage and n8n should alarm); replay-specific codes documented in the email-digest repo.

**Authentication:** `WEBHOOK_SECRET` is **required**. Every protected endpoint refuses with HTTP 503 if the env var is unset — the service will not fail open.

### Key Invariants (Cross-Service)

1. **`source` is the platform, not the author** — `source` = "LinkedIn" | "RSS" | "Tavily" | etc.

2. **`source_category` must be preserved** — originates from the source config, passed through the entire pipeline unchanged.

3. **Canonical classification labels** — first-seen label is `new`, never `unique`.

4. **Bearer auth pattern** — use `httpBearerAuth` in n8n, not `httpHeaderAuth`.

5. **Output fields are schema** — changing handler output fields requires approval.

## Cross-Repo Debugging

1. **Check n8n execution logs** — see which step failed
2. **Check Railway logs** — search for `request_id` if available
3. **Check `/admin/queue/status`** on content-sourcing for queue health
