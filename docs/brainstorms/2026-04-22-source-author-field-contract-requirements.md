---
date: 2026-04-22
topic: source-author-field-contract
---

# Source / Author Field Contract

## Problem Frame

Articles in `public.articles` currently show **author names** (sometimes a person, sometimes a company byline) in the `source` column. `source` is meant to hold the **platform** the article was sourced from (LinkedIn, RSS, Website, etc.) so rows are filterable and groupable by where they came from. Attribution (the byline) is a separate concept and is currently being destroyed by the overwrite — it lands in `source` and then gets lost.

This is the third incident of `source` being silently re-stamped (see `feedback_source_vs_author` memory for the Keyword→Google fanout history). Stephen wants the field contract locked down before re-enabling the "News Sourcing Production (V2)" n8n workflow, which has been disabled pending confidence in the pipeline.

Scope affects four repos:
- `syntech-content-sourcing` (handler output shape)
- `syntech-article-classifier` (ingest schema, `classifier.articles`, outbox payload)
- `syntech-intelligence-dashboard` (webhook Zod, `public.articles` Drizzle, UI)
- `syntech-n8n-as-code` (workflow payload threading)

This is a **prerequisite** to R1.a and R1.f of `docs/brainstorms/2026-04-22-sourcing-e2e-validation-requirements.md`.

## Requirements

- **R1. `source` taxonomy frozen.** Content-sourcing keeps the existing closed Pydantic `Literal` enum: `RSS | LinkedIn | Instagram | X | Website | Google | Keyword`. No values added, no values merged.
  - `Keyword` = AI search (Tavily today, potentially Perplexity later — provider-agnostic).
  - `Google` = direct Google Search.
  - `Keyword` and `Google` are **distinct** even when the Keyword handler internally fans out to Google — articles retrieved from the Google leg ship as `source="Google"`, articles retrieved from the AI-search leg ship as `source="Keyword"`.

- **R2. New `author: str | None` field on `ArticleResponse`.** Populated per `source_type` using the existing input `source_name`:
  | Input `source_type` | `source` emitted | `author` emitted |
  |---|---|---|
  | `LinkedIn` | `LinkedIn` | `source_name` |
  | `X` | `X` | `source_name` |
  | `Instagram` | `Instagram` | `source_name` |
  | `RSS` | `RSS` | `NULL` |
  | `Website` | `Website` | `NULL` |
  | `Keyword` (AI search leg) | `Keyword` | `NULL` |
  | `Keyword` (Google fanout leg) | `Google` | `NULL` |

  No byline extraction from extracted HTML (deliberately out of scope — see Scope Boundaries).

- **R3. n8n workflow threads `author`** from content-sourcing response into the classifier `/classify` POST body.

- **R4. Classifier `/classify` ingest accepts `author`.** Add a nullable `author` column to `classifier.articles`. Classifier persists it as received.

- **R5. Classifier outbox payload includes `author`.** `dashboard_sync.py` adds `author` to the outbox row shape.

- **R6. Dashboard webhook schema + DB column.** `/api/webhooks/articles` Zod schema accepts `author: string | null`. Drizzle migration adds a nullable `author` column to `public.articles`. **Forward-only — no backfill of historical rows.**

- **R7. Dashboard UI surfaces `author`** when present (placement is a planning-phase UI detail — likely adjacent to `source` in the explorer table).

- **R8. Locate and fix the existing downstream override** that writes author into `source` today. Because `ArticleResponse.source` is a closed Pydantic `Literal`, content-sourcing **cannot** emit author in `source` — so the override lives somewhere downstream. Suspect surfaces (in trace order): n8n workflow expression mappings, classifier `/classify` ingest, classifier outbox producer, dashboard webhook handler, dashboard explorer UI render. Planning identifies the exact location and removes the override.

## Success Criteria

