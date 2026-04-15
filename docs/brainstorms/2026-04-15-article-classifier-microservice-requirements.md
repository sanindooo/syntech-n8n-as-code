---
date: 2026-04-15
topic: article-classifier-microservice
---

# Article Classifier Microservice

## Problem Frame
The n8n news-sourcing workflow currently classifies each incoming article as `unique` / `update` / `duplicate` and extracts topical signature + facts using a large LLM call that compares against the Notion corpus. This costs £30–40/day in API usage and scales poorly as throughput increases (daily cron today, webhook-driven soon, expected to break 100/day). A self-hosted microservice using embeddings + a small extractor LLM can deliver the same output structure at a fraction of the cost, while also eliminating the need for recurring Notion→Neon backfills.

## Requirements

- **R1.** The microservice exposes a single HTTP endpoint that accepts the current n8n input shape (one article, including the upstream Stage 1–3 `analysis` blob) and returns the **byte-for-byte existing output shape**: `classification`, `topical_signature` (with identical nested fields incl. composite `topic_signature` string), and `fact_extraction` (entities, actions, numerical_values, policy_terms, dates, impacts). This is a drop-in replacement for the current LLM node — all downstream n8n stages, including the Notion write that adds classified articles back to the source database, continue to run unchanged.
- **R2.** Classification returns one of `unique`, `update`, `duplicate`, matching current LLM behavior to within rough parity (balanced precision/recall; no strict accuracy bar).
- **R3.** Classification uses a layered rule: deterministic topic-signature lookup in Neon → embedding similarity against candidates → delta check on extracted facts to split `update` vs `duplicate`. Thresholds live in config, not code.
- **R4.** Topic signature (subject, action, entities, geo, composite `topic_signature` string) is produced by the microservice with the same shape as today's output. A small/cheap LLM may be used for subject/action normalization if pure rules prove insufficient during tuning.
- **R5.** Fact extraction (entities, actions, numerical_values, policy_terms, dates, impacts) is produced by a single small-LLM call (e.g. Haiku or gpt-4o-mini) with a constrained JSON schema. This call runs regardless of classification outcome, since downstream stages depend on the fields.
- **R6.** Embeddings are computed for `title + summary` (not raw article body) to reduce boilerplate noise, and stored in Neon (pgvector) alongside the article record.
- **R7.** On every classification, the microservice upserts the new article into Neon (id, url, title, summary, topic_signature, embedding, fact_extraction, classification, timestamps). This replaces recurring Notion→Neon backfill scripts going forward.
- **R8.** A one-time backfill script seeds Neon from the existing Notion corpus (signature + embedding + facts) before the microservice goes live. After that, Neon is self-maintaining.
- **R9.** The service is idempotent on article URL: re-submitting the same URL returns a consistent classification and does not create duplicate rows.
- **R10.** Deployed on Railway, reachable from n8n via HTTP with a shared secret / bearer token. Logs classification decisions + similarity scores for later threshold tuning.

## Success Criteria

- Daily LLM spend on this step drops from £30–40/day to under £5/day at current volume.
- Classification agreement with the current LLM output is ≥ ~85% on a spot-check of 50+ recent articles (balanced parity, not strict match).
- n8n workflow continues to run end-to-end with no schema changes to downstream stages.
- No standalone Notion→Neon backfill script needs to run after initial seed.

## Scope Boundaries

- **Not** replacing the Stage 1–3 scoring/strategic-analysis LLM calls — only the classification + extraction step.
- **Not** changing downstream behavior — the n8n node that writes classified articles to Notion continues to run against the same output contract. Notion remains the human-facing destination until a future migration.
- **Not** building a UI, admin dashboard, or manual override tooling in v1.
- **Not** streaming or sub-second latency; single-request HTTP with a few hundred ms budget is fine.
- **Not** multi-tenant — single Syntech corpus, single Neon database.
- **Not** attempting to outperform the current LLM on classification accuracy; parity is the bar.

## Key Decisions

- **Layered decision rule (signature → embedding → fact delta)**: Topic signature alone is too coarse to split duplicate vs update; full-article embeddings are too noisy (boilerplate, captions). Layering gives predictable buckets plus fuzzy disambiguation within a bucket.
- **Embed `title + summary`, not full article body**: Cleaner semantic signal, cheaper to compute, less sensitive to source-site chrome.
- **Small LLM for fact extraction, not pure NLP**: Fact shape (impacts, policy_terms) is too interpretive for spaCy/regex to match parity. A small model (Haiku class) on a constrained schema is ~10–20× cheaper than the current call and retains quality.
- **Microservice owns the Neon upsert**: Removes the recurring backfill concern and keeps the corpus authoritative for classification in one place.
- **Notion stays the human-facing source of truth**; Neon is the machine-facing mirror for classification. No bidirectional sync required.

## Dependencies / Assumptions

- Neon Postgres with `pgvector` extension is available (or will be provisioned) for this project.
- n8n can call the Railway service over HTTPS and inject a secret header.
- An existing embedding provider is acceptable (OpenAI `text-embedding-3-small` or similar); embeddings are cheap enough not to be the new cost bottleneck.
- Current Notion corpus is small enough to backfill in one pass (low-hundreds to low-thousands of articles).

## Outstanding Questions

### Resolve Before Planning
- *(none — product shape is clear enough to plan against)*

### Deferred to Planning
- [Affects R3][Needs research] Initial threshold values for duplicate/update/unique cosine bands — calibrate against ~50 labeled examples from current LLM output during implementation.
- [Affects R4][Technical] Whether topic-signature subject/action normalization needs a small LLM or can be handled with controlled vocabulary + rules. Decide during a prototyping spike.
- [Affects R5][Technical] Exact model choice for fact extraction (Haiku 4.5 vs gpt-4o-mini vs other) — benchmark cost/quality during planning.
- [Affects R7][Technical] Schema design for the Neon `articles` table (columns, indexes, pgvector index type: ivfflat vs hnsw given expected corpus growth).
- [Affects R10][Technical] Authentication model between n8n and the Railway service (static bearer token vs signed request vs Railway private networking).
- [Affects R8][Technical] Whether the one-time Notion backfill should live inside the microservice repo as a CLI, or as a separate script in this n8n-as-code repo.

## Next Steps
→ `/ce:plan` for structured implementation planning
