---
title: "feat: Content Sourcing Microservice"
type: feat
status: active
date: 2026-04-21
origin: docs/brainstorms/2026-04-21-content-sourcing-microservice-requirements.md
---

# Content Sourcing Microservice

## Overview

Build a Python microservice that replaces 8 n8n sub-workflows for content sourcing. The service fetches articles from RSS feeds, LinkedIn, Instagram, Twitter/X, Google News, and websites, extracts content using Python-native tools, and returns normalized articles matching the biofuel-relevance-classifier input contract.

**Repository:** https://github.com/sanindooo/syntech-content-sourcing (private, already created)

## Problem Statement / Motivation

The current architecture has 8 separate n8n sub-workflows that:
- Are hard to maintain (changes must be replicated across workflows)
- Process sources one at a time (no batching despite Apify support)
- Waste Apify RAM budget (per-run cost, not per-item)
- Use expensive LLM chains for every article (Firecrawl + OpenAI/Anthropic)
- Duplicate URL tracking logic in each workflow

A unified microservice provides single-point maintenance, efficient batching (5-10x RAM savings), and Python-native extraction (eliminating Firecrawl costs).

## Proposed Solution

Single FastAPI service with:
- `POST /search` endpoint accepting source metadata, returning extracted articles
- Internal routing by `source_type` (RSS, LinkedIn, Instagram, X, Website, Keyword)
- Python-native extraction (feedparser, BeautifulSoup, readability-lxml)
- Apify integration with batching for social media sources
- URL deduplication in Neon (shared with biofuel-relevance-classifier)
- Two-tier configuration (ENV defaults + request overrides)

## Technical Approach

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Workflow                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────────┐   │
│  │ Notion   │───▶│ HTTP Request │───▶│ Relevance Classifier│   │
│  │ Sources  │    │ POST /search │    │ (downstream)        │   │
│  └──────────┘    └──────────────┘    └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Content Sourcing Microservice (Railway)             │
│                                                                  │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────────┐   │
│  │ Router   │───▶│ Handlers     │───▶│ Response Builder    │   │
│  │          │    │ ├─ RSS       │    │                     │   │
│  │          │    │ ├─ LinkedIn  │    │                     │   │
│  │          │    │ ├─ Instagram │    │                     │   │
│  │          │    │ ├─ Twitter   │    │                     │   │
│  │          │    │ ├─ Website   │    │                     │   │
│  │          │    │ └─ Keyword   │    │                     │   │
│  └──────────┘    └──────────────┘    └─────────────────────┘   │
│        │                │                      │                │
│        ▼                ▼                      ▼                │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────────┐   │
│  │ Config   │    │ Apify Client │    │ Neon (seen_urls)    │   │
│  │ (ENV)    │    │ (batching)   │    │                     │   │
│  └──────────┘    └──────────────┘    └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Foundation (Days 1-2)

**Objective:** Scaffold project, deploy skeleton to Railway, verify end-to-end connectivity.

**Tasks:**
- [ ] Initialize repo structure mirroring biofuel-relevance-classifier
  - `app/main.py` — FastAPI app with lifespan
  - `app/api/routes.py` — endpoint definitions
  - `app/config.py` — Pydantic settings with ENV loading
  - `app/auth.py` — bearer token validation (split classifier/admin)
  - `app/db.py` — Neon async pool
- [ ] Create `Dockerfile` (multi-stage, non-root user)
- [ ] Create `railway.toml` (Dockerfile builder, `/readyz` healthcheck, 180s timeout)
- [ ] Create `pyproject.toml` with dependencies:
  - `fastapi`, `uvicorn[standard]`, `pydantic-settings`
  - `httpx`, `beautifulsoup4`, `readability-lxml`, `feedparser`
  - `apify-client`, `psycopg[binary,pool]`, `structlog`
- [ ] Implement `/healthz` and `/readyz` endpoints
- [ ] Implement `POST /search` stub (returns 501 Not Implemented)
- [ ] Deploy to Railway, verify healthcheck passes
- [ ] Configure Railway env vars (DATABASE_URL, bearer tokens)

