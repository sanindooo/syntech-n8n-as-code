---
date: 2026-04-22
topic: anti-bot-fallback
---

# Anti-Bot Fallback for `syntech-content-sourcing/fetch_html`

## Problem Frame

When `app/extraction.py::fetch_html` runs from Railway, Cloudflare / Akamai / DataDome-protected sites return binary challenge pages instead of HTML. The same code from a residential laptop gets clean content. Confirmed-failing sources include BBC (Akamai) and `machinery-market.co.uk` — sources the client relies on. PR #2's UTF-8 guard prevents the garbage from poisoning the dashboard, but `articles_returned` drops to 0, which is its own regression: the client loses content.

This blocks the `feat/biofuel-relevance-cutover` branch and the Phase 1–3 source/author deployment (see `project_pending_source_author_deployment` — parked until this ships).

**Top priority:** best extraction results for the client. **Secondary:** keep cost down — no new fixed subscriptions.

## Requirements

- **R1.** When Railway-side direct fetch works (most domains, e.g. `eadt.co.uk`), extraction behaviour is unchanged — no added latency, no API cost.
- **R2.** When direct fetch fails in a way that indicates bot protection (`403`, `429`, `503`, repeated timeouts, or high UTF-8 replacement-char density in the decoded body), `fetch_html` transparently falls back to a third-party scraping API and returns clean HTML if the API succeeds.
- **R3.** The three known-failing URLs (`machinery-market.co.uk/.../41835`, `bbc.co.uk/.../c8x9v4k8zdko`, plus one from PR #2's regression set) successfully extract clean text when tested against the live Railway service after this ships.
- **R4.** Direct-fetch headers are tuned to look like a real Chrome browser well enough to reduce how often the fallback fires (catches mid-tier bot protection for free). This includes a small realistic User-Agent pool with matching `Sec-Ch-Ua` pairs and per-domain `Referer` spoofing where safe.
- **R5.** Direct-fetch fast-fails on `403` / `429` — no retries — so we reach the paid fallback quickly instead of wasting 3× the latency on guaranteed-to-fail retries. Timeouts and `5xx` still retry as today (genuine transient failures).
- **R6.** When the scraping API itself fails (`5xx`, `429`, `402` payment-required, timeout), `fetch_html` returns `None`. It does **not** degrade-to-direct — direct already failed, otherwise we wouldn't be here.
- **R7.** Per-request budget cap: a single `/search` call may trigger the fallback at most `N` times (default 20). Beyond that, subsequent failures return `None` without calling the API. Prevents a runaway loop from exhausting the monthly budget.
- **R8.** When `SCRAPING_API_PROVIDER=none` (the dev/test default), the fallback path is wholly disabled — direct fetch behaves exactly as today. Makes dev work free and keeps the fallback out of local unit runs.
- **R9.** The scraping-API client is independently testable: unit tests mock it via `respx`/`httpx-mock`; opt-in integration tests (`SCRAPING_API_INTEGRATION=1`) hit the real provider against the 3 known URLs for regression; golden-HTML fixtures allow offline E2E testing without credits.
- **R10.** Structured-log every fallback invocation with: URL domain, direct-failure reason, provider, provider status, bytes returned, credits consumed (if exposed). This is how we learn which domains actually need fallback and refine later.

## Success Criteria

- The 3 known-failing URLs return non-empty, non-garbled article content (>500 chars, <1% `�` chars) when POSTed to the live Railway `/search` endpoint.
- Direct-fetch success rate on easy domains (e.g. `eadt.co.uk`, RSS feeds) is unchanged — no regression in latency, no Zyte calls logged for those requests.
- The `News Sourcing Production (V2)` n8n workflow can be safely re-enabled for a bounded verification window and pulls non-empty content from BBC-tier sources.
- The source/author-contract deploy sequence in `project_pending_source_author_deployment` can proceed — nothing in R1–R10 is a new blocker.
- Monthly Zyte spend sits within the $50 cap and is visible via provider dashboard.

## Scope Boundaries

- **Out:** Playwright / headless-browser approach. Only revisit if Zyte turns out not to beat Akamai on BBC.
- **Out:** Per-domain allowlist / denylist for forcing fallback. Premature — we'll learn which domains need it from R10's logs, then add later if logs justify it.
- **Out:** In-service response cache for the scraping API. Upstream `dedup.py` + n8n dedup already prevent re-fetches of the same URL in normal operation. Revisit if logs show repeats.
- **Out:** Multi-provider escalation (try Zyte anti-ban, then ScrapingBee, etc.). One provider, one profile, one attempt.
- **Out:** Changes to anything parked in `project_pending_source_author_deployment`. Those PRs stay open and deploy in sequence **after** this lands.
- **Out:** Provider-side retry tuning. Zyte handles its own internal retry; we call once.

## Key Decisions

- **Provider: Zyte API.** Pay-as-you-go under $100/mo spend (no subscription commitment at our volume), strongest anti-bot record for Akamai/Cloudflare enterprise tier (Scrapy's authors), ~$7.50/mo estimated at 1,500 anti-ban requests. Beats ScrapingBee's $49/mo subscription floor on cost *and* ScrapFly on anti-bot track record.
- **Profile: `httpResponseBody` with anti-ban.** Since direct already failed, we know the site has protection — skipping standard/premium escalation saves code complexity and roundtrips. If Zyte anti-ban still fails on some URL, we'll learn from R10's logs and revisit.
- **Spending cap: $50/mo** configured in the Zyte account dashboard. Well under the $100 no-commitment tier. Provides headroom over the $7.50 estimate for spiky runs.
- **No JS rendering by default.** BBC, machinery-market, and target news sites render article content server-side. Enabling JS rendering is a per-request cost multiplier — add later only if a site demands it.
- **Single env-var switch: `SCRAPING_API_PROVIDER={zyte|none}`.** Matches the existing `AI_SEARCH_PROVIDER={tavily|perplexity}` pattern in `config.py:36`. Default `none` in repo; Stephen sets `zyte` in Railway only.
- **Direct-fetch retry semantics change:** `403`/`429` = fail fast (no retry, go straight to fallback). Timeouts + `5xx` = retry as today. Most anti-bot status codes don't benefit from retry — it's the IP that's flagged.
- **Fallback trigger set:** `403`, `429`, `503`, all-retries-timeout, or a successful direct fetch whose body has >5% `�` replacement chars (reuse `validate_content`'s existing detection logic). Deliberately narrow — do not trigger on "post-extraction content too short", which has too many false positives (legitimately short pages).
- **No cache layer.** Upstream dedup makes it nearly always useless at prod scale.
- **Header audit is in scope for this work.** `DEFAULT_HEADERS` gets a small UA pool (2–3 Chrome + 1 Firefox) with matching `Sec-Ch-Ua` hints, rotated per request. A realistic `Referer` (e.g. `https://www.google.com/`) is added when the site looks like a news domain. Free win; measurably reduces fallback frequency.

## Dependencies / Assumptions

- Stephen has/will create a Zyte account and generate a production API key, then set `SCRAPING_API_PROVIDER=zyte`, `SCRAPING_API_KEY=<key>`, and `SCRAPING_API_PROFILE=antiBan` (or the equivalent config key) in the Railway dashboard for the `syntech-content-sourcing` service. Agent does **not** touch Railway config.
- Zyte's anti-ban profile does, in fact, beat BBC's Akamai. This is the industry consensus for Zyte vs Akamai and matches Zyte's marketing, but the R3 post-deploy check is the actual confirmation. If Zyte fails on BBC, the fallback strategy is sound but the provider choice needs revisit (see Deferred-to-Planning below).
- httpx can be used as the transport for Zyte's API — no need for Zyte's bespoke Python SDK unless it offers something httpx can't. The API is a simple `POST` with JSON body and Authorization header; keeping it in httpx means one fewer dependency and consistent retry behaviour.
- The `project_pending_source_author_deployment` cutover stays parked until this ships; its PRs do not merge in parallel with this work.

## Outstanding Questions

### Resolve Before Planning

_None — all blocking product decisions resolved._

### Deferred to Planning

- **[Affects R2, R6][Technical]** Exact shape of the Zyte request payload for the anti-ban profile (browserHtml vs httpResponseBody, sessions, geolocation hints) — planning will determine after reading `docs.zyte.com/zyte-api/` during research phase.
- **[Affects R7][Technical]** Where the per-`/search` fallback counter lives: request-scoped contextvar, threaded through handler args, or attached to the `SearchRequest` pydantic model. Small design choice — planning picks the least intrusive.
- **[Affects R4][Needs research]** Which specific `Sec-Ch-Ua` hint sets to pair with each Chrome version in the UA pool, and whether Firefox-family UAs add real value or just noise. Planner does 15 minutes of research.
- **[Affects R3][Needs research]** Whether Zyte anti-ban actually clears BBC's Akamai at request time. If the free $5 credit exhausts without clean BBC extraction, provider choice needs a rethink before full rollout. Planning's Phase 0 burns ~10 credits confirming this against the 3 URLs.
- **[Affects success criteria][Technical]** How to surface the observability promised by R10 — plain structured logs or a lightweight metrics counter (e.g. `anti_bot_fallback_invocations_total{provider,status}`)? Matters if Stephen wants a Railway-side dashboard.

## Next Steps

→ `/ce:plan` for structured implementation planning. The plan's final phase must execute the deployment sequence in `project_pending_source_author_deployment` (Dashboard → Classifier → Content-sourcing → n8n enable) once the anti-bot fix is verified live.
