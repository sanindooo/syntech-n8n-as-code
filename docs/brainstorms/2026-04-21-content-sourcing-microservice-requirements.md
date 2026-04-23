---
date: 2026-04-21
topic: content-sourcing-microservice
---

# Content Sourcing Microservice

## Problem Frame

The News Sourcing Production (V2) workflow calls 8 sub-workflows to fetch content from various platforms (RSS, LinkedIn, Instagram, Twitter/X, Google, websites). Each sub-workflow:
- Calls external APIs (Apify actors, SERP API, RSS feeds)
- Extracts article content (Firecrawl, HTTP requests)
- Summarizes via LLM chains (OpenAI, Anthropic, DeepSeek)
- Tracks seen URLs in n8n data tables

**Pain points:**
1. **Maintainability** — 8 sub-workflows to keep in sync; changing extraction logic requires editing multiple places; testing is painful
2. **Reliability** — No unified retry logic; failures in one sub-workflow don't share patterns with others
3. **Speed** — Sub-workflows process sources one at a time; no batching despite Apify actors supporting array inputs
4. **Efficiency** — Apify RAM is per-run, not per-item; batching 10 profiles uses the same RAM as 1

The goal is a single Python microservice that replaces all 8 sub-workflows, owns URL deduplication, and produces the exact payload the biofuel-relevance-classifier expects.

## Requirements

### Core Pipeline

- **R1.** Single HTTP endpoint `POST /search` accepts source metadata and returns extracted articles. Input includes `source_type`, `url_or_keyword`, `source_name`, `source_category`, `prompt`, `additional_formats`, and optional `num_variants` (for Keyword sources). Output matches the biofuel-relevance-classifier input contract exactly:
  ```json
  {
    "title": "...",
    "content": "...",
    "url": "...",
    "summary": "...",
    "search_query": "...",
    "publication_date": "...",
    "prompt": "...",
    "additional_formats": "...",
    "source": "RSS|LinkedIn|Instagram|X|Website|Keyword",
    "source_category": "News|Expert|Customer|Competitor|...",
    "source_name": "...",
    "mode": null
  }
  ```

- **R2.** Internal routing by `source_type`:
  | source_type | Handler |
  |-------------|---------|
  | RSS | Native Python (feedparser + BeautifulSoup) |
  | LinkedIn | Apify actors (profile/company/keyword detection via URL pattern) |
  | Instagram | Apify actor |
  | X | Apify actors |
  | Website | Native Python (requests + BeautifulSoup + readability-lxml) |
  | Keyword | AI search API (Tavily, Perplexity, or SERP API) + BeautifulSoup extraction |

- **R2a.** AI search provider is configurable. Current Tavily usage can be swapped for Perplexity or other providers without code changes. Provider selection via config, not hardcoded.

### Configuration Hierarchy

- **R2d.** Two-tier configuration: ENV variable defaults, request parameter overrides.
  ```
  ENV default → request param override (if provided)
  ```
  This allows operational tuning without code changes, while still permitting per-source customization.

- **R2e.** Planning phase must audit current workflows and identify all tunable parameters. Known candidates:
  | Parameter | ENV Variable | Request Override | Current Default |
  |-----------|--------------|------------------|-----------------|
  | Keyword variants | `DEFAULT_NUM_VARIANTS` | `num_variants` | 5 |
  | RSS lookback count | `DEFAULT_RSS_LIMIT` | `rss_limit` | 5 |
  | LinkedIn posts per profile | `DEFAULT_LINKEDIN_POSTS` | `linkedin_posts` | 5 |
  | Instagram posts per profile | `DEFAULT_INSTAGRAM_POSTS` | `instagram_posts` | 5 |
  | Twitter results per query | `DEFAULT_TWITTER_RESULTS` | `twitter_results` | TBD |
  | Google News results | `DEFAULT_GOOGLE_RESULTS` | `google_results` | TBD |
  | Max article age (days) | `DEFAULT_MAX_AGE_DAYS` | `max_age_days` | 21 (3 weeks) |
  
  Planning will complete this list by auditing all `Limit` nodes and hardcoded values in sub-workflows.

- **R2f.** Request parameters are optional. If omitted, ENV defaults apply. This keeps the n8n integration simple initially — just call the endpoint — while allowing future Notion schema extensions to pass overrides.

### Keyword Expansion

- **R2b.** For `Keyword` source type, generate longtail keyword variants before searching. Input includes optional `prompt` (expansion instructions) and `num_variants` parameter.
  - Default `num_variants`: 5 (configurable via service config)
  - If `num_variants` provided in request, use that value
  - If `prompt` provided, use it to guide variant generation
  - Variants generated via small LLM (same fallback model as R5)

- **R2c.** Keyword expansion flow:
  ```
  base_keyword + prompt → LLM generates N variants → search each variant → dedupe + aggregate results
  ```
  Example: `"biofuel policy"` with `num_variants=3` might produce:
  - `"biofuel policy EU regulations 2026"`
  - `"renewable fuel standard updates"`
  - `"sustainable aviation fuel incentives"`