**Files created:**
```
syntech-content-sourcing/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── auth.py
│   ├── db.py
│   └── api/
│       ├── __init__.py
│       └── routes.py
├── Dockerfile
├── railway.toml
├── pyproject.toml
├── .env.example
└── README.md
```

**Success criteria:**
- Railway deployment succeeds
- `/healthz` returns 200
- `/readyz` returns 200 (DB connected)
- `POST /search` returns 501 with valid bearer token, 401 without

---

#### Phase 2: Configuration & Routing (Days 3-4)

**Objective:** Implement configuration hierarchy and source routing.

**Tasks:**
- [ ] Define `SearchRequest` Pydantic model:
  ```python
  class SearchRequest(BaseModel):
      source_type: Literal["RSS", "LinkedIn", "Instagram", "X", "Website", "Keyword"]
      url_or_keyword: str
      source_name: str
      source_category: str
      prompt: str | None = None
      additional_formats: str | None = None
      # Optional overrides (ENV defaults if omitted)
      num_variants: int | None = None
      rss_limit: int | None = None
      linkedin_posts: int | None = None
      linkedin_window: str | None = None
      instagram_posts: int | None = None
      instagram_window: str | None = None
      twitter_results: int | None = None
      google_results: int | None = None
      max_age_days: int | None = None
  ```
- [ ] Define `ArticleResponse` Pydantic model (matches biofuel-relevance-classifier input)
- [ ] Implement `app/config.py` with all ENV variables:
  ```python
  class Settings(BaseSettings):
      # Defaults (from workflow audit)
      DEFAULT_NUM_VARIANTS: int = 5
      DEFAULT_RSS_LIMIT: int = 20
      DEFAULT_LINKEDIN_POSTS: int = 5
      DEFAULT_LINKEDIN_WINDOW: str = "month"
      DEFAULT_INSTAGRAM_POSTS: int = 5
      DEFAULT_INSTAGRAM_WINDOW: str = "1 month"
      DEFAULT_TWITTER_RESULTS: int = 5
      DEFAULT_GOOGLE_RESULTS: int = 100
      DEFAULT_MAX_AGE_DAYS: int = 21
      
      # External services
      APIFY_API_TOKEN: str
      SERP_API_KEY: str | None = None
      TAVILY_API_KEY: str | None = None
      AI_SEARCH_PROVIDER: str = "tavily"  # tavily | perplexity | serp
      
      # LLM fallback
      OPENAI_API_KEY: str | None = None
      LLM_FALLBACK_MODEL: str = "gpt-4o-mini"
      
      # Database
      DATABASE_URL: str
      DATABASE_URL_DIRECT: str | None = None
      
      # Auth
      CONTENT_SOURCING_TOKEN: str  # comma-split for rotation
      ADMIN_TOKEN: str
      
      # Apify budget
      APIFY_RAM_BUDGET_MB: int = 32000
  ```
- [ ] Implement router in `app/api/routes.py`:
  ```python
  @router.post("/search")
  async def search(request: SearchRequest, ...) -> list[ArticleResponse]:
      handler = get_handler(request.source_type)
      return await handler.fetch(request, config)
  ```
- [ ] Create handler interface `app/handlers/base.py`:
  ```python
  class BaseHandler(ABC):
      @abstractmethod
      async def fetch(self, request: SearchRequest, config: Settings) -> list[ArticleResponse]:
          pass
  ```
- [ ] Implement handler registry with source_type → handler mapping

**Files created:**
```
app/
├── models.py          # SearchRequest, ArticleResponse
├── handlers/
│   ├── __init__.py    # registry
│   └── base.py        # BaseHandler ABC
```

**Success criteria:**
- `POST /search` validates request against schema
- Unknown `source_type` returns 422
- Config loads from ENV with defaults
- Request overrides take precedence over ENV defaults

---

#### Phase 3: URL Deduplication (Days 5-6)

**Objective:** Implement URL tracking in Neon.

