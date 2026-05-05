# Claude Instructions — syntech-semantic-article-deduplication

## System Context

This service is part of the Syntech biofuel news intelligence pipeline. It provides semantic deduplication using embeddings.

```
syntech-content-sourcing
    │
    │  POST /deduplicate (optional)
    ▼
┌─────────────────────────────────────────────────────────┐
│  syntech-semantic-article-deduplication  ← YOU ARE HERE│
│                                                         │
│  - embedding-based similarity detection                 │
│  - finds semantically similar articles                  │
│  - returns duplicate candidates                         │
└─────────────────────────────────────────────────────────┘
```

## Upstream

- **Called by**: content-sourcing or n8n (depending on integration point)
- **Input**: Article content/title for embedding comparison
- **Auth**: Bearer token (if configured)

## Downstream

- **Returns**: Similarity scores, duplicate candidate IDs
- **Used for**: Preventing duplicate articles from being classified/stored

## This Service's Role

1. **Embedding generation** — converts article text to vector embeddings
2. **Similarity search** — finds existing articles similar to a new candidate
3. **Deduplication decision** — returns whether an article is likely a duplicate

## Key Invariants

1. **Semantic, not exact** — this catches articles that are reworded or from different sources but cover the same news
2. **Threshold tuning** — similarity threshold determines false positive/negative tradeoff

## Important Files

- `app.py` — main FastAPI application
- `deduplicator.py` — embedding and similarity logic
- `config.py` — configuration

## Related Repositories

| Repository | Relationship |
|------------|--------------|
| [syntech-content-sourcing](https://github.com/sanindooo/syntech-content-sourcing) | Upstream — may call this for dedup before queueing |
| [syntech-n8n-as-code](https://github.com/sanindooo/syntech-n8n-as-code) | Orchestration — may call this as part of the pipeline |

## Environment Variables

Key env vars (see `example.env`):

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Vector store connection |
| `EMBEDDING_MODEL` | Model to use for embeddings |
| `SIMILARITY_THRESHOLD` | Threshold for duplicate detection |
