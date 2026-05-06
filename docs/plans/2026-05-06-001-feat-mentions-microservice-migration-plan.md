---
title: "feat: Syntech Mentions Microservice Migration"
type: feat
status: active
date: 2026-05-06
origin: docs/brainstorms/2026-05-06-syntech-mentions-microservice-migration-requirements.md
---

# feat: Syntech Mentions Microservice Migration

## Summary

Migrate the Syntech Mentions Monitor workflow from 7 sub-workflows to the established microservice architecture: content-sourcing for URL discovery (new `X_Keyword` handler), article-processor for sentiment analysis + persistence (new `/mentions/analyze` endpoint), and email-digest for notifications (new `/digest/mentions/send` endpoint). Pre-filter logic (regex + LLM fallback) runs in n8n code nodes, keeping services stateless.

---

## Problem Frame

The current Syntech Mention Monitor workflow (`XO9Or6DUoTqXgAA5`) tracks mentions across social platforms and news sources, but suffers from high LLM costs (pre-screener runs on every article), maintenance burden (7 sub-workflows duplicating logic), Notion dependency (migrating away), and missing email digest integration. The goal is to align with the same microservice architecture used for the news pipeline. (See origin: `docs/brainstorms/2026-05-06-syntech-mentions-microservice-migration-requirements.md`)

---

## Requirements

- R1. Replace 7 sub-workflows with calls to existing `POST /search` endpoint on content-sourcing
- R2. Add X keyword search handler using `apidojo/twitter-scraper-lite` with `source_type: "X_Keyword"`
- R3. Do NOT use Tavily/SERP API for Google News (Google Alerts RSS sufficient)
- R4. Instagram keyword search is deferred
- R5. Replace LLM pre-screener with regex filter + lightweight LLM fallback
- R6. Pre-filter keyword configuration stored externally (ENV vars), not hardcoded
- R7. Pre-filter runs in n8n workflow (code node), not in microservice
- R7a. Exclude content authored by Syntech's own accounts (configurable blocklist)
- R7b. Exclusion check runs before pre-filter
- R7c. Blocklist is configurable (ENV vars)
- R8. Add `POST /mentions/analyze` endpoint to article-processor
- R9. Endpoint performs sentiment analysis + persistence in one call
- R10. Sentiment scoring: 0-5 scale matching existing workflow criteria
- R11. Existing `/process` endpoint unchanged (no regression)
- R12. Sources stay in Notion for this phase
- R13. Sources admin UI migration deferred
- R14. Add `POST /digest/mentions/send` endpoint to email-digest
- R15. `sender_name` parameter overrides ENV default
- R16. Include all mentions regardless of sentiment score
- R17. Existing `/digest/send` endpoint unchanged (no regression)
- R18. Run migration script to sync Notion mentions to Postgres before decommissioning
- R19. Verify counts match before disabling Notion writes
- R20. Simplified n8n workflow structure per brainstorm
- R21. Remove all 7 `executeWorkflow` calls
- R22. Remove all Notion write nodes
- R23. Keep existing semantic deduplication call unchanged

---

## Scope Boundaries

- Dashboard UI changes (mentions UI already exists)
- Biofuel relevance classifier changes (different concern)
- Changes to existing News pipeline routes or handlers
- Changes to existing `/classify`, `/process`, `/digest/send` endpoints

### Deferred to Follow-Up Work

- Instagram keyword search (R4): research Apify actors when needed
- Sources admin UI migration (R13): later holistic migration with richer features
- Tavily/SERP API integration: Google Alerts RSS sufficient

---

## Context & Research

### Relevant Code and Patterns

- `syntech-content-sourcing/app/handlers/twitter.py` — existing X handler pattern to follow
- `syntech-content-sourcing/app/handlers/base.py` — BaseHandler ABC, DiscoveredURL dataclass
- `syntech-content-sourcing/app/handlers/__init__.py` — handler registration via `register_handler()`
- `syntech-content-sourcing/app/models.py` — SearchRequest, ArticleResponse, source_type Literal
- `syntech-article-processor/app/main.py` — endpoint registration pattern with `require_bearer`
- `syntech-article-processor/app/schemas.py` — Pydantic schema patterns
- `syntech-email-digest/app/main.py` — endpoint pattern with `verify_webhook_secret`
- `syntech-email-digest/app/schemas.py` — DigestRequest/DigestResponse patterns
- `syntech-intelligence-dashboard/src/scripts/migrate-mentions.ts` — existing migration script