**Tasks:**
- [ ] Create Alembic migration for `content_sourcing` schema:
  ```sql
  CREATE SCHEMA IF NOT EXISTS content_sourcing;
  
  CREATE TABLE content_sourcing.seen_urls (
      url_hash TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      source_type TEXT NOT NULL,
      first_seen_at TIMESTAMPTZ DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  CREATE INDEX idx_seen_urls_source_type ON content_sourcing.seen_urls(source_type);
  CREATE INDEX idx_seen_urls_last_seen ON content_sourcing.seen_urls(last_seen_at);
  ```
- [ ] Implement URL normalization in `app/dedup.py`:
  ```python
  def normalize_url(url: str) -> str:
      """Normalize URL for consistent hashing.
      - Lowercase scheme and host
      - Remove trailing slash
      - Sort query params
      - Remove tracking params (utm_*, fbclid, etc.)
      - Handle LinkedIn/Instagram/Twitter URL variants
      """
  
  def hash_url(url: str) -> str:
      return hashlib.sha256(normalize_url(url).encode()).hexdigest()
  ```
- [ ] Implement dedup check and insert:
  ```python
  async def check_seen(urls: list[str]) -> dict[str, bool]:
      """Returns {url: is_seen} mapping."""
  
  async def mark_seen(urls: list[str], source_type: str) -> None:
      """Insert/update seen_urls records."""
  ```
- [ ] Create migration script for n8n data table import:
  ```python
  # scripts/import_seen_urls.py
  # Reads CSV exports from n8n data tables
  # Normalizes and inserts into content_sourcing.seen_urls
  ```

**Files created:**
```
app/
└── dedup.py
migrations/
├── env.py
└── versions/
    └── 001_create_seen_urls.py
scripts/
└── import_seen_urls.py
```

**Success criteria:**
- Migration runs without error
- `check_seen` returns correct results
- `mark_seen` upserts correctly (updates `last_seen_at`)
- Import script successfully loads test CSV

---

#### Phase 4: Native Handlers — RSS & Website (Days 7-9)

**Objective:** Implement Python-native content fetching and extraction.

**Tasks:**
- [ ] Implement RSS handler `app/handlers/rss.py`:
  ```python
  class RSSHandler(BaseHandler):
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # 1. Parse RSS feed with feedparser
          # 2. Filter by max_age_days
          # 3. Limit to rss_limit items
          # 4. Check dedup, skip seen URLs
          # 5. For each new URL: extract content
          # 6. Mark URLs as seen
          # 7. Return articles
  ```
- [ ] Implement Website handler `app/handlers/website.py`:
  ```python
  class WebsiteHandler(BaseHandler):
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # 1. Fetch URL with httpx
          # 2. Check dedup
          # 3. Extract with readability-lxml
          # 4. Extract metadata (title, date, author)
          # 5. Generate summary (heuristic first, LLM fallback)
          # 6. Mark URL as seen
          # 7. Return article
  ```
- [ ] Implement content extraction utilities `app/extraction.py`:
  ```python
  def extract_article(html: str, url: str) -> ExtractedContent:
      """Use readability-lxml to extract main content."""
  
  def extract_title(html: str, doc: Document) -> str | None:
      """Try: og:title, <title>, <h1>, first heading."""
  
  def extract_date(html: str, url: str) -> datetime | None:
      """Try: meta tags, JSON-LD, URL patterns, regex."""
  
  def generate_summary(content: str, max_chars: int = 300) -> str:
      """Truncate at sentence boundary."""
  ```
- [ ] Implement content validation `app/validation.py`:
  ```python
  def validate_content(content: str, url: str) -> bool:
      """Return False if:
      - content is empty or < 100 chars
      - content starts with 'https://'
      - URL contains 'syntechbiofuel' (self-referential)
      """
  ```
- [ ] Implement LLM fallback `app/llm_fallback.py`:
  ```python
  async def summarize_with_llm(content: str, config: Settings) -> str:
      """Called when heuristic extraction fails.
      Trigger conditions:
      - Title extraction failed
      - Content < 100 chars after extraction
      - Date extraction failed AND content seems dated
      """
  ```

**Files created:**
```
app/
├── extraction.py
├── validation.py
├── llm_fallback.py
└── handlers/
    ├── rss.py
    └── website.py
```

