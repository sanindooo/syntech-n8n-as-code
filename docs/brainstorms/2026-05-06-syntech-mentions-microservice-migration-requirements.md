---
date: 2026-05-06
topic: syntech-mentions-microservice-migration
---

# Syntech Mentions Monitor — Microservice Migration

## Problem Frame

The Syntech Mention Monitor workflow (`XO9Or6DUoTqXgAA5`) tracks mentions of Syntech Biofuel across social platforms and news sources, analyzes sentiment, and stores results in Notion. It currently:

- Calls 7 sub-workflows for sourcing (LinkedIn, RSS, Tavily, Instagram, Twitter/X, Google, Website)
- Uses an LLM pre-screener (gpt-4o-mini) to detect Syntech mentions
- Uses an LLM classifier (gpt-5.1) for sentiment analysis (0-5 scale)
- Stores results in Notion (Syntech Biofuel Mention Tracker)
- Sends Slack notifications

**Pain points:**
1. **Cost** — LLM pre-screener runs on every article even when "Syntech" is clearly present or absent
2. **Maintenance** — 7 sub-workflows to maintain, duplicating logic already in `syntech-content-sourcing`
3. **Notion dependency** — Migrating away from Notion; dashboard already has `mentions` table infrastructure
4. **No email digest** — Mentions don't flow to email like news articles do

The goal is to migrate to the same microservice architecture used for the news pipeline: content-sourcing for URL discovery, article-processor for persistence, email-digest for notifications.

## Requirements

### Sourcing (syntech-content-sourcing)

- **R1.** Replace 7 sub-workflows with calls to the existing `POST /search` endpoint on `syntech-content-sourcing`. Source types used by mentions:

  | Source Type | Handler | Status |
  |-------------|---------|--------|
  | RSS | Google Alerts RSS feeds | Already supported |
  | LinkedIn | Keyword search (`harvestapi/linkedin-post-search`) | Already supported |
  | X | Keyword search | **Needs new handler** |
  | Instagram | Keyword search | **Deferred** |

- **R2.** Add X keyword search handler using `apidojo/twitter-scraper-lite`. Create as a **separate handler** with `source_type: "X_Keyword"` to avoid modifying existing user timeline handler (`source_type: "X"`). This ensures zero regression risk for the News pipeline.

- **R3.** Do NOT use Tavily/SERP API for Google News. Google Alerts RSS feeds already provide keyword-optimized results at zero cost.

- **R4.** Instagram keyword search is **deferred**. Add in a follow-up phase if needed; requires researching available Apify actors.

### Pre-filter (regex + LLM fallback)

- **R5.** Replace the LLM pre-screener with a two-tier regex filter plus lightweight LLM fallback:

  | Tier | Rule | Action |
  |------|------|--------|
  | **1 (instant pass)** | Content contains "Syntech" (case-insensitive) | Pass to sentiment analysis |
  | **2 (context check)** | Content contains known surname (Bingham, Hart, Olone) or role+surname (CEO Bingham) AND a biofuel context word | Pass to sentiment analysis |
  | **3 (LLM fallback)** | Tier 2 matched but no "Syntech" found | Run gpt-4o-mini check: "Is this about Syntech Biofuel's [person]?" |

- **R6.** Pre-filter keyword configuration is stored externally (ENV vars or config table), not hardcoded:
  - **Company terms:** Syntech, Syntech Biofuel, Syntech Biofuel's, Syntech ASB, Kingsnorth Syntech, Grangemouth Syntech
  - **Surnames:** Bingham, Hart, Olone
  - **Roles:** CEO, Director, Managing Director, Founder (get full list from client)
  - **Biofuel context words:** biofuel, biodiesel, renewable fuel, HVO, SAF, refinery, waste oil, UCO, sustainable aviation fuel

- **R7.** Pre-filter runs in the n8n workflow (code node or set node with expressions) before calling the sentiment endpoint. Keeps the microservice stateless and focused on sentiment analysis.

