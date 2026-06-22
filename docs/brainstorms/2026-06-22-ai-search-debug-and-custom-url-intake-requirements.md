# Source-Date Passthrough + Custom Website URL Intake — Requirements

**Date:** 2026-06-22
**Workflows touched:** `AI Research Sourcing` (`txdJXCYFkB1HCZtI`); new `Custom Site — Argus Media` (fresh build; Playground `9hnms1gzGAKoSjU3` stays as Stephen's experimentation scratch and is not touched)
**Cross-repo:** `syntech-content-sourcing`, `syntech-article-processor`

Two adjacent, independent asks resolved together because they share the same `/research-ingest` contract surface.

1. **Pass the AI-supplied publication date through to article-processor** so it can be used as a fallback when downstream HTML extraction fails. Replaces the previously-considered debug-only `test_mode` flag — going straight to the real fix.
2. **Provide a reusable URL intake** — when a client asks for one-off scraping of a specific site, post URLs into the existing pipeline (with dedup, classification, persistence) instead of building bespoke code per client. Same `/research-ingest` endpoint, `source: "Website"`.

## Background — what the AI search already does

Read of `AI Research Sourcing` code nodes confirms:

- Perplexity returns `date` / `published` / `last_updated` per result; Anthropic returns `page_age` / `date` inside `web_search_tool_result` content blocks.
- Both `Build Ingest Payload` (daily) and `Extract URLs` (fallback) already drop results with no date (`droppedNoDate`) and age-gate to 14 days (`droppedOld`).
- The payload sent to `/research-ingest` is `{source_type, source_name, source_category, urls: [...]}` — **the per-result date is discarded at the handoff**.

So "old / undated articles in the dashboard" is overwhelmingly an article-processor downstream extraction problem, not an AI-step problem. The AI step is already conservative. The cheapest leverage is to stop discarding the date the AI gave us and let it serve as a fallback.

## Problem 1 — Source-date passthrough (cross-repo)

### Scope — in

- **AI Research Sourcing code nodes** — `Build Ingest Payload` and `Fallback — Extract URLs` emit `urls: [{url, source_date}, ...]` instead of `urls: ["...", ...]`. Diagnostics array also preserved so the n8n editor shows URL + date per result for human inspection.
- **`/research-ingest` contract** (content-sourcing) — accept `urls` as an array of `{url, source_date}` objects. `source_date` optional; if absent, no fallback is provided downstream. ISO-8601 string. `url` validation unchanged.
- **`url_work_queue`** — persist `source_date` alongside the URL (new column or sidecar field; planner decides).
- **Drainer → flush webhook** — include `source_date` when flushing batches to the Process Articles workflow.
- **Process Articles workflow** — pass `source_date` to `/process` and `/mentions/analyze` calls (article-processor + mentions).
- **article-processor** — if HTML extraction yields no `publication_date`, use `source_date` from the request as fallback. Persist normally. If HTML extraction succeeds, prefer the extracted value (HTML is per-article truth; AI-supplied date is run-level metadata).
- **Pydantic schemas across all services** — add `source_date: Optional[str]` (or datetime) wherever the article shape is validated. `extra="forbid"` is in effect across the pipeline (memory: `output_fields_are_schema`), so this must land in lockstep across content-sourcing → article-processor → drainer.

### Scope — out

- Removing the 14-day age-gate in AI search. Stays.
- Backfilling existing articles that have `publication_date = NULL`. Forward-only.
- Using `source_date` for any classification or relevance signal. Strictly a metadata fallback.

### Success criteria — Problem 1

- Triggering AI Research Sourcing end-to-end on a known set of Perplexity results produces DB rows where every article whose HTML date extraction failed now carries the AI-supplied date in `publication_date`.
- The n8n editor's view of `Build Ingest Payload` and `Fallback — Extract URLs` shows `urls: [{url, source_date}, ...]` so per-result dates are inspectable without re-running.
- Articles whose HTML extraction succeeded show the HTML-extracted date (not the AI date), proving precedence is correct.
- Schema additions land synchronized across content-sourcing, article-processor, and any drainer-side validation — no `extra="forbid"` rejections in Railway logs after deploy.

## Problem 2 — Custom Site Workflows (convention + first instance)

A new workflow, `Custom Site — Argus Media`, is built fresh as the first real custom-site instance. The existing Playground (`9hnms1gzGAKoSjU3`) stays as Stephen's experimentation scratch and is not touched. Subsequent client-specific sites get their own workflow following the same naming convention and standard tail, so the n8n workflow list stays self-explanatory as the set grows.

### Naming convention

- **Display name:** `Custom Site — <Label>`
  - First instance: `Custom Site — Argus Media`.
  - Subsequent: `Custom Site — <SiteOrPublicationName>` (e.g. `Custom Site — Biofuels International`, `Custom Site — S&P Global`). When a client has more than one source, append the qualifier: `Custom Site — <Source> / <Section>`.
  - Em-dash (`—`) for readability in the n8n UI; the `Custom Site — ` prefix keeps the set grouped and sortable in the workflow list.
- **File name:** mirror the display name with a regular hyphen for filesystem portability (e.g. `Custom Site - Argus Media.workflow.ts`) inside `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/`. `n8nac` will slug from the display name on pull; verify the filename matches the convention before push.

### Standard tail (every custom-site workflow inherits this)

After whatever site-specific discovery a workflow does (a webhook payload for the generic one; bespoke fetch / parse nodes for site-specific ones later), the final three nodes are the same:

1. **Code node — Build research-ingest payload.** Normalises into `{source_type: "Website", source_name, source_category, urls: [{url}, ...]}`. Validation (https-only, dedup-within-batch, required fields) lives here.
2. **HTTP Request — POST `/research-ingest`.** Bearer auth (same credential as AI Research Sourcing's POST node).
3. **Response shaping.** Pass through `{accepted, deduped_in_response}` (or whatever content-sourcing returns) plus the request's `source_name` so the caller can correlate.

Keeping the tail identical across workflows means a future refactor into a shared subworkflow (called via Execute Workflow) is a mechanical change, not a redesign. Subworkflow extraction stays out of scope for now — duplicate the three nodes per workflow until duplication actually hurts.

### First instance — `Custom Site — Argus Media`

- **Trigger:** Webhook with bearer auth.
- **Body:** `{ "urls": ["https://www.argusmedia.com/…", "https://www.argusmedia.com/…"], "source_name": "Argus Media", "source_category": "News" }`. Hardcoding `source_name` and `source_category` defaults inside the workflow (rather than requiring them in every payload) is acceptable since this workflow is Argus-specific — callers only need to send `urls`. `source_date` is optional and forward-compatible if a caller later has one.
- **Behaviour:** validate → standard tail (build payload → POST → respond).

Dedup, extraction, classification, persistence all inherit from the existing pipeline. Stephen invokes with `curl` from his Argus Media scraper (external) once URLs have been discovered.

### Verify "Website" is accepted everywhere

Per memory `output_fields_are_schema` and the cross-service `extra="forbid"` invariant, this needs explicit verification before the workflow ships:

- `syntech-content-sourcing` — `/research-ingest` and Website handler accept `source_type: "Website"` / `source: "Website"`.
- `syntech-biofuel-relevance-classifier` — `ClassifyRequest.source` enum / validator accepts `"Website"`.
- `syntech-article-processor` — request schema for `/process` accepts `source: "Website"`.
- `syntech-semantic-article-deduplication` — passes `source` through opaquely (probably fine but verify).
- `syntech-intelligence-dashboard` — DB read / source filter list includes Website.
- `syntech-email-digest` — same.

`Website` is in the canonical list per `~/granite/clients/syntech/architecture.md` ArticleResponse, so this is mostly a confirmation pass. But one missed enum = whole pipeline 422s.

### Scope — out

- Notion-driven URL DB (out — not using Notion for this).
- n8n-side scraping / sitemap parsing (kept out by design; n8n is orchestration, not scraping).
- Any new content-sourcing handler — reuses existing `/research-ingest`.

### Success criteria — Problem 2

- `Custom Site — Argus Media` workflow exists in n8n with the proper display name, file name, and matching standard tail. Playground is untouched.
- `curl` against its webhook with 10 Argus URLs adds 10 entries (minus duplicates) to `url_work_queue`, with `source: "Website"`, `source_name: "Argus Media"`, and `source_category: "News"` preserved end-to-end into the dashboard.
- Re-posting the same URLs returns a deduped count, no double-write.
- Bad payload (missing field, non-https URL, non-Argus host if we choose to enforce that — see Outstanding Questions) returns 4xx with a clear message and does not call `/research-ingest`.
- Creating a second hypothetical workflow (`Custom Site — <Some Other Source>`) by copying the standard tail still works without re-deriving payload shape or auth.

## Email-side testing strategy

Temporarily remove the team's distribution email from the email-digest Railway env vars so only Stephen receives the test digest; restore once verified live.

The test window is implicit: AI Research Sourcing has not run in multiple days, so any AI-sourced article in the DB between the start of testing and going live is, by construction, a test artifact. No special `source_name` tagging or DB clean-up planning needed. Schedule test runs to avoid the once-per-day digest + monitor cron windows.

## Dependencies & Assumptions

- This is a coordinated cross-repo deploy of the same shape as the `source` / `author` field contract change (see `docs/brainstorms/2026-04-22-source-author-field-contract-requirements.md`). Land schema additions across all services in lockstep, then deploy n8n side last.
- The bearer secret to use is the same one already wired into AI Research Sourcing's `/research-ingest` HTTP Request node.
- `Website` source type is already canonical; verification pass only.

## Outstanding Questions (for `/ce-plan`)

- Should `/research-ingest` accept both shapes (`urls: ["..."]` AND `urls: [{url, source_date}]`) during transition, or break-change to the object form only? Object-only is simpler if all callers can land together (only AI Research today + new Website intake).
- Where does `source_date` live in `url_work_queue` — a new column, or a JSON sidecar field? Planner to decide based on existing column shape.
- Should `Custom Site — Argus Media` enforce a host allow-list on incoming URLs (e.g. reject anything not under `argusmedia.com`)? Adds a safety rail at the cost of needing to update the workflow when Argus moves to a subdomain. Default: enforce per-site host filter — easier to relax later than tighten.
- For per-site workflows: do we want the webhook to also accept an optional `source_date` per URL (for callers who do have a date), or strictly URL-only? Default URL-only; revisit when a caller actually needs it.
- Should the standard tail be extracted into a shared subworkflow on day one, or duplicated per workflow until N ≥ 3? Default: duplicate until it hurts.

## File / workflow references

- `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/` — target folder for both edits (pull `txdJXCYFkB1HCZtI` for the AI Research Sourcing change; create new `Custom Site - Argus Media.workflow.ts` for the URL intake). Playground (`9hnms1gzGAKoSjU3`) is not touched.
- `~/granite/clients/syntech/architecture.md` — pipeline + invariants (bearer auth, source field as platform, source_category preserved).
- `docs/ARCHITECTURE.md` — local pipeline diagram, `/research-ingest` contract context.
- `docs/brainstorms/2026-04-22-source-author-field-contract-requirements.md` — prior coordinated cross-repo schema rollout; same shape of change.