**Success criteria:**
- RSS handler fetches and parses real feeds
- Website handler extracts content from real URLs
- Readability extracts clean article body
- Date extraction works on major news sites
- LLM fallback triggers < 10% of the time
- Dedup prevents re-fetching seen URLs

---

#### Phase 5: Apify Handlers — LinkedIn, Instagram, Twitter (Days 10-14)

**Objective:** Implement Apify-backed social media handlers with batching.

**Tasks:**
- [ ] Implement Apify client wrapper `app/apify_client.py`:
  ```python
  class ApifyClient:
      def __init__(self, token: str, ram_budget_mb: int):
          self.client = ApifyClientAsync(token)
          self.budget = ApifyBudget(ram_budget_mb)
      
      async def run_actor(
          self,
          actor_id: str,
          input_data: dict,
          ram_mb: int,
          timeout_secs: int = 120
      ) -> list[dict]:
          await self.budget.acquire(ram_mb)
          try:
              run = await self.client.actor(actor_id).call(
                  run_input=input_data,
                  timeout_secs=timeout_secs
              )
              return await self.client.dataset(run["defaultDatasetId"]).list_items()
          finally:
              self.budget.release(ram_mb)
  ```
- [ ] Implement LinkedIn handler `app/handlers/linkedin.py`:
  ```python
  class LinkedInHandler(BaseHandler):
      ACTORS = {
          "profile": "harvestapi/linkedin-profile-posts",
          "company": "harvestapi/linkedin-company-posts",
          "keyword": "harvestapi/linkedin-post-search",
      }
      RAM_MB = 256
      
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # 1. Detect sub-type from url_or_keyword pattern
          # 2. Build Apify input (batch if multiple in request)
          # 3. Run actor with timeout
          # 4. Normalize response to ArticleResponse
          # 5. Check dedup, filter seen
          # 6. Extract/summarize content
          # 7. Mark seen, return articles
      
      def detect_subtype(self, url_or_keyword: str) -> str:
          if "https://" not in url_or_keyword:
              return "keyword"
          if "/in/" in url_or_keyword:
              return "profile"
          if "/company/" in url_or_keyword:
              return "company"
          return "keyword"  # fallback
  ```
- [ ] Implement Instagram handler `app/handlers/instagram.py`:
  ```python
  class InstagramHandler(BaseHandler):
      ACTOR = "apify/instagram-post-scraper"
      RAM_MB = 1024  # 1GB - the bottleneck
      
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # Similar pattern to LinkedIn
          # Input uses 'username' array for batching
  ```
- [ ] Implement Twitter handler `app/handlers/twitter.py`:
  ```python
  class TwitterHandler(BaseHandler):
      ACTORS = {
          "ppr": "danek/twitter-scraper-ppr",      # 128MB
          "lite": "apidojo/twitter-scraper-lite",  # 256MB
      }
      
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # Use PPR for most cases (cheaper RAM)
          # Fall back to lite if PPR fails
  ```
- [ ] Implement Apify response normalizers `app/normalizers/`:
  ```python
  # Each platform has different response schemas
  # Normalizers convert to common ArticleResponse
  ```

**Files created:**
```
app/
├── apify_client.py
├── handlers/
│   ├── linkedin.py
│   ├── instagram.py
│   └── twitter.py
└── normalizers/
    ├── __init__.py
    ├── linkedin.py
    ├── instagram.py
    └── twitter.py
```

**Success criteria:**
- LinkedIn handler detects profile/company/keyword correctly
- Apify batching works (multiple profiles in one run)
- RAM budget prevents over-allocation
- Apify timeouts handled gracefully (partial results returned)
- Response normalization produces valid ArticleResponse

---

#### Phase 6: Keyword Handler — AI Search + Expansion (Days 15-17)

**Objective:** Implement keyword expansion and AI search.

**Tasks:**
- [ ] Implement keyword expander `app/keyword_expander.py`:
  ```python
  async def expand_keywords(
      base_keyword: str,
      prompt: str | None,
      num_variants: int,
      config: Settings
  ) -> list[str]:
      """Generate longtail keyword variants using LLM.
      Returns [base_keyword] + [variants].
      """
  ```
