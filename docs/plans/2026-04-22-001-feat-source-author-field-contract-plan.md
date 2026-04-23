---
title: Source / Author Field Contract — platform restoration + author propagation
type: feat
status: completed
date: 2026-04-22
deepened_on: 2026-04-22
origin: docs/brainstorms/2026-04-22-source-author-field-contract-requirements.md
---

# Source / Author Field Contract

## Deepening Summary (2026-04-22)

Ran 18 parallel research + review agents across all four repos. Plan is directionally sound but has **three deploy-blocking corrections** that must be applied before implementation, plus several quality improvements worth absorbing. Nothing here changes the immutable brainstorm decisions (7-value enum frozen, input-derived author, forward-only, load-bearing phase order, workflow disabled Phases 1–4); everything here sharpens execution.

### Deploy blockers (fix before `/ce:work`)

1. **Phase 1 UI deliverable targets a UI that does not exist.** `src/app/[vertical]/explorer/page.tsx` has no row-expand affordance; the `<dd>/<dt>` pattern is fabricated. The actual rendering surface for article metadata is `src/components/articles/article-detail.tsx:42-60` (inline `<div><span>…</span>·<span>…</span></div>` pattern) for the detail view, and `src/components/articles/columns.tsx:23-27` for the explorer table column list. **Phase 1 §Explorer page must be re-scoped** (see Phase 1 Research Insights below).
2. **Phase 2 "Model" bullet is unactionable as written.** Classifier has no ORM model — `classifier.articles` is written via raw SQL in `app/db.py::upsert_article` (line 129). Grepping `class Article` returns nothing. **Phase 2 §Model must be rewritten** to enumerate the four coordinated edits in `db.py` + `classify.py` (see Phase 2 Research Insights below).
3. **Phase 3 handler table misnames one construct site.** `keyword.py:~510` is the **Perplexity citation leg** (stamps `source="Keyword"`), not a "Google fanout leg". The Google-fanout articles are produced by `google.py:268` via `get_handler("Google").fetch(...)` and already stamp `source="Google"` — no Google-fanout construct site exists inside `keyword.py`. **Phase 3 table must be corrected** (see Phase 3 Research Insights below).

### Major corrections (non-blocking but consequential)

4. **Current Zod schema is `source: z.string().optional()`** (not `z.string()` as the plan text says). Replacement `z.enum(PLATFORM_VALUES)` removes `.optional()` — this is a tightening beyond "just an enum guard". **Intentional per the workflow-disabled invariant, but the plan should name it.**
5. **`author` Zod shape contradicts its own acceptance criterion.** Deliverable says `z.string().nullable()` (rejects `undefined`); acceptance says "accepts author omitted". Use `z.string().trim().min(1).max(500).nullable().optional()` — adds length cap + trim + truly optional.
6. **HTTP rejection status is 422, not 400** — both the dashboard webhook (`src/app/api/webhooks/ingest/route.ts:32-41`) and the classifier (`app/main.py:76-79`) return 422 from validation errors. Outbox drainer correctly treats 4xx ≠ 429 as permanent (dead-letter). Plan acceptance criteria must be updated `400 → 422` throughout Phase 1 and Phase 2.
7. **`public.articles` `source` column is `varchar("source", { length: 255 })` at line 20 of `articles.ts`, not line ~30.** Insert `author` adjacent (line 20), matching type: use `author: varchar("author", { length: 500 })` OR `text("author")` — decide in Phase 1 (see Phase 1 Research Insights).
8. **Dashboard has no `db:migrate` or `drizzle-kit migrate` script in `package.json`.** Plan's "check README — likely `pnpm drizzle-kit migrate` or `pnpm db:migrate`" is a guess. Actual command is `npx drizzle-kit migrate` against `DATABASE_URL` pointing at prod Neon. Confirmed: no CI drift check; no `db:check` script either.
9. **Workflow file currently has `active: true`** (line 200 of `News Sourcing Production (V2).workflow.ts`). Either the file was pulled while n8n had it active (in which case the UI must be disabled and re-pulled before Phase 4 push), or the "workflow disabled" invariant is already violated. Phase 4 pre-flight must verify live state — `npx n8nac push` is file-level last-write-wins and will rewrite the live `active` flag to match the file.
10. **Branch `feat/biofuel-relevance-cutover` already has a 6000+ line pending diff** on the target workflow file. Phase 4 cannot naively push — must sequence after or integrate with the refactor-in-flight.
11. **`public.articles.source` has no CHECK constraint and `src/scripts/migrate-notion.ts:334` writes directly to `public.articles` bypassing the webhook's Zod.** Plan defers this CHECK to Future Considerations but the bypass is a live secondary writer. **Promote the CHECK to Phase 1** (see §System-Wide Impact / new §Belt-and-Braces Symmetry below).
12. **Phase 2 Pydantic `Literal` on parsed `source` has no mechanism.** `ClassifyRequest.article: str` is a stringified JSON blob; inner validation is hand-rolled in `app/classify.py::_parse` using `data.get()`. Plan must pick between (a) introducing an `ArticleBlob(BaseModel)` model and replacing `_parse` with `ArticleBlob.model_validate_json`, or (b) adding a manual `raise ValueError` in `_parse`. Approach (a) is idiomatic Pydantic v2 and gives 422 on enum violation for free.
13. **`build_payload` has 5+ callers, not just the one in `app/`:** `app/classify.py:165`, `scripts/backfill_dashboard_sync.py:103`, and 3 sites in `tests/test_dashboard_sync.py` (124, 177, 199, 227) that currently assert `payload["source"] == "BBC News"` — the buggy behaviour the plan deletes. Phase 2 deliverables must explicitly enumerate all call sites; the grep scope must be `.` (repo root), not `app/`.
14. **`db.upsert_article` signature change is a 4-edit coordinated change:** column list (`db.py:163`), VALUES tuple (`db.py:169`), ON CONFLICT SET (`db.py:176-189`), parameter bind tuple (`db.py:193-199`). Plan's "persist source and author on upsert" phrasing hides this surface.

### New sections appended (see end of plan)

- **§Cross-Repo Enum Governance** — the 7-value enum lives in 4 locations; adds a per-repo hash-pin test + a canonical reference doc at `docs/contracts/source-author-field.md`.
- **§Runbook: Adding a New Source Value** — answers the implicit brainstorm question about Tavily→Perplexity with a 6-step procedure mirroring the deploy order.
- **§Deployment Runbook** — per-phase pre-flight / deploy / post-verify / rollback with concrete SQL + curl + grep commands.
- **§Rollback Procedures** — per-phase undo, from Phase 1 trivial (additive nullable column) to Phase 4 `npx n8nac push` of prior workflow file.
- **§PII Footprint** — `author` is real-person-name PII; retention + deletion surface spans 2 Neon schemas + outbox JSONB payload.
- **§Research Appendix** — framework docs (Drizzle + Alembic + Zod + Pydantic) and institutional-learning pointers.

