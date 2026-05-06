# ARCHIVED: Syntech Content Pipeline — Architecture Overview

> **Archived:** 2026-05-06
> **Superseded by:** Mentions microservice migration
> **Changes:** Added /mentions/analyze endpoint routing in Process Articles drainer, 
> splitting Mention vs News paths. Mentions now go through article-processor sentiment 
> analysis instead of n8n LLM classification.

---

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
                    ┌────────────────┴────────────────┐
                    │                                  │
                    ▼                                  ▼
    ┌──────────────────────────┐          Schedule/Webhook Trigger
    │   /search (per source)   │
    └────────────┬─────────────┘
                 │
                 ▼
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
    │                  n8n Drainer Workflow                        │
    │  - receives batch of extracted articles                      │
    │  - loops through articles                                    │
    │  - calls relevance classifier, then article processor        │
    └──────────────────────────┬───────────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        │                                              │
        │  POST /classify                              │
        ▼                                              │
    ┌────────────────────────────────────┐             │
    │ syntech-biofuel-relevance-         │             │
    │ classifier (FastAPI)               │             │
    │                                    │             │
    │ - determines biofuel relevance     │             │
    │ - cascade: fast model + Claude     │             │
    │ - returns relevance score/decision │             │
    └────────────────────┬───────────────┘             │
                         │                              │
                         │  (if relevant)               │
                         ▼                              │
    ┌────────────────────────────────────┐             │
    │ syntech-article-processor          │◄────────────┘
    │ (FastAPI)                          │
    │                                    │
    │ - extracts metadata (author, date) │
    │ - persists to Neon Postgres ◄──────┼─────────────┐
    │ - posts to Notion (deprecated)     │             │
    └────────────────────────────────────┘             │
                                                       │
                                              (shared database)
                                                       │
    ┌──────────────────────────────────────────────────┼───────────┐
    │ syntech-email-digest ◄───── n8n/API trigger      │           │
    │ (FastAPI)                                        │           │
    │                                                  │           │
    │ - reads articles from Postgres ◄─────────────────┘           │
    │ - groups by topic, clusters similar articles                 │
    │ - generates LLM summaries (10 concurrent)                    │
    │ - sends HTML email via Gmail                                 │
    │ - batch marks articles as sent                               │
    │                                                              │
    │ API:                                                         │
    │ - GET  /digest/pending  → {topic: count}                     │
    │ - POST /digest/preview  → preview without sending            │
    │ - POST /digest/send     → trigger digest                     │
    │   body: {topics?: [...], dry_run?: bool}                     │
    └──────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Gmail (Team)        │
              └──────────────────────┘

           ┌────────────────────────────────────────────┐
           │  syntech-intelligence-dashboard (Next.js)  │
           │  - reads from same Postgres DB             │
           │  - shows articles, feedback UI             │
           └────────────────────────────────────────────┘
```

## Repository Index

| Repository | Role | Runtime | Database |
|------------|------|---------|----------|
| `syntech-n8n-as-code` | Workflow orchestration | n8n Cloud | — |
| `syntech-content-sourcing` | URL discovery + extraction | Railway | Own Postgres (url_work_queue) |
| `syntech-biofuel-relevance-classifier` | Relevance classification | Railway | — |
| `syntech-article-processor` | Metadata + persistence | Railway | **Neon Postgres (articles)** |
| `syntech-email-digest` | Email digest delivery | Railway | **Shares article-processor DB** |
| `syntech-intelligence-dashboard` | Web UI | Vercel | **Shares article-processor DB** |

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

### Email Digest API (syntech-email-digest)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/digest/pending` | GET | No | Check unsent article counts per topic |
| `/digest/preview` | POST | Optional | Preview digest without sending |
| `/digest/send` | POST | Optional | Trigger digest send |

**Request body** (for `/digest/send` and `/digest/preview`):
```json
{
  "topics": ["Biodiesel", "SAF"],  // optional: filter to topics
  "dry_run": true                   // optional: generate summaries without sending
}
```

**Authentication:** If `WEBHOOK_SECRET` env var is set, requires `X-API-Key` header.

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