- [ ] Extract existing expansion prompts from n8n workflows:
  - `CreateLongtailKeyword` prompt from Search Google Syntech workflow
  - Adapt for API use
- [ ] Implement AI search provider interface `app/ai_search/`:
  ```python
  class AISearchProvider(ABC):
      @abstractmethod
      async def search(self, query: str, max_results: int) -> list[SearchResult]:
          pass
  
  class TavilyProvider(AISearchProvider): ...
  class PerplexityProvider(AISearchProvider): ...
  class SerpProvider(AISearchProvider): ...
  ```
- [ ] Implement Keyword handler `app/handlers/keyword.py`:
  ```python
  class KeywordHandler(BaseHandler):
      async def fetch(self, request, config) -> list[ArticleResponse]:
          # 1. Expand keywords (base + N variants)
          # 2. Search each variant via AI search provider
          # 3. Collect unique URLs from results
          # 4. Check dedup, filter seen
          # 5. Fetch and extract content from each URL
          # 6. Mark seen, return articles
  ```

**Files created:**
```
app/
├── keyword_expander.py
├── ai_search/
│   ├── __init__.py
│   ├── base.py
│   ├── tavily.py
│   ├── perplexity.py
│   └── serp.py
└── handlers/
    └── keyword.py
```

**Success criteria:**
- Keyword expansion produces diverse, relevant variants
- AI search returns URLs with snippets
- Provider is swappable via config
- Dedup prevents redundant fetches across variants

---

#### Phase 7: Error Handling & Observability (Days 18-19)

**Objective:** Robust error handling, logging, and metrics.

**Tasks:**
- [ ] Implement structured logging `app/logging.py`:
  ```python
  # Configure structlog with JSON renderer
  # Request context: source_type, source_name, request_id
  # Outcome context: articles_returned, articles_skipped_dedup, latency_ms
  ```
- [ ] Implement request ID threading:
  ```python
  # Accept X-Request-Id header (from n8n $execution.id)
  # Include in all log entries
  # Return in response headers
  ```
- [ ] Implement partial failure handling:
  ```python
  # Apify returns partial results → return what succeeded, log failures
  # Extraction fails for some URLs → return others, log failures
  # HTTP 200 with partial results (not 207)
  ```
- [ ] Implement rate limit handling:
  ```python
  # Queue depth tracking
  # Return 429 with Retry-After when queue full
  # Graceful degradation under load
  ```
- [ ] Add metrics logging:
  ```python
  # Per-request: handler_used, extraction_method, apify_ram_used_mb
  # Aggregatable: dedup_hit_rate, llm_fallback_rate
  ```

**Files created:**
```
app/
├── logging.py
├── middleware.py  # request ID, timing
└── metrics.py
```

**Success criteria:**
- All requests have structured JSON logs
- Request IDs thread through from n8n
- Partial failures don't crash the request
- 429 returned when resources exhausted
- Metrics visible in Railway logs

---

#### Phase 8: n8n Integration & Migration (Days 20-22)

**Objective:** Update n8n workflow and migrate URL data.

**Tasks:**
- [ ] Export n8n data tables to CSV:
  - NEWS+ Google News (3.69MB)
  - NEWS+ RSS w URL (0.39MB)
  - NEWS+ Tavily (0.3MB)
  - NEWS+ LinkedIn (0.16MB)
  - NEWS+ Twitter (0.03MB)
  - NEWS+ Instagram (0.02MB)
- [ ] Run import script to populate `content_sourcing.seen_urls`
- [ ] Create n8n workflow update:
  ```typescript
  // Replace MatchSources switch + 8 executeWorkflow nodes with:
  // 1. Set node: prepare request body from source metadata
  // 2. HTTP Request node: POST to /search
  // 3. Response feeds to existing downstream flow
  ```
- [ ] Test in n8n with shadow mode (call new service, compare to old)
- [ ] Cutover: activate new workflow, deactivate sub-workflows