### Key improvements from deepening

1. Belt-and-braces `public.articles.source` CHECK constraint promoted from Future Consideration into Phase 1 (one additional Drizzle `check()` call) — closes the `migrate-notion.ts` bypass.
2. Cross-field validation (`LinkedIn|X|Instagram ⇒ author NOT NULL`) via Zod `superRefine` + optional DB conditional CHECK — catches "author silently dropped for a LinkedIn article" regressions.
3. n8n jsonBody changed from `|| null` to `?? null` (nullish coalescing) — preserves empty-string / falsy-but-present semantics.
4. Classifier `_SENSITIVE_KEYS` in `app/logging.py` extended to include `author` and `source_name` before Phase 2 lands — prevents silent PII leakage in structlog output.
5. Explicit `DATABASE_URL_DIRECT` routing for Phase 2 Alembic migration (pgbouncer DDL caveat from `docs/solutions/2026-railway-python-service.md`).
6. `author` column width cap (`varchar(500)` or `z.string().max(500)`) and explicit trim, matching the pattern of peer fields (`content: z.string().max(500_000)`).
7. Phase 3 adds a local unit test in `syntech-content-sourcing/tests/handlers/test_keyword.py` asserting per-leg stamping — the plan's whole reason for existing now has a colocated regression guard, not just a cross-repo e2e scenario.
8. Pre-Phase-2 outbox backlog mitigation now has a concrete SQL query + decision threshold (proceed if `will_dead_letter < 100`, otherwise drain under old code first).
9. Phase 4 pre-flight checks now include clean-tree + live-state-verification + no-remote-ahead triad — the biofuel-cutover learning's "last-write-wins" warning made operational.

---

## Overview

Lock down the `public.articles.source` / `classifier.articles.source` field so it only ever holds a **platform** value from the closed 7-value enum (`RSS | LinkedIn | Instagram | X | Website | Google | Keyword`). Stop the pipeline from overwriting it with author / publication / site-brand strings. Introduce a nullable `author` column alongside, populated only for profile-based source types (LinkedIn / X / Instagram) from the existing n8n input `source_name`. Forward-only, no backfill. Spans four repos, five deploy steps, one smoking-gun override fix.

This plan is the **prerequisite** to R1.a and R1.f of the sibling e2e-validation plan (`2026-04-22-002-feat-sourcing-e2e-validation-plan.md`). The "News Sourcing Production (V2)" n8n workflow stays **disabled** until every step here lands.

## Problem Statement

Articles in `public.articles` currently show author names (sometimes a person, sometimes a company byline) in the `source` column. Attribution is being destroyed by the overwrite — it lands in `source` and gets lost. This is the third incident of `source` being silently re-stamped (see `feedback_source_vs_author` for the Keyword→Google fanout history).

**Forensic finding (confirmed during planning research):** `ArticleResponse.source` at `syntech-content-sourcing/app/models.py:53` is a closed Pydantic `Literal`, so content-sourcing **cannot** emit an author in `source`. The override is downstream. The smoking gun:

