# Claude Instructions — syntech-intelligence-dashboard

## System Context

This service is part of the Syntech biofuel news intelligence pipeline. It's the web UI for viewing and managing classified articles.

```
n8n (orchestration)
    │
    ▼
syntech-content-sourcing
    │
    ▼
n8n Drainer workflow
    │
    ▼
syntech-biofuel-relevance-classifier
    │
    │  writes to article-db
    ▼
┌─────────────────────────────────────────────────────────┐
│      syntech-intelligence-dashboard  ← YOU ARE HERE    │
│                                                         │
│  Next.js web application                               │
│  - reads from article-db (Neon Postgres)               │
│  - displays classified articles                        │
│  - provides feedback UI for classification review      │
│  - filters by source, category, relevance, date        │
└─────────────────────────────────────────────────────────┘
```

## Upstream

- **Reads from**: `articles` table in Neon Postgres (written by biofuel-relevance-classifier)
- **No direct API calls from other services** — this is a read-only consumer of the classified data

## Downstream

- **Serves**: Human users (Stephen, team members)
- **May write**: Classification feedback back to DB (if feedback feature is enabled)

## This Service's Role

1. **Display** — shows classified articles with relevance scores, categories, sources
2. **Filtering** — filter by source_category, source, date range, relevance level
3. **Feedback** — allows users to mark classifications as "exceptional" or "wrong"
4. **Export** — may support exporting article data

## Key Invariants

1. **Read-only for most data** — this dashboard reads what the classifier writes. Don't modify classification logic here.

2. **`source_category` display** — shows the category as-is from the DB. If it's wrong, the fix is upstream in content-sourcing.

3. **Feedback goes to a separate table** — classification feedback should write to a feedback table, not modify the original article record.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Drizzle ORM → Neon Postgres
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel

## Important Files

- `drizzle/` — database schema and migrations
- `app/` — Next.js app router pages
- `components/` — React components
- `lib/` — utilities, database client

## Related Repositories

| Repository | Relationship |
|------------|--------------|
| [syntech-n8n-as-code](https://github.com/sanindooo/syntech-n8n-as-code) | Orchestration — defines the pipeline that produces the data |
| [syntech-biofuel-relevance-classifier](https://github.com/Granite-Marketing/syntech-biofuel-relevance-classifier) | Upstream — writes the articles this dashboard displays |
| [syntech-content-sourcing](https://github.com/sanindooo/syntech-content-sourcing) | Upstream — discovers and extracts the articles |

To understand where the data comes from or why a field has a certain value, trace back through the classifier and content-sourcing repos.

## Database Schema

The dashboard reads from tables written by the classifier. Key tables:

- `articles` — classified articles with relevance scores
- `feedback` — user feedback on classifications (if implemented)

When the classifier schema changes, this dashboard's Drizzle schema may need to be updated to match.

## Environment Variables

Key env vars (see `.env.example`):

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Neon Postgres connection string (same DB as classifier) |
| `NEXTAUTH_SECRET` | Auth secret (if auth is enabled) |