**Files affected in n8n-as-code:**
```
workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/
└── News Sourcing Production (V2).workflow.ts
```

**Success criteria:**
- URL import completes without errors
- n8n workflow calls new service successfully
- Response shape matches downstream expectations
- Dedup prevents re-processing of migrated URLs
- Sub-workflows can be deactivated

---

#### Phase 9: Testing & Documentation (Days 23-25)

**Objective:** Comprehensive tests and operational documentation.

**Tasks:**
- [ ] Unit tests for extraction utilities
- [ ] Unit tests for URL normalization
- [ ] Integration tests for each handler (mocked Apify)
- [ ] End-to-end test with real APIs (limited)
- [ ] Write README.md with:
  - Architecture overview
  - Configuration reference (all ENV vars)
  - API documentation
  - Deployment guide
  - Troubleshooting
- [ ] Write runbook for:
  - Monitoring (what logs to watch)
  - Scaling (when to add replicas)
  - Incident response (common failures)

**Files created:**
```
tests/
├── test_extraction.py
├── test_dedup.py
├── test_handlers/
│   ├── test_rss.py
│   ├── test_linkedin.py
│   └── ...
└── conftest.py
README.md
docs/
└── runbook.md
```

**Success criteria:**
- Test coverage > 80%
- All handlers have integration tests
- README sufficient for new developer onboarding
- Runbook covers common operational scenarios

---

## Alternative Approaches Considered

1. **Separate endpoints per source type** — Rejected because rate limiting is simpler centralized, and the output contract is identical. (see origin: docs/brainstorms/2026-04-21-content-sourcing-microservice-requirements.md)

2. **Async webhook model** — Rejected because per-source requests complete in 10-60 seconds, well within HTTP timeout norms. Webhook adds job persistence complexity without proportional benefit. (see origin)

3. **Replace Apify with native APIs** — Rejected because Twitter/Instagram/LinkedIn APIs are rate-limited, enterprise-gated, or complex. Apify at $40-50/month is cost-effective. (see origin)

4. **Keep Firecrawl for extraction** — Rejected because BeautifulSoup + readability-lxml is free, fast, and sufficient for 90%+ of articles. (see origin)

## System-Wide Impact

### Interaction Graph

```
n8n Schedule Trigger
  → Notion: Get All Sources
    → HTTP Request: POST /search (NEW)
      → Content Sourcing Service
        → Apify (LinkedIn/Instagram/Twitter)
        → AI Search (Tavily/Perplexity)
        → Neon (seen_urls check/insert)
      ← ArticleResponse[]
    → HTTP Request: POST /classify (existing)
      → Biofuel Relevance Classifier
    → Notion: Add Content
```

### Error & Failure Propagation

- **Apify timeout** → Partial results returned, logged as warning
- **Extraction failure** → Article skipped, logged with URL
- **LLM fallback failure** → Article returned without summary
- **Rate limit hit** → HTTP 429, n8n retries with backoff
- **DB connection failure** → `/readyz` returns 503, Railway restarts

### State Lifecycle Risks

- **Partial dedup insert** — If crash after fetch but before `mark_seen`, URL may be re-fetched next run. Acceptable (idempotent).
- **Apify run orphaned** — If service crashes mid-Apify-run, the run completes but results are lost. RAM budget eventually releases (timeout).

### API Surface Parity

- **Biofuel-relevance-classifier** — No changes, receives same input shape
- **n8n workflow** — Simplified from 8 sub-workflow calls to 1 HTTP call
- **Notion** — No changes to source database schema

### Integration Test Scenarios

1. **RSS feed with mix of new and seen URLs** — Verify dedup filters correctly
2. **LinkedIn batch with one failing profile** — Verify partial results returned
3. **Keyword expansion with duplicate URLs across variants** — Verify dedup within request
4. **Apify RAM budget exhaustion** — Verify 429 returned, queue drains
5. **Extraction failure triggering LLM fallback** — Verify fallback produces summary

## Acceptance Criteria

### Functional Requirements

