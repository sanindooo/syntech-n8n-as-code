# Claude Instructions — syntech-content-sourcing

## System Context

This service is part of the Syntech biofuel news intelligence pipeline. It handles URL discovery and content extraction.

```
n8n (orchestration)
    │
    │  POST /search (per source)
    ▼
┌─────────────────────────────────────────────────────────┐
│           syntech-content-sourcing  ← YOU ARE HERE     │
│                                                         │
│  Handlers: RSS │ Google │ Keyword │ Website │ Apify    │
│            (LinkedIn │ Instagram │ X/Twitter)           │
│                         │                               │
│                         ▼                               │
│  ┌───────────────────────────────────────────────────┐ │
│  │     url_work_queue (Postgres)                     │ │
│  │  queued → in_flight → ready/failed                │ │
│  └───────────────────────────────────────────────────┘ │
│                         │                               │
│                         ▼                               │
│  Drainer → extracts HTML → flushes batch to webhook    │
└────────────────────────────┬────────────────────────────┘
                             │
                             │  POST /webhook/flush-syntech-queue
                             ▼
                      n8n Drainer workflow
                             │
                             │  POST /classify
                             ▼
                biofuel-relevance-classifier
                             │
                             ▼
                    article-db + Notion
```

## Upstream

- **Called by**: n8n workflows via `POST /search`
- **Input contract**: `SearchRequest { url_or_keyword, source_name, source_type, source_category, ... }`
- **Auth**: Bearer token (`CONTENT_SOURCING_TOKEN` env var)

## Downstream

- **Calls**: n8n webhook at `WEBHOOK_URL` when flush predicate fires
- **Output contract**: `{ status, articles: ArticleResponse[], flush_id, queue_row_ids, ... }`
- **The drainer flushes batches** — n8n receives them and loops through to call the classifier

## This Service's Role

1. **Discovery** — `POST /search` discovers URLs from various sources (RSS feeds, Google Alerts, Tavily keyword search, direct website scraping, Apify actors for social platforms)
2. **Queueing** — discovered URLs are enqueued to `url_work_queue` with seed metadata
3. **Extraction** — the background drainer claims queued rows, fetches HTML (with Zyte anti-bot fallback), extracts content
4. **Flushing** — when `queued=0 ∧ in_flight=0 ∧ ready>0` holds for 30s, the drainer POSTs the batch to n8n

## Key Invariants

1. **`source` is the platform, not the author** — `source` = "LinkedIn" | "RSS" | "Google" | "Website" | "Keyword" | "Instagram" | "X". Never the author name or downstream search engine.

2. **`source_category` must be preserved** — comes from the source config, must pass through unchanged to the flush payload. Never infer or modify.

3. **Output fields are schema** — changing handler output fields requires approval; they propagate to Notion/DB downstream.

4. **`mark_seen` happens AFTER successful queue insert** — dedup invariant: no URL in `seen_urls` without also being in `url_work_queue`. Never pre-mark in a handler.

5. **Apify handlers use pre_extracted path** — LinkedIn/Instagram/X/Twitter return extracted content from Apify; they don't go through the drainer's fetch_html path.

## Important Files

- `app/handlers/` — one handler per source type
- `app/queue/` — queue schema, enqueue, drainer logic
- `app/extraction.py` — HTML fetch, Zyte fallback, content extraction
- `app/api/routes.py` — `/search`, `/admin/queue/*` endpoints
- `alembic/` — migrations (uses `content_sourcing.alembic_version`, not `public`)

## Related Repositories

| Repository | Relationship |
|------------|--------------|
| [syntech-n8n-as-code](https://github.com/sanindooo/syntech-n8n-as-code) | Orchestration — calls this service via `/search`, receives flush webhook |
| [syntech-biofuel-relevance-classifier](https://github.com/Granite-Marketing/syntech-biofuel-relevance-classifier) | Downstream — receives articles from n8n after this service flushes |
| [syntech-intelligence-dashboard](https://github.com/sanindooo/syntech-intelligence-dashboard) | Downstream — displays classified articles |

To understand how n8n calls this service or what happens after the flush, check out the n8n-as-code repo and read the relevant workflow files.

## Environment Variables

Key env vars (see `.env.example` for full list):

| Var | Purpose |
|-----|---------|
| `QUEUE_ENABLED` | Kill switch for queue (no sync fallback exists) |
| `WEBHOOK_URL` | n8n endpoint to flush batches to |
| `WEBHOOK_BEARER_TOKEN` | Must match n8n Header Auth credential |
| `MAX_ATTEMPTS` | Dead-letter threshold (default: 6) |
| `DRAIN_BATCH_SIZE` | Rows claimed per drainer tick |
| `FLUSH_SETTLE_SEC` / `FLUSH_MAX_WAIT_SEC` | Flush timing |

## Admin Endpoints

- `GET /readyz` — health check (look for `drainer: ok`)
- `GET /admin/queue/status` — counts by status, oldest ages
- `GET /admin/queue/failed` — dead-lettered rows
- `POST /admin/queue/requeue` — flip rows back to queued