### Source Exclusion (Ignore Syntech's Own Content)

- **R7a.** Exclude content authored by Syntech's own accounts. Maintain a configurable blocklist of source identifiers per platform:
  - **LinkedIn:** Company page URLs, employee profile URLs
  - **X:** Account handles (@syntechbiofuel, etc.)
  - **Instagram:** Account usernames
  - **RSS:** Specific feed URLs if Syntech publishes their own RSS

- **R7b.** Exclusion check runs **before** the pre-filter (no point analyzing your own content for mentions). Filter by URL pattern match or author/source field from the content-sourcing response.

- **R7c.** Blocklist is configurable (ENV or config table) so new accounts can be added without code changes.

### Sentiment Analysis (syntech-article-processor)

- **R8.** Add new endpoint `POST /mentions/analyze` to `syntech-article-processor`. Input:
  ```json
  {
    "url": "https://...",
    "title": "Article title",
    "content": "Full article text",
    "summary": "Optional summary",
    "source": "LinkedIn|RSS|X",
    "source_name": "Syntech Biofuel",
    "published_at": "2026-05-06T10:00:00Z"
  }
  ```

- **R9.** Endpoint performs:
  1. Sentiment analysis via gpt-4o-mini (0-5 scale with reason)
  2. Persists to `mentions` table (title, url, source, content, summary, published_at)
  3. Creates `mention_enrichments` record (sentiment_label, sentiment_score)
  4. Returns:
  ```json
  {
    "id": 123,
    "sentiment_score": 4,
    "sentiment_label": "Positive",
    "reason": "Article praises Syntech's new refinery expansion"
  }
  ```

- **R10.** Sentiment scoring criteria (matches existing workflow):
  - **0 — Very Negative:** Major criticism, scandals, failures
  - **1 — Negative:** Minor setbacks, negative comparisons
  - **2 — Slightly Negative:** Subtle criticism, tepid commentary
  - **3 — Neutral:** Factual mention, no opinion, or Syntech not actually mentioned
  - **4 — Positive:** General praise, recognition, successful projects
  - **5 — Very Positive:** Strong endorsement, major breakthrough, industry leadership

- **R11.** Existing `POST /process` endpoint remains unchanged. No regression risk.

### Sources Configuration

- **R12.** Sources stay in Notion (Syntech Biofuel Mentions Sources database) for this phase. The workflow reads from Notion and maps to content-sourcing requests.

- **R13.** Sources admin UI migration is **deferred** to a later phase where it can be done holistically with richer features (article counts, source health metrics).

### Email Digest (syntech-email-digest)

- **R14.** Add new endpoint `POST /digest/mentions/send` to `syntech-email-digest`. Request body:
  ```json
  {
    "sender_name": "Syntech Mentions",
    "dry_run": false
  }
  ```

- **R15.** `sender_name` parameter overrides the ENV default (`DIGEST_SENDER_NAME`). Allows different sender identity for mentions vs news digests.

- **R16.** Include **all mentions** regardless of sentiment score. Sentiment is displayed in the email but not used as a filter criterion.

- **R17.** Existing `POST /digest/send` endpoint remains unchanged. No regression risk.

### Data Migration

- **R18.** Before decommissioning Notion output, run the existing migration script to sync all Notion mentions to Postgres:
  ```bash
  cd syntech-intelligence-dashboard
  npx tsx src/scripts/migrate-mentions.ts
  ```
  Required ENV: `DATABASE_URL`, `NOTION_API_KEY`, `NOTION_MENTIONS_DATABASE_ID`, `OPENAI_API_KEY`

- **R19.** After migration, verify counts match between Notion and Postgres `mentions` table before disabling Notion writes.

### Workflow Simplification

- **R20.** The migrated n8n workflow structure:
  ```
  Schedule Trigger
    → Get Sources from Notion
    → Filter Active Sources
    → Loop: Call content-sourcing POST /search
    → Semantic Deduplication (existing Railway service)
    → Pre-filter (regex + LLM fallback in n8n)
    → Call article-processor POST /mentions/analyze
    → Slack notifications (unchanged)
  ```