- `syntech-article-classifier/app/dashboard_sync.py:144` — `"source": source_name or None` (the outbox payload builder assigns the caller-supplied `source_name` to the webhook's `source` key).
- `syntech-article-classifier/migrations/versions/0001_initial_schema.py:24-56` — `classifier.articles` has a `source_name` column but **no `source` column**. The platform value is never persisted after ingest; it can't be written to the outbox even if the bug at line 144 is fixed.
- `syntech-intelligence-dashboard/src/lib/validations/webhook.ts:15-27` — the Zod schema accepts `source: string` with no enum constraint, so the wrong value passes webhook validation and lands in `public.articles.source` via `src/lib/services/ingestion.ts:46`.

So R8 is two coupled defects (missing persistence column + mis-keyed outbox mapping + missing Zod enum guard), not one.

## Proposed Solution

Two additive schema changes (`classifier.articles.source`, `public.articles.author`) plus one schema correction in the classifier (`classifier.articles.source` was missing entirely). Thread the two fields end-to-end. Add a closed-enum Zod guard at the dashboard boundary so any regression is caught at the webhook, not in production data. Fix `dashboard_sync.py:144`. Land everything downstream-first so deploys never fail validation. Forward-only migrations; no touching historical rows.

## Technical Approach

### Architecture

**End-to-end data flow (post-cutover):**

```
n8n input JSON
  { source_type: "LinkedIn", source_name: "Lubomila Jordanova", ... }
        │
        ▼
content-sourcing POST /search/batch
  per-handler ArticleResponse(
    source="LinkedIn",                    # platform enum, per-retrieval-path
    author="Lubomila Jordanova",          # NEW — from request.source_name for profile sources
    source_name="Lubomila Jordanova",     # unchanged — still the Notion "name" column
    ...
  )
        │
        ▼
n8n "Deduplicated Articles" → ClassifyViaRelevanceService jsonBody
  { title, content, url, source, source_category, summary, author }   # NEW author key
        │
        ▼
article-classifier POST /classify — stringified JSON blob
  parsed, written to classifier.articles:
    source  TEXT CHECK IN (7-value enum)   # NEW column
    author  TEXT NULL                      # NEW column
        │
        ▼
classifier/dashboard_sync.py build_payload()
  { source: <platform enum>, author: <string|null>, ... }
  (fix: line 144 now reads persisted `source`, not `source_name`)
        │
        ▼
dashboard POST /api/webhooks/ingest
  Zod: source: z.enum(PLATFORM_VALUES), author: z.string().nullable()
        │
        ▼
public.articles.source  (enum-constrained value)
public.articles.author  (nullable, NEW column)
        │
        ▼
Explorer UI — surfaces `author` next to `source` in the row expand
```

### Implementation Phases

The deploy order is **load-bearing**: each downstream must accept `author` **before** upstream starts sending it, or the webhook / ingest fails validation on the first article. Phases are numbered by deploy order (1 = deploy first).

#### Phase 1: Dashboard — schema + Zod + ingest + UI

Deliverables:

- **Drizzle migration** adding `author text` nullable to `public.articles`.
  - File to edit: `syntech-intelligence-dashboard/src/lib/db/schema/articles.ts` — add `author: text("author")` adjacent to `source` (line ~30 in current file).
  - Generate migration: `pnpm drizzle-kit generate` → new file under `syntech-intelligence-dashboard/drizzle/` (follow existing naming; drizzle-kit decides the numeric prefix).
  - Rollout: apply via the project's existing migration command (check README — likely `pnpm drizzle-kit migrate` or `pnpm db:migrate`). Deploy migration **before** the code change so old code never sees the column (harmless either way for an additive column, but keeps the invariant clean).
- **Webhook Zod schema** — `syntech-intelligence-dashboard/src/lib/validations/webhook.ts:15-27`:
  - Extract the 7-value enum as a shared constant (e.g. `PLATFORM_VALUES = ["RSS", "LinkedIn", "Instagram", "X", "Website", "Google", "Keyword"] as const`).
  - Replace `source: z.string()` with `source: z.enum(PLATFORM_VALUES)` — **hard rejection** is correct here (workflow is disabled; any request arriving before Phase 5 finishes is a bug we want loud).
  - Add `author: z.string().nullable()`.
- **Ingestion service** — `syntech-intelligence-dashboard/src/lib/services/ingestion.ts:46`:
  - Add `author: payload.author` to the insert alongside `source: payload.source`.
- **Explorer UI** — `syntech-intelligence-dashboard/src/lib/actions/articles.ts:114-125`:
  - Add `author: articles.author` to the select column list.
- **Explorer page** — `syntech-intelligence-dashboard/src/app/[vertical]/explorer/page.tsx`:
  - Surface `author` in the row expand (simplest placement — a single `{article.author && <dd>{article.author}</dd>}` entry adjacent to `source`). Not a UI redesign; one dd/dt pair.

Acceptance criteria (Phase 1):
- [ ] Drizzle migration generated, reviewed, and applied to the prod Neon branch (`br-broad-voice-ady830j1` on `hidden-firefly-51918724`).
- [ ] Webhook rejects any `source` value outside the 7-value enum with a 400.
- [ ] Webhook accepts `author: string`, `author: null`, and `author` omitted (Zod nullable + optional).
- [ ] Ingest insert writes `author` to `public.articles`.
- [ ] Explorer row expand renders `author` when non-null, hides the row when null.

Estimated effort: small. 1 migration, 1 Zod update, 2 line-level ingest/select changes, 1 UI dd/dt.

#### Phase 2: Classifier — schema + ingest + outbox

Deliverables:

- **Alembic migration** — new file `syntech-article-classifier/migrations/versions/0006_articles_source_and_author.py`:
  - `ALTER TABLE classifier.articles ADD COLUMN source TEXT` with a `CHECK (source IN ('RSS','LinkedIn','Instagram','X','Website','Google','Keyword'))` constraint. Nullable for now — existing rows have no platform value; we don't backfill.
  - `ALTER TABLE classifier.articles ADD COLUMN author TEXT` nullable.
  - Single migration, single PR — ingest and outbox changes merge in the same commit so the model/schema/payload-builder stay consistent in prod.
- **Model** — wherever `classifier.articles` ORM model lives (grep for `class Article` / `Table("articles"` under `syntech-article-classifier/app/`):
  - Add `source` (typed as one of the seven enum values) and `author` (nullable string) fields.
- **Ingest** — `syntech-article-classifier/app/main.py:99-105` and the schema at `app/schemas.py:128-130`:
  - `ClassifyRequest.article` is a stringified JSON blob; after `json.loads`, require `source` and read optional `author`.
  - Tighten: add a Pydantic `Literal` constraint on the parsed `source` to match the 7-value enum. Reject with 400 if absent or invalid (workflow-disabled invariant — loud failure is correct).
  - Persist `source` and `author` onto the `classifier.articles` row on upsert.
- **Outbox builder** — `syntech-article-classifier/app/dashboard_sync.py:112-168`:
  - Add `source: str` and `author: str | None` to `build_payload` kwargs; drop the `source_name` → `source` mapping.
  - Line 144: replace `"source": source_name or None` with `"source": source`.
  - Add `"author": author` to the returned dict adjacent to `source`.
  - Update every caller of `build_payload` to pass the persisted `source` and `author` from the `classifier.articles` row. (Grep `build_payload(` inside `app/`.)

Acceptance criteria (Phase 2):
- [ ] Migration 0006 applied to prod; `classifier.articles` has `source` (CHECK-constrained) and `author` (nullable).
- [ ] `/classify` rejects a payload whose `article` JSON lacks `source` or carries a `source` outside the enum.
- [ ] `/classify` accepts payloads with and without `author`.
- [ ] Outbox row payload `source` is the platform enum (never the author / publication string), `author` is present and nullable.
- [ ] No code path in `dashboard_sync.py` references `source_name` when building the webhook `source` field.

Estimated effort: medium. One migration, ~6 call sites across ingest + outbox + model.

#### Phase 3: Content-sourcing — `ArticleResponse.author` + per-handler wiring

Deliverables:

- **Model** — `syntech-content-sourcing/app/models.py:39-57`:
  - Add `author: str | None = None` to `ArticleResponse` (default None keeps backwards compat for any test fixtures that don't set it).
  - Do **not** change the `source` Literal enum or its values.
- **Handler wiring** — per the brainstorm table (R2), at each `ArticleResponse(...)` call site:

  | Handler file | `source` | `author` populated from |
  |---|---|---|
  | `app/handlers/linkedin.py:202-215` | `"LinkedIn"` | `request.source_name` |
  | `app/handlers/twitter.py:~169` | `"X"` | `request.source_name` |
  | `app/handlers/instagram.py:~170` | `"Instagram"` | `request.source_name` |
  | `app/handlers/rss.py:208-221` | `"RSS"` | `None` |
  | `app/handlers/website.py:85-98` | `"Website"` | `None` |
  | `app/handlers/google.py:~259` | `"Google"` | `None` |
  | `app/handlers/keyword.py` (AI-search leg, ~line 416) | `"Keyword"` | `None` |
  | `app/handlers/keyword.py` (Google fanout leg, ~line 510) | `"Google"` | `None` |

  **Critical — Keyword re-stamp at merge:** `app/handlers/keyword.py:106` currently does `article.source = "Keyword"` at the merge boundary, which is the bug behind the original fanout regression. Delete that line. Each leg must stamp its own platform at construction time and the merge leaves it alone. (Cross-ref `feedback_source_vs_author` — "per-retrieval-path stamping, not per-handler.")

- **Handler signature `author`:** for LinkedIn/X/Instagram, `request.source_name` is already available in scope at every construct site. For RSS/Website/Keyword/Google, pass `author=None` explicitly so the intent is visible.

Acceptance criteria (Phase 3):
- [ ] `ArticleResponse.author` is in the Pydantic model, JSON-serialised to `author` (not `Author`).
- [ ] LinkedIn / X / Instagram handlers populate `author` from `request.source_name`; values survive round-trip through `/search/batch` → n8n.
- [ ] RSS / Website / Keyword / Google rows ship `author = None`.
- [ ] `keyword.py:106` re-stamp is **removed**; the AI-search leg's articles ship `source="Keyword"` and the Google fanout leg's articles ship `source="Google"` by each leg stamping at construction.
- [ ] `/search/batch` response passes Phase 2 classifier `/classify` ingest (the enum guard catches any remaining mis-stamp).

Estimated effort: small. One model field + 8 handler construct sites + one deletion in `keyword.py`.

#### Phase 4: n8n workflow — thread `author` through the classify POST

Deliverables:

- **File:** `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts`
- **Node to edit:** `ClassifyViaRelevanceService` (found at line ~3057 during research). Current `jsonBody` (lines 3067-3076):
  ```ts
  "title":           ...$('Deduplicated Articles').item.json.title ...,
  "content":         ...
  "url":             ...
  "source":          ...
  "source_category": ...
  "summary":         ...
  ```
  Add one line, preserving ordering of existing keys:
  ```ts
  "author": {{ JSON.stringify($('Deduplicated Articles').item.json.author || null) }}
  ```
  The `|| null` guard means the node works against the pre-Phase-3 response (where `author` is undefined) as well as the post-Phase-3 response, so the workflow file isn't itself a deploy-order dependency.
- **`CallContentSourcingBatch` node:** no change required — the node returns the full `ArticleResponse` already; `author` will flow through `Deduplicated Articles` as a pass-through key once Phase 3 ships.
- **`.n8n-state.json`:** will update automatically on `npx n8nac push`; do not hand-edit.
- **Do not re-enable the workflow yet.** Stays disabled until Phase 5 validates end-to-end under the e2e-validation plan.

Acceptance criteria (Phase 4):
- [ ] Workflow file compiles (`npx n8nac validate` — or whatever the repo's local validation command is; see `AGENTS.md`).
- [ ] Pushed to n8n, the `ClassifyViaRelevanceService` node's body includes the `author` key.
- [ ] Workflow remains **disabled** in n8n.

Estimated effort: tiny. One jsonBody line.

#### Phase 5: R8 verification + representative per-source validation

Deliverables:

- **Verification script** — one-off, checked into `docs/testing/sourcing-e2e/validate-source-author-contract.sh`:
  - Hits content-sourcing `/search/batch` with one fixture per source type (reusing the Phase-5 fixtures from the e2e-validation plan if already in flight).
  - For each returned article, asserts `source ∈ {RSS,LinkedIn,Instagram,X,Website,Google,Keyword}`.
  - Asserts `author` is non-null for LinkedIn/X/Instagram, null for RSS/Website/Keyword/Google (matching the R2 table).
  - Emits a green/red verdict; exits non-zero on mismatch.
- **Manual prod check** (documented in the plan, run once after Phase 1-4 are live):
  - Re-enable the workflow in n8n for a bounded window (one source per platform, not the full Notion set).
  - Query:
    ```sql
    SELECT source, author, count(*)
    FROM public.articles
    WHERE created_at > now() - interval '1 hour'
    GROUP BY source, author
    ORDER BY source;
    ```
  - Assert: every `source` value is one of the seven enum values. Every LinkedIn/X/Instagram row has a non-null `author`. Every RSS/Website/Keyword/Google row has a null `author`. No rows have a person-name or company-byline in `source`.
- **Regression catch:** because Phase 1 added a Zod `z.enum()` guard at the webhook and Phase 2 added a `CHECK` at the classifier, any future drift raises a 400 or a DB constraint error — visible loud, not silent.

Acceptance criteria (Phase 5):
- [ ] `validate-source-author-contract.sh` exits 0 against live Railway.
- [ ] The post-cutover prod SQL query returns 0 rows with `source NOT IN (7-value enum)`.
- [ ] The `keyword.py:106` re-stamp fix is confirmed: a Keyword-source fixture that triggers the Google fanout returns articles where AI-search-leg rows ship `source="Keyword"` and Google-leg rows ship `source="Google"` — both present.
- [ ] R7 (dashboard UI surfaces `author`): open the explorer page after the prod check; a freshly-inserted LinkedIn row shows the author in its row expand.

Estimated effort: small. Script is ~30 lines bash + jq; prod SQL query is one-off.

## Alternative Approaches Considered

- **Extract bylines from HTML/content for RSS/Website** — rejected. Brainstorm Scope Boundary: deliberately out of scope. Real byline extraction is a separate workstream if ever wanted. Current decision keeps `author = NULL` for non-profile sources, which is semantically correct (`source_name` for RSS is the publication, not a byline).
- **Merge `Keyword` and `Google` into a single enum value** — rejected. Brainstorm Key Decision: keep them distinct so `Tavily → Perplexity` becomes a one-line change without a taxonomy break.
- **Backfill historical rows** — rejected. Stephen's stated lean: forward-only. Consistent with the `category` regression approach (`project_category_regression_cause`). Historical `source` values are already dirty and will age out naturally.
- **Accept any string at the webhook and rely on upstream enforcement** — rejected. The current bug happened precisely because no layer enforced the enum. Belt + braces: Zod enum at the webhook + CHECK constraint at `classifier.articles` + Pydantic `Literal` at `ArticleResponse`.

## System-Wide Impact

### Interaction Graph

`SearchRequest` (n8n → content-sourcing) → handler `ArticleResponse` construct → `/search/batch` response → n8n `Deduplicated Articles` → `ClassifyViaRelevanceService` HTTP node → article-classifier `POST /classify` (Pydantic parse) → classifier ingest upsert to `classifier.articles` → classifier trigger that fires the outbox producer (if present) OR explicit call in `/classify` handler → `build_payload` in `dashboard_sync.py` → outbox row → outbox drainer → dashboard `POST /api/webhooks/ingest` → Zod parse → `ingestion.ts` insert → `public.articles` → explorer UI fetch via `articles.ts:29-130` → explorer page row render.

Two levels deep: the `/classify` upsert triggers the outbox producer, which serialises to `classifier.dashboard_sync_outbox`; a separate FastAPI lifespan-started drainer (see `syntech-article-classifier/app/main.py` — the outbox drainer wiring) polls and POSTs to the dashboard webhook. That drainer is where the field name persists once written; in-flight outbox rows from before Phase 2 lands will still carry the old `source` value. See "State Lifecycle Risks" below.

### Error & Failure Propagation

- **content-sourcing:** Pydantic `Literal` rejects bad `source` at construction → handler 500. No change.
- **n8n:** `author || null` guard in the new jsonBody line means upstream absence is not a failure. Downstream presence is validated by the classifier.
- **article-classifier `/classify`:** new `Literal[...]` on `source` rejects bad enum → 400 to n8n; n8n retries per existing retry policy. **Retry conflict risk:** if n8n retries the same bad payload, we'll log repeated 400s. Acceptable (workflow is disabled; we want loud signal during cutover).
- **classifier outbox drainer:** existing retry + dead-letter logic (present in `fix/dashboard-sync-cleanup` branch if merged — see sibling plan Phase 0). Not changed.
- **dashboard webhook:** new Zod enum on `source` → 400 on bad value → outbox drainer marks attempt as failed and retries. After N attempts (dead-letter threshold), the row stops being retried. No silent swallow.
- **dashboard ingest insert:** `public.articles.source` has no CHECK today; relying on Zod for the guarantee. (We could add a CHECK constraint on `public.articles.source` for belt-and-braces symmetry with `classifier.articles`; noted as Future Consideration, not required for this plan.)

### State Lifecycle Risks

- **Unprocessed outbox rows at Phase-2-deploy time** — if rows exist in `classifier.dashboard_sync_outbox` built by pre-Phase-2 code (payload already serialised with `source = source_name`), the drainer will send them after Phase 2 is live. Zod at Phase 1 will now reject them (enum violation), and they'll dead-letter. This is a **feature, not a bug**: those rows carry the corrupt value; rejecting them prevents further pollution. Operational note: before Phase 2 deploys, query `SELECT count(*) FROM classifier.dashboard_sync_outbox WHERE attempts = 0`; if non-zero, let the drainer flush them under the OLD code first (feature flag or scheduled deploy window), **or** accept that the handful of rows will dead-letter and manually triage.
- **In-flight n8n run at deploy time** — brainstorm says the workflow stays disabled throughout. This invariant must be enforced operationally. If Stephen re-enables it during Phase 2-4, an article could arrive at `/classify` without an `author` — acceptable per Phase 2 acceptance criteria (author is optional in the schema). It could also arrive with `source` as an author string — rejected by the new enum guard. Loud, not silent; acceptable.
- **`classifier.articles` rows pre-migration** — migration 0006 adds nullable columns; existing rows are unaffected. No backfill. Old rows simply have `source = NULL`, `author = NULL`. The outbox only ever reads rows inserted **after** ingest (each ingest call writes the row and enqueues its payload), so `source = NULL` on historical rows never reaches `build_payload`.

### API Surface Parity

- **content-sourcing** exposes `/search` **and** `/search/batch` — both use the same `ArticleResponse` model, so the `author` field ships on both. Phase 3 acceptance must exercise one of each (or rely on the shared model's Pydantic tests).
- **classifier** exposes only `/classify`; no other endpoint writes to `classifier.articles`. No parity surface to chase.
- **dashboard** exposes `/api/webhooks/ingest` only. No secondary writer. No parity surface.
- **Notion mapper** — brainstorm Scope Boundary: intentionally not updated. `author` does not flow to Notion in this plan. If future work adds it, the integration point is a separate workstream.

### Integration Test Scenarios

Unit tests with mocks won't catch these — add to the e2e-validation plan's script suite, not here:

1. **Keyword-fanout stamping** — a single keyword source returns articles from both legs; assert that AI-search-leg rows ship `source="Keyword"` and Google-fanout-leg rows ship `source="Google"` in the same response. (Catches a regression of the `keyword.py:106` re-stamp.)
2. **Profile-author round-trip** — a LinkedIn source with `source_name="Lubomila Jordanova"` flows through to `public.articles`; query asserts `source='LinkedIn' AND author='Lubomila Jordanova'`. (Catches outbox mis-keying and Zod regressions simultaneously.)
3. **Non-profile null-author round-trip** — an RSS source with `source_name="Biofuels International"` flows through to `public.articles`; query asserts `source='RSS' AND author IS NULL`. (Catches the "fall back to source_name" anti-pattern.)
4. **Enum-violation webhook reject** — hand-craft a webhook POST with `source="FooBar"`; assert 400 + Zod error details + no `public.articles` insert.
5. **Legacy in-flight outbox row** — insert a row into `classifier.dashboard_sync_outbox` with `payload.source = "Lubomila Jordanova"`; let the drainer run; assert it dead-letters, not success. (Catches the Phase-2-deploy state-lifecycle risk.)

## Acceptance Criteria

### Functional Requirements

- [ ] After cutover, every row of `public.articles.source` written by the pipeline is one of the seven platform enum values. No person names, no company names. (Verified by the Phase 5 SQL query.)
- [ ] LinkedIn / X / Instagram rows have `author` populated (matching the input `source_name`).
- [ ] RSS / Website / Keyword / Google rows have `author = NULL` (expected, not a defect).
- [ ] Historical rows written before the cutover are unchanged — no retroactive correction.
- [ ] `dashboard_sync.py:144` no longer references `source_name` when setting the webhook `source` field.
- [ ] `keyword.py:106` merge-boundary re-stamp is removed.
- [ ] Explorer UI renders `author` when present in the row expand.

### Non-Functional Requirements

- [ ] Zod webhook rejection latency unchanged (enum check is O(1)).
- [ ] Classifier ingest latency unchanged (one extra column written; negligible).
- [ ] No new external dependencies.

### Quality Gates

- [ ] All four repos' existing test suites pass on CI.
- [ ] Migration 0006 (classifier) and the Drizzle migration are reviewed and applied to prod Neon.
- [ ] Cross-repo PR sequencing respects the deploy order (Phase 1 → 2 → 3 → 4 → 5).

## Success Metrics

- **Primary:** 0 rows in `public.articles` with `source NOT IN (7-value enum)` after cutover, on a 24h observation window after the workflow is re-enabled.
- **Secondary:** 100% of LinkedIn/X/Instagram rows have non-null `author`; 100% of RSS/Website/Keyword/Google rows have null `author`.
- **Regression-catching:** at least one Zod 400 or classifier 400 observed in prod logs within the first cutover window (proves the guard is wired, not just asserted).

## Dependencies & Prerequisites

- **Branch-state hygiene (from the e2e-validation brainstorm R6 audit):** `syntech-article-classifier/fix/dashboard-sync-cleanup` and `fix/dashboard-sync-pool-resiliency` are non-contract resilience branches; safe to merge or defer, not blocking. The stale branches flagged in R6 are redundant and should be deleted **before** Phase 2 to avoid confusing the diff.
- **Neon access:** prod Neon branch is `br-broad-voice-ady830j1` on project `hidden-firefly-51918724` (single project, confirmed 2026-04-22 — see `project_next_session_check` §2 and the sibling plan's R6 findings). All three Railway services deploy from `main` of their respective repos.
- **n8n workflow stays disabled** throughout Phases 1-4. Re-enable only inside the Phase 5 bounded-window check.
- **No blocking external dependencies.**

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Deploy order violated (classifier sends `author` before dashboard accepts it) | Low | High (webhook 400, drainer dead-letters) | PR-level checklist; each phase's acceptance criteria gate the next; workflow disabled so traffic is zero |
| Pre-Phase-2 outbox rows dead-letter en-masse | Medium | Medium | Pre-deploy query `SELECT count(*) FROM classifier.dashboard_sync_outbox WHERE attempts = 0`; flush under old code or accept bounded dead-letter |
| `keyword.py:106` deletion regresses a test that expected the re-stamp | Low | Low | Local test run; adjust any tests that asserted the old (wrong) behaviour |
| Zod enum guard rejects a currently-flowing non-enum `source` value in stale traffic | Medium | Medium | Feature: we *want* this rejection, it's the contract. Monitor Vercel logs for 400 rate in the first 24h |
| Drizzle migration generated wrong (wrong name, missing column) | Low | Low | Review the generated SQL before applying; the project has done additive migrations before (see `project_next_session_check`) |
| R8 override exists somewhere **else** we missed | Low | High | Phase 5's per-source fixture run catches any residual override; acceptance is `0 non-enum rows` — would surface anywhere in the chain |

## Resource Requirements

- **Team:** single-engineer (Stephen) with agent assistance.
- **Time:** estimate 1–2 focused sessions (~4–6h total) — small code surface per phase, deploy coordination is the slow part.
- **Infrastructure:** existing Railway + Vercel + Neon, no new services.

## Future Considerations

- **Byline extraction for RSS/Website** — a separate workstream if attribution becomes useful for those sources (readability-based extraction, OpenGraph `article:author`, JSON-LD `author`). Not this plan.
- **Notion export of `author`** — if Stephen later wants `author` to flow into the Notion intel DB, extend the Notion mapper. Not this plan.
- **`public.articles.source` CHECK constraint** — belt-and-braces symmetry with `classifier.articles`. Low priority, can be added once the current contract has been stable for a cycle.
- **Backfill historical `author`** — if ever wanted, scope as its own workstream. The raw Apify / Notion snapshots still hold the profile `source_name` values for historical rows, so reconstruction is tractable but not trivial.

## Documentation Plan

- Update `syntech-content-sourcing/AGENTS.md` to reference the per-retrieval-path stamping rule (cross-link `feedback_source_vs_author`).
- Update `syntech-article-classifier/AGENTS.md` with the new column + enum-guard note.
- Update `syntech-intelligence-dashboard/AGENTS.md` with the Zod enum constant and the `author` column.
- No new docs under `docs/solutions/` until the plan ships — a post-ship compound writeup is the right surface (`/ce:compound`).

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-04-22-source-author-field-contract-requirements.md](../brainstorms/2026-04-22-source-author-field-contract-requirements.md). Key decisions carried forward:
  1. Keep the existing 7-value `source` enum; no new values; `Keyword` and `Google` stay distinct even under the Keyword-fanout path.
  2. `author` is input-derived (from `source_name`), not HTML-extracted. LinkedIn/X/Instagram only.
  3. Forward-only migration — nullable columns, no backfill of historical rows.

### Internal References

- Handler ArticleResponse construct sites: `syntech-content-sourcing/app/handlers/{linkedin,twitter,instagram,rss,website,google,keyword}.py`
- Keyword merge re-stamp bug: `syntech-content-sourcing/app/handlers/keyword.py:106`
- Outbox payload mis-keying: `syntech-article-classifier/app/dashboard_sync.py:119,144`
- Classifier schema (missing `source` column): `syntech-article-classifier/migrations/versions/0001_initial_schema.py:24-56`
- Dashboard Zod schema: `syntech-intelligence-dashboard/src/lib/validations/webhook.ts:15-27`
- Dashboard Drizzle schema: `syntech-intelligence-dashboard/src/lib/db/schema/articles.ts:13-47`
- Dashboard ingest service: `syntech-intelligence-dashboard/src/lib/services/ingestion.ts:24-63`
- Dashboard explorer select: `syntech-intelligence-dashboard/src/lib/actions/articles.ts:114-125`
- n8n classifier POST node: `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts:~3057`

### Cross-cutting memory

- `feedback_source_vs_author` — per-retrieval-path stamping, not per-handler
- `feedback_output_fields_are_schema` — output fields propagate; explicit approval required
- `project_category_regression_cause` — forward-only migration precedent
- `project_next_session_check` — Neon / Railway deployment topology confirmed 2026-04-22

### Related Work

- Sibling plan (blocked on this one): [docs/plans/2026-04-22-002-feat-sourcing-e2e-validation-plan.md](2026-04-22-002-feat-sourcing-e2e-validation-plan.md)
- Prior classifier cutover: [docs/plans/2026-04-15-001-feat-article-classifier-microservice-plan.md](2026-04-15-001-feat-article-classifier-microservice-plan.md)
- Prior biofuel-relevance cutover: [docs/plans/2026-04-15-002-feat-biofuel-relevance-classifier-microservice-plan.md](2026-04-15-002-feat-biofuel-relevance-classifier-microservice-plan.md)
- Content-sourcing microservice plan: [docs/plans/2026-04-21-001-feat-content-sourcing-microservice-plan.md](2026-04-21-001-feat-content-sourcing-microservice-plan.md)

---

## Appendix A — Cross-Repo Enum Governance

The 7-value `source` enum lives in **four** locations with no single source of truth. Drift between them is the failure mode this plan is trying to eliminate; the goal of this appendix is to make drift *observable*, not to eliminate it (codegen across four stacks is a heavier lift than warranted).

### Canonical locations (post-cutover)

| Repo | File | Shape |
|---|---|---|
| `syntech-content-sourcing` | `app/models.py:53` | Pydantic `Literal["RSS","LinkedIn","Instagram","X","Website","Google","Keyword"]` |
| `syntech-article-classifier` | `migrations/versions/0006_…py` + model | Postgres `CHECK (source IN (...))` + Pydantic `Literal[...]` inside `_parse` |
| `syntech-intelligence-dashboard` | `src/lib/validations/webhook.ts` | Zod `z.enum(PLATFORM_VALUES)` where `PLATFORM_VALUES = [...] as const` |
| `syntech-n8n-as-code` | `docs/contracts/source-author-field.md` (new) | Markdown spec — human reference |

### Hash-pin drift test (per repo)

Add one trivial test per stack. Each test computes `sha256(sorted(values).join(","))` and compares to a constant. Updating the enum = recomputing the hash across 3 repos in the same PR sequence. Catches accidental divergence on CI without building a generator.

```python
# syntech-content-sourcing/tests/test_source_enum_pin.py
import hashlib
from app.models import ArticleResponse
def test_source_enum_hash():
    vals = sorted(ArticleResponse.model_fields["source"].annotation.__args__)
    assert hashlib.sha256(",".join(vals).encode()).hexdigest()[:12] == "EXPECTED_HEX"
```

```typescript
// syntech-intelligence-dashboard/src/lib/validations/__tests__/platform-values.test.ts
import { PLATFORM_VALUES } from "../webhook";
import { createHash } from "node:crypto";
test("platform enum pin", () => {
  const h = createHash("sha256").update([...PLATFORM_VALUES].sort().join(",")).digest("hex").slice(0, 12);
  expect(h).toBe("EXPECTED_HEX");
});
```

```python
# syntech-article-classifier/tests/test_source_enum_pin.py — same shape
```

Compute the hex once during Phase 1 and commit to all three test files as the same literal. Changing the enum = 3 synchronised PRs + 1 doc update, visible in CI.

### Canonical reference doc

New file `syntech-n8n-as-code/docs/contracts/source-author-field.md` — single-page reference with: the 7 values, the author-population table (R2), the source-stamping rule (per-retrieval-path), and pointers to the 4 enforcement sites. Referenced from each repo's `AGENTS.md`.

---

## Appendix B — Runbook: Adding a New Source Value

Addresses the implicit "what if we add Reddit / Perplexity / …" question. Mirrors the deploy order exactly.

1. **Write the spec first.** Append the value to `docs/contracts/source-author-field.md` with author-field semantics (profile? publication? search topic?) and any handler notes.
2. **Dashboard first.** Extend `PLATFORM_VALUES` in `webhook.ts`; recompute the hash-pin; update the test; deploy.
3. **Classifier second.** Alembic migration `ALTER TABLE classifier.articles DROP CONSTRAINT source_check, ADD CONSTRAINT source_check CHECK (source IN (…new list…))`. Extend the Pydantic `Literal`. Recompute hash-pin. Deploy.
4. **Content-sourcing third.** Extend `ArticleResponse.source` `Literal`. Add the handler (or extend an existing one). Recompute hash-pin. Deploy.
5. **n8n fourth.** Usually no workflow change needed (the jsonBody is schema-agnostic), but if the new source needs a dedicated handler node, add it. Push disabled, then enable in the bounded-window check.
6. **Validate.** Run `validate-source-author-contract.sh` extended with a fixture for the new value.

Total steps = 4 deploys + 1 doc + 1 validation. Same pattern as this plan.

---

## Appendix C — Deployment Runbook

Per-phase pre-flight / deploy / post-verify. Each phase gates the next. Workflow stays disabled until Phase 5.

### Phase 1 — Dashboard

**Pre-flight:**
```bash
# Clean working tree on main
cd syntech-intelligence-dashboard && git status --porcelain && git rev-list --count @{u}..HEAD
# Confirm Neon branch target
echo "$DATABASE_URL_DIRECT" | grep -q 'hidden-firefly-51918724' || echo "WRONG PROJECT"
```

**Deploy:**
```bash
# Generate migration
pnpm drizzle-kit generate
# Inspect the generated SQL — additive ALTER only, no drops
cat drizzle/00XX_*.sql
# Apply against prod
DATABASE_URL="$DATABASE_URL_DIRECT" npx drizzle-kit migrate
# Push code (Vercel auto-deploys from main)
git push origin main
```

**Post-verify:**
```sql
-- Neon SQL editor or psql
\d public.articles      -- author text NULL should be present
SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'author';
-- Webhook smoke test
curl -X POST https://<dashboard>/api/webhooks/ingest \
  -H "Authorization: Bearer $DASHBOARD_WEBHOOK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":"FooBar",...}' # expect 422 + Zod error
```

### Phase 2 — Classifier

**Pre-flight:**
```sql
-- Must be < 100 before deploying, or flush under old code first
SELECT count(*) FROM classifier.dashboard_sync_outbox
 WHERE attempts = 0 AND delivered_at IS NULL;
```

**Deploy:**
```bash
cd syntech-article-classifier
# Migration — DIRECT endpoint, not pooler
DATABASE_URL="$DATABASE_URL_DIRECT" alembic upgrade head
# Push code (Railway auto-deploys from main)
git push origin main
# Wait for /readyz green on Railway
curl -s https://<classifier>/readyz | jq .status
```

**Post-verify:**
```sql
\d classifier.articles  -- source TEXT with CHECK, author TEXT NULL
-- Confirm no legacy rows leak
SELECT source, count(*) FROM classifier.articles GROUP BY source;
-- CHECK enforces on insert
INSERT INTO classifier.articles (..., source) VALUES (..., 'FooBar');  -- should ERROR
```

### Phase 3 — Content-sourcing

**Pre-flight:**
```bash
cd syntech-content-sourcing && git status --porcelain
# Run local handler tests — per-leg stamping must pass
pytest tests/handlers/test_keyword.py -v
```

**Deploy:**
```bash
git push origin main
# Wait Railway /readyz green
curl -s https://<content-sourcing>/readyz
```

**Post-verify:**
```bash
# Hit /search/batch with a LinkedIn fixture
curl -s -X POST https://<content-sourcing>/search/batch \
  -H "Authorization: Bearer $CONTENT_SOURCING_TOKEN" \
  -d @tests/fixtures/linkedin-one-source.json \
  | jq '.articles[0] | {source, author, source_name}'
# Expect: source="LinkedIn", author="<person name>", source_name=same
```

### Phase 4 — n8n workflow

**Pre-flight:**
```bash
cd syntech-n8n-as-code
# (a) Clean tree
git status --porcelain
# (b) Confirm workflow is actually disabled in n8n UI (not just the file)
npx n8nac pull  # pull to reconcile
grep '"active"' "workflows/.../News Sourcing Production (V2).workflow.ts"
# Must be false before push, OR accept that push will rewrite it
# (c) No upstream commits ahead
git rev-list --count @{u}..HEAD  # must be 0
```

**Deploy:**
```bash
npx n8nac validate
npx n8nac push --dry-run  # review diff
npx n8nac push
git add -A && git commit -m "feat(workflow): thread author through ClassifyViaRelevanceService"
git push origin main
```

**Post-verify:** open the n8n UI, inspect the `ClassifyViaRelevanceService` node's body, confirm `author` key present. Workflow remains disabled.

### Phase 5 — Cutover validation

Per the plan's Phase 5 section. Run `validate-source-author-contract.sh`, then open the workflow in n8n for a bounded window (one source per platform), run the prod SQL query, re-disable.

---

## Appendix D — Rollback Procedures

Per-phase undo. Each is independent; you can roll back any phase without touching the others because the changes are additive.

### Phase 1 rollback (trivial)
```sql
-- Only if Phase 2+ has not shipped
ALTER TABLE public.articles DROP COLUMN author;
```
Plus: revert the webhook + ingest + UI commits. Zod `source` revert = `z.string()` if you need to accept anything again (you don't — enum guard is desired).

### Phase 2 rollback
```bash
# Alembic downgrade
cd syntech-article-classifier
DATABASE_URL="$DATABASE_URL_DIRECT" alembic downgrade -1
```
`dashboard_sync.py:144` revert is a git revert. Any outbox rows written between deploy and rollback will carry the new shape; pre-Phase-1-rollback dashboard will reject them → dead-letter. Accept or manually triage.

### Phase 3 rollback
Git revert the handler commits. No DB state to unwind. `ArticleResponse.author` removal is a one-line delete.

### Phase 4 rollback
```bash
# Either: pull the pre-Phase-4 workflow file from git history and push
git show HEAD~1:"workflows/.../News Sourcing Production (V2).workflow.ts" > /tmp/prev.ts
# Or: edit the jsonBody to drop the author line, then push
npx n8nac push
```

### Phase 5 rollback
Disable the workflow in n8n (UI toggle). No code rollback needed — the validation script is idempotent.

---

## Appendix E — PII Footprint

`author` is real-person-name PII (LinkedIn / X / Instagram profiles). Retention + deletion surface spans:

| Location | What lives there | Deletion surface |
|---|---|---|
| `public.articles.author` (Neon `hidden-firefly-51918724` branch `br-broad-voice-ady830j1`) | Persisted author names on articles | `UPDATE public.articles SET author = NULL WHERE author = ?` |
| `classifier.articles.author` (same Neon project, different schema) | Persisted on classifier side | `UPDATE classifier.articles SET author = NULL WHERE author = ?` |
| `classifier.dashboard_sync_outbox.payload` (JSONB) | Transit-only, typically purged by drainer within minutes | Retained rows after dead-letter persist indefinitely; manual purge required |
| Structlog output on Railway stdout | If `author` is included in log context | **Mitigation:** add `author` + `source_name` to `_SENSITIVE_KEYS` in `syntech-article-classifier/app/logging.py` before Phase 2 ships |
| n8n execution history | Full jsonBody captured per execution | Governed by n8n retention policy (`EXECUTIONS_DATA_PRUNE` / `EXECUTIONS_DATA_MAX_AGE`) |

### Deletion request runbook (if ever asked)

1. Identify profile name.
2. `UPDATE public.articles SET author = NULL WHERE author = '<name>';` (and/or `DELETE` if the whole row should go).
3. `UPDATE classifier.articles SET author = NULL WHERE author = '<name>';`
4. `DELETE FROM classifier.dashboard_sync_outbox WHERE payload::jsonb ->> 'author' = '<name>' AND delivered_at IS NULL;` (undelivered only — delivered rows are replicated into `public.articles` already).
5. Purge n8n executions via the UI or `n8n user-management:prune` — scope to the affected workflow + time window.
6. Structlog is forward-only; old logs age out per Railway retention.

No `/api/users/delete` style endpoint exists today. This is a manual procedure. Fine for current scale; revisit if GDPR SAR volume rises.

---

## Appendix F — Research Appendix

Framework docs + institutional learnings that grounded this plan. Keep for reference during execution; cross-link from per-phase notes.

### Framework documentation (as of 2026-04-22)

- **Drizzle ORM** — additive column migrations: `drizzle-kit generate` with `schema` pointing at `articles.ts`, then `drizzle-kit migrate`. No autorun on Vercel; migrate out-of-band against `DATABASE_URL_DIRECT`. See drizzle.team docs §Migrations.
- **Alembic 1.13+** — `op.add_column` on a `schema="classifier"` table takes the schema in the ALTER automatically. `op.create_check_constraint` is the right helper for the `source` CHECK; `op.drop_constraint` then `op.create_check_constraint` for rotate-in-place.
- **Zod v4** — `z.enum([...] as const)` is strictly typed from the const tuple. `z.string().nullable().optional()` is the right shape for a truly-optional string that may be explicit-null. `.superRefine` is the idiomatic place for cross-field validation (`LinkedIn|X|Instagram ⇒ author NOT NULL`).
- **Pydantic v2** — `Literal[...]` on a field gives 422 on enum violation for free when the enclosing request model is used with FastAPI. For stringified-JSON bodies, `Model.model_validate_json(raw)` is the lift-vs-hand-rolled-`json.loads` upgrade.
- **psycopg3 + pgbouncer** — `prepare_threshold=None` required; DDL via DIRECT endpoint. Already documented in `docs/solutions/2026-railway-python-service.md`.
- **n8n-as-code** — `npx n8nac push` is file-level last-write-wins. Coordinate edits per `docs/solutions/2026-n8n-to-microservice-cutover.md`.

### Institutional learnings

- `docs/solutions/2026-n8n-to-microservice-cutover.md` — last-write-wins push semantics; `onError: 'continueErrorOutput'` is load-bearing.
- `docs/solutions/2026-railway-python-service.md` — pgbouncer DDL caveat; `/readyz` vs `/healthz` split.
- Memory: `feedback_source_vs_author` — per-retrieval-path stamping, not per-handler.
- Memory: `feedback_output_fields_are_schema` — never change handler output fields without approval.
- Memory: `project_category_regression_cause` — forward-only migration precedent.
- Memory: `project_next_session_check` — Neon/Railway topology confirmed 2026-04-22.

### Related 2025–2026 patterns worth knowing (not blocking this plan)

- **Postgres domain types** for enum-like constraints across tables in the same DB — alternative to per-table CHECK. Not adopted here because the two tables live in different schemas and the CHECK is trivial; domain types add migration ceremony without benefit at this scale.
- **Typed enums via codegen** (e.g. `sqlc`, `drizzle-zod`) — evaluated and rejected. Cross-stack (Python + TS + SQL + markdown) codegen is over-engineered for a 7-value enum. Hash-pin test (Appendix A) gives the same drift-detection with 3 lines per repo.