### Institutional Learnings

- Bearer auth: use `httpBearerAuth` credential type in n8n, not `httpHeaderAuth` (see `memory/feedback_n8n_bearer_auth.md`)
- Output fields are schema: never change handler output fields without approval (see `memory/feedback_output_fields_are_schema.md`)
- `mark_seen` after queue: content-sourcing dedup invariant (see `memory/feedback_mark_seen_after_queue.md`)
- n8n to microservice cutover patterns: `JSON.stringify()` per field, `onError: 'continueErrorOutput'`, `X-Request-Id` header (see `docs/solutions/2026-n8n-to-microservice-cutover.md`)

### External References

- `apidojo/twitter-scraper-lite` Apify actor: keyword search with 256MB RAM budget
- Sentiment scoring criteria from existing workflow (0-5 scale)

---

## Key Technical Decisions

- **Separate source_type for X keyword search**: `X_Keyword` routes to new handler without touching existing `X` timeline handler. Zero regression risk for News pipeline. (See origin Key Decisions)

- **Pre-filter in n8n, not microservice**: Keeps sentiment analysis service stateless. Regex handles 90%+ of cases instantly; LLM fallback for edge cases only. (See origin Key Decisions)

- **`pre_extracted` path for X_Keyword handler**: Apify returns full content, bypassing drainer extraction. Matches LinkedIn/Instagram handler pattern.

- **Sentiment endpoint combines analysis + persistence**: Single call to `/mentions/analyze` does sentiment scoring and database write. Simpler than coordinating separate services.

- **gpt-4o-mini for sentiment analysis**: Matches brainstorm R10 criteria. article-processor already has OpenAI integration.

- **Branch naming**: `feat/mentions-microservice-migration` across all 4 repos for coordinated deployment.

---

## Open Questions

### Resolved During Planning

- **Apify actor for X keyword search**: `apidojo/twitter-scraper-lite` with 256MB RAM budget. Confirmed in content-sourcing brainstorm docs.
- **Authentication for new endpoints**: `/mentions/analyze` uses bearer token pattern (matches `/classify`); `/digest/mentions/send` uses X-API-Key header (matches existing `/digest/send` pattern with `verify_webhook_secret`).
- **Database schema for mentions**: Uses existing `mentions` + `mention_enrichments` tables in dashboard DB.

### Deferred to Implementation

- **Complete roles list from client**: Affects R6 pre-filter config. Get from client before deploying to production.
- **Syntech account blocklist per platform**: Affects R7a source exclusion. Get from client before deploying to production.
- **Email template design for mentions digest**: Structure and sentiment display format. Design during U3 implementation.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           n8n Mentions Workflow                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Schedule Trigger                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  Get Sources from Notion ──► Filter Active Sources                          │
│       │                                                                      │
│       ▼                                                                      │
│  Loop: POST /search (content-sourcing)                                       │
│       │   ├── RSS (Google Alerts)                                            │
│       │   ├── LinkedIn (keyword search)                                      │
│       │   └── X_Keyword (new handler)                                        │
│       │                                                                      │
│       ▼                                                                      │
│  Semantic Deduplication (existing Railway service)                           │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Source Exclusion (Code Node)                                         │    │
│  │  - Check author/URL against Syntech account blocklist                │    │
│  │  - Pass non-Syntech content to pre-filter                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Pre-filter (Code Node)                                               │    │
│  │  Tier 1: "Syntech" present → PASS                                    │    │
│  │  Tier 2: surname + biofuel context → PASS (flag for LLM check)       │    │
│  │  Tier 3: LLM fallback for Tier 2 edge cases                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  POST /mentions/analyze (article-processor)                                  │
│       │   ├── Sentiment analysis (gpt-4o-mini, 0-5 scale)                   │
│       │   └── Persist to mentions + mention_enrichments tables               │
│       │                                                                      │
│       ▼                                                                      │
│  Slack Notification (unchanged)                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                     Separate: Email Digest Trigger                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /digest/mentions/send (email-digest)                                   │
│       │   ├── Query unsent mentions from DB                                  │
│       │   ├── Render email template with sentiment display                   │
│       │   └── Send via Gmail API with custom sender_name                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Units

