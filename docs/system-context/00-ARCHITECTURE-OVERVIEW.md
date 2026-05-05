# Syntech Content-Sourcing Pipeline — Architecture Overview

This document describes the full system architecture for the Syntech biofuel news intelligence pipeline. Each microservice repo should include a subset of this context in its CLAUDE.md so Claude understands the service's position in the broader system.

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
    │ ACTUAL CLASSIFIER                  │             │
    │ - determines biofuel relevance     │             │
    │ - cascade: fast model + Claude     │             │
    │ - returns relevance score/decision │             │
    └────────────────────┬───────────────┘             │
                         │                              │
                         │  (if relevant)               │
                         ▼                              │
    ┌────────────────────────────────────┐             │
    │ syntech-article-processor         │◄────────────┘
    │ (FastAPI)                          │
    │                                    │
    │ ⚠️  MISLEADING NAME                │
    │ This is NOT a classifier!          │
    │ - extracts metadata (author, date) │
    │ - persists to Neon Postgres        │
    │ - posts to Notion                  │
    │                                    │
    │ Should be called:                  │
    │ "article-processor" or             │
    │ "article-persister"                │
    └────────────────────┬───────────────┘
                         │
           ┌─────────────┴─────────────┐
           ▼                            ▼
    ┌──────────────┐          ┌──────────────────────┐
    │    Notion    │          │  syntech-intelligence│
    │  (articles)  │          │  -dashboard (Next.js)│
    └──────────────┘          │  - reads from DB     │
                              │  - shows articles    │
                              │  - feedback UI       │
                              └──────────────────────┘

Optional branch (deduplication):
    ┌──────────────────────────────────────────────────────────────┐
    │      syntech-semantic-article-deduplication (FastAPI)        │
    │  - embedding-based semantic deduplication                    │
    └──────────────────────────────────────────────────────────────┘
```

## Repository Index

| Repository | Actual Role | Naming Note | Runtime | Upstream | Downstream |
|------------|-------------|-------------|---------|----------|------------|
| `syntech-n8n-as-code` | Workflow orchestration | — | n8n Cloud | Cron/Webhook | content-sourcing, both "classifiers" |
| `syntech-content-sourcing` | URL discovery + extraction + work queue | — | Railway | n8n `/search` | n8n drainer webhook |
| `syntech-biofuel-relevance-classifier` | **RELEVANCE CLASSIFICATION** — decides if article is biofuel-related | Name is accurate | Railway | n8n `/classify` | Returns decision to n8n |
| `syntech-article-processor` | **METADATA EXTRACTION + PERSISTENCE** — extracts metadata, writes to DB/Notion | ⚠️ Misleading name — should be "article-processor" | Railway | n8n `/classify` | article-db, Notion |
| `syntech-intelligence-dashboard` | Web UI for viewing classified articles | — | Vercel | article-db reads | Human users |
| `syntech-semantic-article-deduplication` | Semantic dedup via embeddings | — | Railway | content-sourcing or n8n | — |

## Naming Clarification (IMPORTANT)

The two "classifier" services have confusingly similar names but do **completely different things**:

| Service | What it sounds like | What it actually does |
|---------|---------------------|----------------------|
| `syntech-biofuel-relevance-classifier` | Classifies for relevance | ✅ Yes — determines if article is relevant to biofuel industry |
| `syntech-article-processor` | Classifies articles | ❌ No — extracts metadata and persists to DB/Notion |

**When reading code or logs, remember:**
- "Relevance classifier" = actual classification decision
- "Article classifier" = metadata extraction + database persistence

Future consideration: rename `syntech-article-processor` to `syntech-article-processor` or `syntech-article-persister` to reduce confusion.

## Shared Contracts

### ArticleResponse (canonical shape)

All services that produce or consume articles must preserve this shape:

```python
class ArticleResponse:
    url: str                    # canonical URL (after redirect resolution)
    title: str                  # article title
    content: str                # extracted text content
    source: str                 # platform: "LinkedIn" | "RSS" | "Google" | "Website" | "Keyword" | ...
    source_category: str        # user-defined category from source config
    author: str | None          # author name (separate from source)
    published_at: datetime | None
    # ... other fields
```

### Key Invariants

1. **`source` is the platform, not the author** — `source` = "LinkedIn" | "RSS" | "Tavily" | etc. Author goes in `author` field.

2. **`source_category` must be preserved** — originates from the source config, passed through content-sourcing → n8n → classifiers → DB/Notion. Never inferred or modified.

3. **Canonical classification labels** — first-seen label is `new`, never `unique`. Don't invent label values.

4. **Bearer auth pattern** — use `httpBearerAuth` in n8n, not `httpHeaderAuth`, for Authorization headers.

5. **Output fields are schema** — changing handler output fields (source, title, etc.) requires approval; they propagate to Notion/DB and cause backfill pain.

## Environment & Hosting

| Service | Host | Database |
|---------|------|----------|
| content-sourcing | Railway | Neon Postgres (`content_sourcing` schema) |
| biofuel-relevance-classifier | Railway | — (stateless, returns decision) |
| article-classifier (processor) | Railway | Neon Postgres (writes `articles` table) |
| intelligence-dashboard | Vercel | Neon Postgres (reads `articles` table) |
| n8n workflows | n8n Cloud (granite-automations.app) | — |

## Cross-Repo Debugging

When something fails in the pipeline:

1. **Check n8n execution logs** — see which step failed
2. **Check Railway logs for the failing service** — search for `request_id` if available
3. **Check `/admin/queue/status`** on content-sourcing for queue health
4. **Identify which "classifier" failed** — relevance (decision) vs article (persistence)

## How to Use This Document

Copy the relevant sections into each microservice's `CLAUDE.md`. Each repo should include:

1. The simplified pipeline diagram showing where THIS service sits
2. The upstream/downstream table row for THIS service
3. The naming clarification section (critical for avoiding confusion)
4. Any invariants that affect THIS service
5. Links to related repos for cross-referencing