- **R3.** LinkedIn sub-routing based on `url_or_keyword` pattern:
  - Not a URL (no `https://`) → Keyword search → `harvestapi/linkedin-post-search`
  - Contains `/in/` → Profile → `harvestapi/linkedin-profile-posts`
  - Contains `/company/` → Company → `harvestapi/linkedin-company-posts`

### Extraction Stack

- **R4.** Primary extraction uses Python-native tools:
  - `feedparser` for RSS feeds
  - `requests` + `BeautifulSoup` for HTML fetching and parsing
  - `readability-lxml` (Mozilla Readability port) for article body extraction
  - Regex patterns for date extraction, nav/footer stripping
  - No Firecrawl dependency

- **R5.** Summarization uses heuristics first, tiny LLM fallback only:
  - Extract title from `<title>`, `og:title`, `<h1>`, or first heading
  - Extract date from `<meta>` tags, JSON-LD, or regex patterns
  - Generate summary via truncation + sentence boundary detection
  - LLM fallback (e.g., `gpt-4o-mini` or local model) only when heuristics fail or content is malformed

### Batching & Parallelism

- **R6.** Apify calls batch multiple items per run. RAM is per-run, not per-item:
  | Actor | RAM/Run | Batch Strategy |
  |-------|---------|----------------|
  | `harvestapi/linkedin-profile-posts` | 256MB | Batch profiles into `profileUrls` array |
  | `harvestapi/linkedin-company-posts` | 256MB | Batch companies into `targetUrls` array |
  | `harvestapi/linkedin-post-search` | 256MB | Batch keywords |
  | `apify/instagram-post-scraper` | 1GB | Batch usernames into `username` array |
  | `danek/twitter-scraper-ppr` | 128MB | Batch search terms |
  | `apidojo/twitter-scraper-lite` | 256MB | Batch queries |

- **R7.** Internal rate limiting respects Apify's 32GB RAM budget:
  ```python
  class ApifyBudget:
      total_ram_mb: int = 32_000
      active_ram_mb: int = 0
      
      async def acquire(self, actor: str, ram_mb: int) -> bool:
          # Block until RAM available, or return False if queue too deep
  ```

- **R8.** SERP API rate limiting (requests/minute) tracked separately from Apify RAM budget.

### URL Deduplication