### U1. X_Keyword Handler (syntech-content-sourcing)

**Goal:** Add keyword search handler for X/Twitter using `apidojo/twitter-scraper-lite` actor.

**Requirements:** R2

**Dependencies:** None

**Files:**
- Create: `syntech-content-sourcing/app/handlers/x_keyword.py`
- Modify: `syntech-content-sourcing/app/handlers/__init__.py`
- Modify: `syntech-content-sourcing/app/models.py` (add `"X_Keyword"` to both `source_type` Literal and `ArticleResponse.source` Literal)
- Test: `syntech-content-sourcing/tests/test_x_keyword_handler.py`

**Approach:**
- Implement `XKeywordHandler(BaseHandler)` following `twitter.py` pattern
- Use `pre_extracted` path — Apify returns full content, no drainer extraction needed
- Add actor mapping for `twitter_scraper_lite` in Apify runner config
- Register handler via `register_handler()` in `__init__.py`

**Patterns to follow:**
- `app/handlers/twitter.py` — existing X handler structure
- `app/handlers/linkedin.py` — keyword search pattern with `pre_extracted`

**Test scenarios:**
- Happy path: keyword search returns posts, handler transforms to ArticleResponse list
- Happy path: empty results return empty list (not error)
- Edge case: actor timeout handled gracefully with error isolation
- Edge case: malformed actor response returns empty list with logged warning

**Verification:**
- Handler registered and discoverable via `/search` with `source_type: "X_Keyword"`
- Test suite passes with mocked Apify responses

---

### U2. Mentions Analyze Endpoint (syntech-article-processor)

**Goal:** Add `POST /mentions/analyze` endpoint for sentiment analysis and persistence.

**Requirements:** R8, R9, R10, R11

**Dependencies:** None

**Files:**
- Create: `syntech-article-processor/app/mentions.py`
- Modify: `syntech-article-processor/app/main.py`
- Modify: `syntech-article-processor/app/schemas.py`
- Test: `syntech-article-processor/tests/test_mentions.py`

**Approach:**
- Add `MentionRequest` and `MentionResponse` Pydantic schemas
- Implement sentiment analysis using gpt-4o-mini with 0-5 scale criteria from R10
- Add database queries for `mentions` and `mention_enrichments` tables (dashboard schema, not classifier schema — requires new DB connection or shared pool)
- Map 0-5 score to 3-value label: 0-1 → "negative", 2-3 → "neutral", 4-5 → "positive" (lowercase to match DB schema)
- Use existing `require_bearer` dependency for auth
- Return `{ id, sentiment_score, sentiment_label, reason }`

**Patterns to follow:**
- `app/main.py` — existing `/classify` endpoint registration
- `app/classifier.py` — existing OpenAI integration pattern

**Test scenarios:**
- Happy path: article with "Syntech" mention analyzed and persisted, returns sentiment score
- Happy path: sentiment labels map correctly to score ranges (0=Very Negative, 5=Very Positive)
- Edge case: duplicate URL returns existing mention ID without re-analyzing
- Error path: OpenAI API failure returns 503 with error message
- Error path: database write failure returns 500, does not leave partial state

**Verification:**
- Endpoint responds to `POST /mentions/analyze` with valid bearer token
- Sentiment scores match criteria from R10
- Records appear in `mentions` and `mention_enrichments` tables

---

### U3. Mentions Digest Endpoint (syntech-email-digest)

**Goal:** Add `POST /digest/mentions/send` endpoint for mentions email digest.

**Requirements:** R14, R15, R16, R17

**Dependencies:** None

**Files:**
- Create: `syntech-email-digest/app/mentions_digest.py`
- Create: `syntech-email-digest/templates/mentions_digest.html`
- Modify: `syntech-email-digest/app/main.py`
- Modify: `syntech-email-digest/app/schemas.py`
- Test: `syntech-email-digest/tests/test_mentions_digest.py`

**Approach:**
- Add `MentionsDigestRequest` schema with `sender_name` and `dry_run` fields
- Query unsent mentions from `mentions` table (join `mention_enrichments` for sentiment)
- Render Jinja2 template with sentiment display (score, label, reason)
- Use existing Gmail API integration with `sender_name` override
- Mark mentions as sent after successful email delivery