- After cutover, every row of `public.articles.source` written by the pipeline is one of the seven platform enum values. No person names, no company names.
- LinkedIn / X / Instagram rows have `author` populated (matching the input `source_name`).
- RSS / Website / Keyword / Google rows have `author = NULL` (this is **expected**, not a defect).
- Historical rows written before the cutover are unchanged — we do not retroactively correct the `source` column for old rows.
- The R8 override is removed; a representative new row through each of the seven `source_type` paths confirms the contract.

## Scope Boundaries

- **No backfill** of historical `public.articles` rows for either `source` or `author`.
- **No byline extraction** from extracted HTML / article content. If we want real bylines for RSS/Website later, it is a separate workstream.
- **No Notion mapper changes.** Notion export continues with its current field set.
- **No Google Sheets evaluation export changes.**
- **No new source enum values.** Tavily / Perplexity stay folded under `Keyword`.
- **No merging of `Keyword` and `Google`** — they remain distinct platform values.
- **No dashboard UI redesign** — R7 is a minimal surfacing, not a layout change.

## Key Decisions

- **Keep the existing 7-value `source` enum.** Stephen reversed his earlier position on the Keyword→Google fanout: articles retrieved from Google (even via the Keyword handler's fanout) are fine as `source="Google"`. Handlers should stamp `source` per-retrieval-path, not re-stamp at the handler boundary. Tavily stays as `Keyword` so a future Tavily→Perplexity swap is a one-line change.

- **`author` is an input-derived field, not extracted.** The input JSON already carries `source_name` when `syntech-content-sourcing` is invoked, so for profile-based sources the author is known before extraction even runs. For publication / search sources, `source_name` is the publication name or the search topic — not a byline — so `author = NULL` is semantically correct.

- **Forward-only migration.** Nullable column, no backfill. Stephen's stated lean and consistent with the `category` regression approach in `project_category_regression_cause.md`.

- **DB + dashboard UI only.** Notion and Sheets exports unchanged — minimises blast radius, can be added later if wanted.

## Dependencies / Assumptions

- Deploy ordering matters — each downstream must accept `author` **before** any upstream starts sending it, or the webhook / ingest fails validation:
  1. Dashboard Drizzle migration + Zod schema extended to accept `author` (nullable).
  2. Classifier schema migration + ingest + outbox producer extended to write `author`.
  3. Content-sourcing `ArticleResponse.author` added + per-handler population wired up.
  4. n8n workflow extended to thread `author` through the `/classify` POST.
  5. R8 override fix.

- Existing n8n input JSON already carries `source_type` + `source_name` per source, confirmed from the current invocation shape (e.g. `{"source_type": "LinkedIn", "source_name": "Lubomila Jordanova", ...}`). No n8n input shape change required.

- The `News Sourcing Production (V2)` workflow stays disabled until R1–R8 land and the e2e validation (sibling brainstorm) passes.

## Outstanding Questions

### Resolve Before Planning

*(none — product contract is defined; remaining items are all technical)*

### Deferred to Planning

- **[Affects R8][Needs research]** Trace the current author-in-source override across: n8n workflow expression mappings → classifier `/classify` ingest → classifier outbox producer → dashboard webhook handler → dashboard explorer UI render. Pinpoint the exact writer and remove it.
- **[Affects R6][Technical]** Drizzle migration file naming + generation (`pnpm drizzle-kit generate`) + rollout timing relative to Vercel deploy.
- **[Affects R4][Technical]** Classifier `classifier.articles.author` migration — same PR as ingest + outbox changes, or separate?
- **[Affects R7][Technical]** Exact dashboard UI placement for `author`. Explorer table already shows `source`; simplest is to surface `author` in the row expand or as an adjacent column. Decide during planning after reading the current explorer layout.
- **[Affects R3][Technical]** n8n expression to read `author` from content-sourcing response and merge into the `/classify` POST body — which node needs editing (likely the classifier call node's JSON body expression).

## Next Steps

→ `/ce:plan` for structured implementation planning across the 4 repos.
