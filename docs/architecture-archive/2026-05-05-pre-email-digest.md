# Syntech Content Pipeline — Architecture (Pre-Email Digest)

**Archived:** 2026-05-05
**Superseded by:** `../ARCHITECTURE.md`
**Change:** Added `syntech-email-digest` service; marked Notion writes as deprecated

---

## Pipeline Flow (before email-digest)

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
    │ - persists to Neon Postgres        │
    │ - posts to Notion                  │
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
```

## Email Flow (n8n workflow, now deprecated)

A separate n8n workflow "Email Content Feed" read from Notion hourly and sent digest emails. This was flaky due to Notion's 2000 character limit causing upstream write failures.

## Repository Index (at this point)

| Repository | Role | Runtime |
|------------|------|---------|
| `syntech-n8n-as-code` | Workflow orchestration | n8n Cloud |
| `syntech-content-sourcing` | URL discovery + extraction | Railway |
| `syntech-biofuel-relevance-classifier` | Relevance classification | Railway |
| `syntech-article-processor` | Metadata + persistence | Railway |
| `syntech-intelligence-dashboard` | Web UI | Vercel |