**Patterns to follow:**
- `app/main.py` — existing `/digest/send` endpoint
- `app/digest.py` — existing `run_digest()` pattern
- `templates/digest.html` — existing email template structure

**Test scenarios:**
- Happy path: unsent mentions queried, email rendered with sentiment, sent via Gmail
- Happy path: `sender_name` parameter overrides ENV default
- Happy path: `dry_run: true` returns preview without sending
- Edge case: no unsent mentions returns success with count=0
- Edge case: all sentiment scores included regardless of value (per R16)

**Verification:**
- Endpoint responds to `POST /digest/mentions/send` with valid auth
- Email template displays sentiment correctly
- `sender_name` override works as expected

---

### U4. Source Exclusion Logic (n8n workflow)

**Goal:** Add code node to filter out Syntech's own content before pre-filter runs.

**Requirements:** R7a, R7b, R7c

**Dependencies:** None

**Files:**
- Modify: `syntech-n8n-as-code/workflows/.../Syntech Mention Monitor.workflow.ts`

**Approach:**
- Add Code node after semantic deduplication, before pre-filter
- Read blocklist from ENV vars (comma-separated per platform)
- Check author/source URL against blocklist patterns
- Pass non-Syntech content to pre-filter; exclude matches

**Patterns to follow:**
- Existing code nodes in News Sourcing workflow for expression patterns

**Test scenarios:**
- Happy path: Syntech LinkedIn company page URL filtered out
- Happy path: Syntech X handle (@syntechbiofuel) filtered out
- Happy path: third-party content passes through unchanged
- Edge case: empty blocklist passes all content through

**Verification:**
- Code node correctly filters Syntech-authored content
- Blocklist is configurable via ENV without code changes

---

### U5. Pre-filter Logic (n8n workflow)

**Goal:** Replace LLM pre-screener with regex filter + LLM fallback in n8n code node.

**Requirements:** R5, R6, R7

**Dependencies:** U4 (source exclusion runs first)

**Files:**
- Modify: `syntech-n8n-as-code/workflows/.../Syntech Mention Monitor.workflow.ts`

**Approach:**
- Add Code node implementing three-tier filter from R5:
  - Tier 1: regex for "Syntech" (case-insensitive) → instant pass to sentiment analysis
  - Tier 2: surname + biofuel context WITH "Syntech" present → instant pass to sentiment analysis
  - Tier 3: surname + biofuel context WITHOUT "Syntech" → LLM check (gpt-4o-mini) to confirm relevance before passing to sentiment
- Read keyword config from ENV vars per R6
- Output: items that pass Tier 1/2 directly, plus Tier 3 items that pass LLM check

**Patterns to follow:**
- Existing code nodes in News Sourcing workflow

**Test scenarios:**
- Happy path: article with "Syntech Biofuel" passes Tier 1 instantly
- Happy path: article with "CEO Bingham" + "biofuel" passes Tier 2
- Happy path: Tier 2 match without "Syntech" triggers LLM fallback
- Edge case: article with no matching terms filtered out (no LLM cost)
- Edge case: empty content string handled gracefully

**Verification:**
- Tier 1 regex handles 90%+ of true positives without LLM
- LLM fallback only triggered for Tier 2 edge cases
- Keyword config is externalized to ENV

---

### U6. Workflow Migration (n8n workflow)

**Goal:** Replace 7 sub-workflows with HTTP calls to microservices.

**Requirements:** R1, R20, R21, R22, R23

**Dependencies:** U1, U2, U4, U5

**Files:**
- Modify: `syntech-n8n-as-code/workflows/.../Syntech Mention Monitor.workflow.ts`

**Approach:**
- Remove all `executeWorkflow` nodes calling sub-workflows
- Replace with HTTP Request nodes calling `POST /search` with appropriate source configs
- Add HTTP Request node calling `POST /mentions/analyze` after pre-filter
- Remove all Notion write nodes (AddContentWithDate, AddContentToPost, etc.)
- Keep existing semantic deduplication call unchanged per R23
- Keep Slack notification logic unchanged
- Use `httpBearerAuth` credential type for all HTTP calls
- Add `X-Request-Id` header with `$execution.id` for log correlation