- **R21.** Remove all 7 `executeWorkflow` calls to sub-workflows.

- **R22.** Remove all Notion write nodes (AddContentWithDate, AddContentToPost, etc.).

- **R23.** Keep existing semantic deduplication call unchanged (`syntech-semantic-article-deduplication`).

## Success Criteria

- 7 sub-workflows eliminated; sourcing flows through `syntech-content-sourcing`
- Pre-filter regex handles 90%+ of articles without LLM; gpt-4o-mini fallback for edge cases only
- Mentions persist to Postgres `mentions` table; dashboard displays them correctly
- Email digest sends separate mentions email with correct sender identity
- Existing News pipeline unaffected (zero regression)
- Notion writes disabled after successful migration verification

## Scope Boundaries

### In Scope
- X keyword search handler (`apidojo/twitter-scraper-lite`)
- `POST /mentions/analyze` endpoint on article-processor
- `POST /digest/mentions/send` endpoint on email-digest
- Pre-filter logic in n8n workflow
- Notion → Postgres migration for existing mentions

### Deferred
- Instagram keyword search (research Apify actors when needed)
- Sources admin UI (later holistic migration with richer features)
- Tavily/SERP API integration (Google Alerts RSS sufficient)

### Out of Scope
- Dashboard UI changes (mentions UI already exists)
- Biofuel relevance classifier changes (different concern)
- Changes to existing News pipeline routes or handlers

## Key Decisions

- **Regex over LLM for pre-filtering.** "Syntech" is distinctive enough that regex catches 90%+ of true positives instantly. LLM fallback handles the 10% edge cases (surname-only mentions). Dramatically cheaper than current all-LLM approach.

- **Separate source_type for keyword searches.** `X_Keyword` and (future) `Instagram_Keyword` route to new handlers without touching existing `X` and `Instagram` handlers. Zero regression risk.

- **Google Alerts RSS over SERP API.** Google Alerts are free, already keyword-optimized, and deliver via standard RSS. Adding SERP API/Tavily would be redundant cost for marginal coverage.

- **Sentiment endpoint on article-processor.** Single call does analysis + persistence. Simpler than coordinating between separate services. Mentions schema is simpler than articles (no pathway/scoring breakdown).

- **Defer Instagram.** Low volume, uncertain actor availability. Add later if needed rather than blocking the migration.

- **Sources stay in Notion for now.** Full sources migration requires richer admin UI features (article counts, health metrics). Incremental approach is safer.

## Dependencies / Assumptions

- `apidojo/twitter-scraper-lite` Apify actor supports keyword search with reasonable rate limits
- Client can provide complete roles list (CEO, Director, etc.) for pre-filter config
- `migrate-mentions.ts` script works with current Notion database structure
- article-processor has access to the same Postgres database as the dashboard

## Outstanding Questions

### Resolve Before Planning

- [Affects R6] Get complete roles list from client (CEO, Director, Managing Director, Founder, ...?)
- [Affects R7a] Get Syntech's own account blocklist per platform (LinkedIn company/profiles, X handles, Instagram usernames)

### Deferred to Planning

- [Affects all repos] Use consistent branch name across all repositories: `feat/mentions-microservice-migration` (or similar). Repositories touched: `syntech-content-sourcing`, `syntech-article-processor`, `syntech-email-digest`, `syntech-n8n-as-code`.
- [Affects R2] Verify `apidojo/twitter-scraper-lite` actor configuration — input schema, rate limits, cost per run
- [Affects R4] If Instagram keyword search is needed later, research available actors (hashtag scraper vs search scraper)
- [Affects R8] Authentication model for new endpoints — likely mirrors existing bearer token pattern
- [Affects R14] Email template design for mentions digest — structure, sentiment display format

## Next Steps

→ `/ce-plan` for structured implementation planning
