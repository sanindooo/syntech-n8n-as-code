# Claude Instructions — syntech-biofuel-relevance-classifier

## This Is The ACTUAL Classifier

There are two services with "classifier" in the name. **This one actually does classification:**

| Service | What it does |
|---------|--------------|
| `syntech-biofuel-relevance-classifier` | ✅ **THIS ONE** — determines if article is relevant to biofuel industry |
| `syntech-article-classifier` | ❌ Misleading name — extracts metadata + persists to DB (not a classifier) |

## System Context

This service is part of the Syntech biofuel news intelligence pipeline. It determines whether articles are relevant to the biofuel industry.

```
n8n (orchestration)
    │
    │  POST /search
    ▼
syntech-content-sourcing
    │
    │  (drainer flushes batch)
    ▼
n8n Drainer workflow
    │
    │  POST /classify (per article)
    ▼
┌─────────────────────────────────────────────────────────┐
│     syntech-biofuel-relevance-classifier  ← YOU ARE HERE│
│                                                         │
│  Cascade Classifier:                                    │
│  1. Fast model (keyword/heuristic) → quick reject       │
│  2. Claude (if uncertain) → full relevance analysis     │
│                                                         │
│  Writes to:                                             │
│  - article-db (Neon Postgres)                          │
│  - Notion API                                           │
└────────────────────────────┬────────────────────────────┘
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                    ▼
    ┌──────────────┐              ┌────────────────────────┐
    │    Notion    │              │ syntech-intelligence-  │
    │  (articles)  │              │ dashboard (reads DB)   │
    └──────────────┘              └────────────────────────┘
```

## Upstream

- **Called by**: n8n Drainer workflow via `POST /classify`
- **Input contract**: `ClassifyRequest { url, title, content, source, source_category, author, ... }`
- **Auth**: Bearer token
- **Important**: This schema has `ConfigDict(extra="forbid")` — any new field in the request MUST be whitelisted in `app/schemas.py::ClassifyRequest` or the request fails with `Extra inputs are not permitted`

## Downstream

- **Writes to**: 
  - `articles` table in Neon Postgres (shared with dashboard)
  - Notion database via Notion API
- **Returns**: Classification result with relevance score, category, reasoning

## This Service's Role

1. **Classification** — determines if an article is relevant to the biofuel industry
2. **Cascade logic** — fast model rejects obvious non-relevant, Claude handles uncertain cases
3. **Persistence** — writes classified articles to both Postgres and Notion
4. **Deduplication** — checks for duplicate articles before classification

## Key Invariants

1. **`source_category` must be preserved** — comes from the request, must pass through unchanged to DB/Notion. Never infer or modify.

2. **`source` is the platform, not the author** — `source` = "LinkedIn" | "RSS" | etc. The `author` field is separate.

3. **Canonical classification labels** — first-seen label is `new`, never `unique`. Don't invent label values without approval.

4. **Schema is strict** — `ClassifyRequest` uses `extra="forbid"`. When the upstream contract adds a new field, this schema MUST be updated in lockstep.

5. **This is the NEW classifier** — it replaced `syntech-article-classifier` at the biofuel-relevance cutover. The old classifier is no longer called by n8n.

## Important Files

- `app/schemas.py` — `ClassifyRequest`, `ClassifyResponse` (contract definitions)
- `app/cascade/` — cascade classifier logic
- `app/api/` — `/classify`, `/health` endpoints
- `app/db.py` — database operations
- `alembic/` — migrations (uses `public.alembic_version`)

## Related Repositories

| Repository | Relationship |
|------------|--------------|
| [syntech-n8n-as-code](https://github.com/sanindooo/syntech-n8n-as-code) | Orchestration — n8n calls this service via `/classify` |
| [syntech-content-sourcing](https://github.com/sanindooo/syntech-content-sourcing) | Upstream — produces the articles that n8n sends here |
| [syntech-intelligence-dashboard](https://github.com/sanindooo/syntech-intelligence-dashboard) | Downstream — reads from the same `articles` table this service writes to |
| [syntech-article-classifier](https://github.com/sanindooo/syntech-article-classifier) | **DEPRECATED** — old classifier, no longer in use |

To understand what data this service receives or how articles are sourced, check the n8n-as-code and content-sourcing repos.

## Schema Update Protocol

When the article contract changes (new field added upstream):

1. Check if the field needs to pass through to DB/Notion
2. Add the field to `ClassifyRequest` in `app/schemas.py` (required or optional)
3. Update any downstream persistence logic
4. Deploy before the upstream change goes live (or in lockstep)

**Past incident**: PR #10 on `syntech-article-classifier` added `author` support, but this repo wasn't updated. Every classify call failed with `Extra inputs are not permitted` until PR #15 fixed it.

## Environment Variables

Key env vars (see `.env.example` for full list):

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Neon Postgres connection string |
| `NOTION_TOKEN` | Notion API token |
| `NOTION_DATABASE_ID` | Target Notion database |
| `ANTHROPIC_API_KEY` | Claude API key for cascade classifier |

## Health Checks

- `GET /health` — basic health
- `GET /readyz` — full readiness (DB, Notion, Anthropic connectivity)