- [ ] `POST /search` accepts all source types and returns valid ArticleResponse
- [ ] RSS handler parses feeds and extracts content
- [ ] LinkedIn handler detects profile/company/keyword and routes correctly
- [ ] Instagram handler batches usernames into single Apify run
- [ ] Twitter handler uses appropriate actor based on query
- [ ] Website handler extracts clean content with readability
- [ ] Keyword handler expands queries and aggregates results
- [ ] URL deduplication prevents re-fetching seen URLs
- [ ] Configuration hierarchy (ENV → request override) works correctly

### Non-Functional Requirements

- [ ] p95 latency < 30s for native sources (RSS, Website)
- [ ] p95 latency < 60s for Apify sources
- [ ] LLM fallback rate < 10% of articles
- [ ] Apify RAM usage reduced 5-10x vs current (batching)
- [ ] Zero breaking changes to downstream classifier contract

### Quality Gates

- [ ] Test coverage > 80%
- [ ] All handlers have integration tests
- [ ] Structured logging for all requests
- [ ] README and runbook complete
- [ ] Successful shadow-mode comparison with existing workflows

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sub-workflows eliminated | 8 → 0 | n8n workflow structure |
| Apify RAM efficiency | 5-10x improvement | Logs: `apify_ram_used_mb` |
| LLM fallback rate | < 10% | Logs: `extraction_method` |
| Dedup hit rate | > 50% | Logs: `articles_skipped_dedup` |
| p95 latency (native) | < 30s | Logs: `latency_ms` |
| p95 latency (Apify) | < 60s | Logs: `latency_ms` |

## Dependencies & Prerequisites

- [x] GitHub repo created (https://github.com/sanindooo/syntech-content-sourcing)
- [ ] Railway project created
- [ ] Neon database access (same project as biofuel-relevance-classifier)
- [ ] Apify API token (existing: Syntech GM Apify account)
- [ ] Tavily API key (existing)
- [ ] OpenAI API key for LLM fallback

## Risk Analysis & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Apify actor schema changes | Medium | Low | Schema validation, version pinning, monitoring |
| Extraction quality lower than Firecrawl | Medium | Medium | Benchmark on sample articles, keep Firecrawl as fallback option |
| Cold start exceeds 180s | Low | Low | Lazy model loading, adjust healthcheck timeout |
| n8n workflow migration breaks downstream | High | Low | Shadow mode testing, gradual rollout |

## Resource Requirements

- **Development:** ~25 days (single developer)
- **Infrastructure:** Railway service ($5-20/month), Neon database (shared)
- **External APIs:** Apify (~$40-50/month), Tavily (existing), OpenAI (minimal for fallback)

## Future Considerations

- **Batch endpoint** — Accept multiple sources in one request for efficiency
- **Webhook mode** — Optional async for very long-running requests
- **Custom extractors** — Per-domain extraction rules for tricky sites
- **Feedback loop** — Track which articles get surfaced, improve extraction

## Documentation Plan

- [ ] README.md in repo
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Runbook in `docs/runbook.md`
- [ ] Solution doc in n8n-as-code repo after completion

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-04-21-content-sourcing-microservice-requirements.md](../brainstorms/2026-04-21-content-sourcing-microservice-requirements.md)
- Key decisions carried forward: unified endpoint, sync model, keep Apify, own deduplication, BeautifulSoup over Firecrawl

### Internal References

- biofuel-relevance-classifier patterns: `/Users/sanindo/syntech-biofuel-relevance-classifier/app/`
- Railway deployment learnings: `docs/solutions/2026-railway-python-service.md`
- n8n cutover learnings: `docs/solutions/2026-n8n-to-microservice-cutover.md`
- Existing n8n workflows: `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/`

### External References

- Apify Python SDK: https://docs.apify.com/sdk/python
- readability-lxml: https://github.com/buriy/python-readability
- feedparser: https://feedparser.readthedocs.io/
- Tavily API: https://docs.tavily.com/

### Related Work

- Biofuel relevance classifier: `/Users/sanindo/syntech-biofuel-relevance-classifier`
- Semantic article deduplication: `/Users/sanindo/syntech-semantic-article-deduplication`