- **R9.** Microservice owns URL deduplication in Neon (same database as biofuel-relevance-classifier). Table schema:
  ```sql
  CREATE TABLE content_sourcing.seen_urls (
      url_hash TEXT PRIMARY KEY,  -- SHA256 of normalized URL
      url TEXT NOT NULL,
      source_type TEXT NOT NULL,
      first_seen_at TIMESTAMPTZ DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- **R10.** Before fetching, check `seen_urls`. Skip URLs already processed. After successful extraction, insert/update the URL record.

- **R11.** One-time migration script exports existing URLs from n8n data tables into `content_sourcing.seen_urls`:
  | Data Table | Size | Priority |
  |------------|------|----------|
  | NEWS+ Google News | 3.69MB | High (largest) |
  | NEWS+ RSS w URL | 0.39MB | High |
  | NEWS+ Tavily | 0.3MB | Medium |
  | NEWS+ LinkedIn | 0.16MB | High |
  | NEWS+ Twitter | 0.03MB | High |
  | NEWS+ Instagram | 0.02MB | High |
  
  Skip `NEWS+ RSS no URL` (barely used, 0.01MB). Supabase backup tables are deprecated and excluded.

### Sync Model

- **R12.** Endpoint is synchronous (blocking). Request waits until extraction completes or times out.

- **R13.** Internal queuing for rate-limited resources. If queue depth exceeds threshold, return HTTP 429 with `Retry-After` header. n8n's built-in retry handles this.

- **R14.** Per-request timeout of 120 seconds. Long-running Apify jobs that exceed this return partial results or error.

### Observability

- **R15.** Structured logging (structlog + JSON) for every request:
  - `source_type`, `source_name`, `url_or_keyword`
  - `handler_used` (apify actor name, native, serp)
  - `extraction_method` (readability, heuristic, llm_fallback)
  - `articles_returned`, `articles_skipped_dedup`
  - `latency_ms`, `apify_ram_used_mb`

- **R16.** Health endpoints:
  - `GET /healthz` — liveness (always 200 if process up)
  - `GET /readyz` — readiness (200 only after DB pool open, Apify client initialized)

- **R17.** Metrics endpoint or log-based metrics for:
  - Apify RAM utilization over time
  - SERP API usage vs quota
  - Extraction method distribution (native vs LLM fallback)
  - Dedup hit rate

### Deployment

- **R18.** Deployed on Railway, same pattern as biofuel-relevance-classifier:
  - IPv6 binding (`--host ::`)
  - `/readyz` healthcheck with 180s timeout for cold start
  - Neon pooler endpoint for runtime, direct endpoint for migrations
  - Separate bearer tokens for `/search` (held by n8n) and `/admin/*` (ops only)

- **R19.** Separate GitHub repository: **https://github.com/sanindooo/syntech-content-sourcing** (private). Not embedded in n8n-as-code repo.

### n8n Integration

- **R20.** Main workflow replaces 8 `executeWorkflow` calls + `MatchSources` switch with:
  1. Single `Set` node to prepare request body
  2. Single `HTTP Request` node calling `POST /search`
  3. Response feeds directly into existing downstream flow (relevance classifier, Notion storage)

- **R21.** Source metadata from Notion passes through unchanged. Microservice uses `source_type` (mapped from `property_source`) for routing.

## Success Criteria

- 8 sub-workflows eliminated; main workflow calls one HTTP endpoint
- URL deduplication prevents redundant scraping; dedup hit rate visible in logs
- Apify batching reduces RAM consumption by 5-10x for multi-source runs
- Extraction works without Firecrawl; LLM fallback rate < 10% of articles
- p95 latency under 30s for native sources (RSS, Website), under 60s for Apify sources
- No breaking changes to downstream biofuel-relevance-classifier contract

## Scope Boundaries

- **Not** replacing the biofuel-relevance-classifier (downstream, separate service)
- **Not** replacing the semantic-article-deduplication service (downstream, different concern)
- **Not** building a UI for managing sources (stays in Notion)
- **Not** changing the Notion source database schema
- **Not** replacing Apify with native platform APIs (Apify at $40-50/month is cost-effective)
- **Not** implementing webhook/async callback model (sync blocking is simpler and sufficient)

## Key Decisions

- **Unified endpoint over separate endpoints.** Rate limiting and resource budgeting are simpler when all traffic flows through one place. Internal routing is just Python code.
- **Sync over async/webhook.** Per-source requests take 10-60 seconds, well within HTTP timeout norms. Webhook adds complexity (job persistence, callback delivery) without proportional benefit.
- **Keep Apify, optimize usage.** Native APIs for Twitter/Instagram/LinkedIn are rate-limited, enterprise-gated, or complex. Apify abstracts this for $40-50/month. The win is batching and parallelism, not replacement.
- **Own deduplication in Neon.** Microservice is self-contained; no runtime dependency on n8n data tables. One-time migration moves existing URLs.
- **BeautifulSoup + readability over Firecrawl.** Native Python extraction is free, fast, and sufficient for 90%+ of articles. Firecrawl was solving a problem we can solve ourselves.
- **Heuristic summarization over LLM chains.** Title/date/summary extraction from well-structured HTML doesn't need an LLM. Reserve LLM for malformed edge cases.

## Dependencies / Assumptions

- Apify API key available (existing `Syntech GM Apify account`)
- SERP API key available (existing usage in Google search workflow)
- Neon database available (same project as biofuel-relevance-classifier)
- n8n can call external HTTPS endpoints with bearer auth (proven pattern)
- Existing n8n data tables can be exported (manual or via n8n API)

## Outstanding Questions

### Resolve Before Planning

- *(none — scope is clear)*

### Deferred to Planning

- [Affects R2a][Needs research] AI search provider evaluation — Tavily vs Perplexity vs SERP API. Compare: result quality for biofuel/energy topics, pricing, rate limits, API ergonomics. Current Tavily usage is baseline.
- [Affects R2b][Technical] Keyword expansion prompt design — extract and adapt existing `CreateLongtailKeyword` prompts from n8n workflows. Ensure variants are diverse but topically relevant.
- [Affects R2e][Technical] **Configuration audit** — scan all 8 sub-workflows for `Limit` nodes, `maxItems`, `resultsLimit`, `postedLimit`, age filters, and other hardcoded values. Produce complete ENV variable list with sensible defaults.
- [Affects R5][Needs research] Specific readability library choice — `readability-lxml` vs `newspaper3k` vs `trafilatura`. Benchmark extraction quality on sample articles during planning.
- [Affects R5][Technical] LLM fallback model choice — local (e.g., `llama.cpp` with small model) vs API (`gpt-4o-mini`). Depends on cold-start budget and cost tolerance.
- [Affects R6][Technical] Optimal batch size per Apify actor — balance between RAM efficiency and per-run latency. Empirical testing during planning.
- [Affects R9][Technical] URL normalization strategy — strip query params? Lowercase? Handle redirects? Define during planning to ensure consistent hashing.
- [Affects R11][Technical] n8n data table export mechanism — manual CSV export from n8n UI, or n8n API if available. Total ~4.6MB across 6 tables.
- [Affects R17][Technical] Metrics stack — Railway logs + parsing, or structured metrics endpoint. Align with existing observability for biofuel-relevance-classifier.

## Next Steps

→ `/ce:plan` for structured implementation planning