**Execution note:** Pull current workflow before editing; verify with `n8nac verify` after push.

**Patterns to follow:**
- `docs/solutions/2026-n8n-to-microservice-cutover.md` — HTTP Request node patterns
- Existing News Sourcing V2 workflow — HTTP call structure

**Test scenarios:**
- Happy path: workflow executes end-to-end, mentions persisted to Postgres
- Happy path: Slack notification fires on new mentions
- Integration: content-sourcing returns articles, passed to sentiment analysis
- Error path: content-sourcing 503 handled with retry-on-fail
- Error path: article-processor 503 routes to error output

**Verification:**
- No `executeWorkflow` nodes remain
- No Notion write nodes remain
- Semantic deduplication call unchanged
- Workflow activates and runs successfully

---

### U7. Data Migration (syntech-intelligence-dashboard)

**Goal:** Migrate existing Notion mentions to Postgres before decommissioning Notion writes.

**Requirements:** R18, R19

**Dependencies:** U2 (mentions table schema must match)

**Files:**
- Run: `syntech-intelligence-dashboard/src/scripts/migrate-mentions.ts`

**Approach:**
- Set required ENV vars: `DATABASE_URL`, `NOTION_API_KEY`, `NOTION_MENTIONS_DATABASE_ID`, `OPENAI_API_KEY`
- Run migration script: `npx tsx src/scripts/migrate-mentions.ts`
- Compare counts between Notion and Postgres `mentions` table
- Only disable Notion writes in workflow after verification passes

**Patterns to follow:**
- Existing migration script documentation

**Test scenarios:**
- Happy path: all Notion mentions migrated to Postgres with correct field mapping
- Happy path: sentiment data preserved in `mention_enrichments` table
- Edge case: duplicate URLs handled (skip or update, not error)

**Verification:**
- Count in Postgres matches count in Notion
- Sample mentions spot-checked for correct field values
- Migration is idempotent (can re-run safely)

---

## System-Wide Impact

- **Interaction graph:** n8n workflow calls content-sourcing, article-processor, email-digest. No new callbacks or middleware.
- **Error propagation:** HTTP 5xx from services routes to n8n error output with retry-on-fail. Partial failures (some articles fail sentiment) should not block others.
- **State lifecycle risks:** Mentions persisted atomically (no partial state). Email digest marks sent after successful delivery.
- **API surface parity:** New endpoints follow existing auth and response patterns. No changes to existing endpoints.
- **Integration coverage:** E2E testing via n8n workflow execution. Individual service tests cover unit behavior.
- **Unchanged invariants:** Existing `/classify`, `/process`, `/digest/send` endpoints unchanged. News pipeline unaffected.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `apidojo/twitter-scraper-lite` actor rate limits or unavailability | Monitor actor health; have fallback to manual search if needed |
| Pre-filter keyword config incomplete | Get complete roles/terms list from client before production deploy |
| Sentiment scoring criteria mismatch with existing workflow | Validate sample outputs against current workflow results |
| Notion migration data loss | Run migration in dry-run mode first; verify counts before switching |
| Cross-repo deployment coordination | Use consistent branch name; deploy services before workflow |
| n8n workflow activated before service endpoints deployed | Deploy U1 (content-sourcing) and U2 (article-processor) to Railway and verify endpoints respond before activating U6 workflow |

---

## Documentation / Operational Notes

- Update `docs/ARCHITECTURE.md` with new `/mentions/analyze` and `/digest/mentions/send` endpoints
- Add ENV var documentation for pre-filter keywords and source exclusion blocklist
- Railway deployment: no new services, just new endpoints on existing services
- Monitoring: existing service health checks cover new endpoints

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-06-syntech-mentions-microservice-migration-requirements.md](docs/brainstorms/2026-05-06-syntech-mentions-microservice-migration-requirements.md)
- Related code: `syntech-content-sourcing/app/handlers/`, `syntech-article-processor/app/`, `syntech-email-digest/app/`
- Related docs: `docs/solutions/2026-n8n-to-microservice-cutover.md`, `docs/ARCHITECTURE.md`
- Apify actor: `apidojo/twitter-scraper-lite`
