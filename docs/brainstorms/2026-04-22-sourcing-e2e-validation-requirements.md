---
date: 2026-04-22
topic: sourcing-e2e-validation
---

# News Sourcing Production (V2) — End-to-End Curl Validation

## Problem Frame

Stephen's first run of the new "News Sourcing Production (V2)" workflow (live cutover of biofuel-relevance + article-classifier microservices) surfaced five failures in the final dashboard rows:

1. Articles >1 month old reached the dashboard.
2. Some articles landed with `published_at = NULL` (82/619 in the 2026-04-21 sample).
3. `public.articles.category` was NULL on every row written after the outbox cutover.
4. Some articles had `source="Google"` when they should have stayed `source="Keyword"` (post-fanout re-stamp).
5. Some articles had binary/garbled content (`��6QT…`) that broke readability but still persisted.

Before re-enabling the workflow, Stephen wants confidence — driven by reproducible curl tests — that each live microservice in the pipeline honours its output contract, that the keyword→AI-search+Google-search fanout preserves `source="Keyword"`, and that nothing drops fields or accepts garbage silently.

## Requirements

### In scope — 3 live decision services (curl contract tests per service)

- **R1. Content Sourcing (`POST /search/batch`)** — given a fixture `/search/batch` payload per handler, assert on every returned `ArticleResponse`:
  - R1.a. `source` equals the **platform / handler name** (`LinkedIn` / `Website` / `Tavily` / `RSS` / `Google` / `Keyword` / `Instagram` / `Twitter/X`). Not the downstream search engine used by a fanout, not the author, not the site brand. See `feedback_source_vs_author`.
  - R1.b. `source_name`, `source_category`, `title`, `url` are populated (output-schema fields; see `feedback_output_fields_are_schema`).
  - R1.c. `publication_date` is non-null OR the handler is on the explicit "undated-allowed" allowlist — no silent nulls.
  - R1.d. `publication_date`, when present, is within `max_age_days` of today.
  - R1.e. `content` is valid UTF-8 printable text above a minimum length (no binary/null-byte anti-bot gibberish).
  - R1.f. (NEW — depends on R7) `author` is populated when the extractor can resolve it, stored as the person or company byline, and **never** held in `source`. When the author cannot be resolved, `author` is null rather than falling back to source/publisher/domain.

- **R2. Keyword fanout (sub-case of R1)** — given a single keyword-source fixture, assert:
  - R2.a. Both the AI-search branch and the Google-search branch return results (neither silently empty).
  - R2.b. Post-merge, every returned article has `source="Keyword"` (not `"Google"` or `"AI"`).
  - R2.c. URLs present in both branches collapse to a single article (no within-response duplicates).

- **R3. Biofuel Relevance Classifier (`POST /classify`)** — given a fixture article payload (`title`, `content`, `url`, `source`, `source_category`, `summary`), assert:
  - R3.a. Response envelope is `{ "analysis": {...} }` and `.analysis.threshold_met` is a boolean.
  - R3.b. `.analysis.score` is a number and `.analysis.classifier_vote` is present (Phase-2 shadow-vote invariant — see `project_phase2_future_work` / `project_next_session_check` §6).
  - R3.c. The service does not strip or rename any passthrough fields the downstream stage will read.

- **R4. Article Classifier (`POST /classify`)** — given a fixture article payload (in the `{ "article": "<json string>" }` shape n8n sends), assert:
  - R4.a. Response returns a classification verdict (`new` / `update` / `repost`) plus the topic analysis fields (`topic_subject`, `topic_action`, `topic_entities`).
  - R4.b. `publication_date` is echoed back unchanged when present in input (no drop between classifier ingest and dashboard-sync outbox payload).
  - R4.c. `source` is echoed back unchanged (the keyword/google invariant holds through to the last hop).

- **R5. Cleanup + dataset reset validation** — the first full-pipeline run persisted old / garbled articles that a later run of `syntech-content-sourcing/scripts/cleanup_old_articles.py` was supposed to remove. The dashboard UI still surfaces some of those articles even though Neon queries show `0 rows` for the matching title — so the cleanup is either incomplete, or the UI is reading from a surface the cleanup doesn't touch. Validate end-to-end, not just "the script ran without errors":
  - R5.a. After running the cleanup with a fixed `--cutoff` date, no row in `public.articles` has `published_at < cutoff` (or whatever age rule the script uses) — confirmed by a SQL query against Neon.
  - R5.b. No row in `public.articles` has binary / non-UTF-8-printable `content` (catches the garbled-text survivors); if any remain, the cleanup heuristic needs widening.
  - R5.c. The archive table (`public.cleanup_archive_*`) contains the removed rows, and `INSERT INTO public.articles SELECT * FROM <archive>` would fully reverse the operation — reversibility invariant.
  - R5.d. The intelligence dashboard UI no longer surfaces any of the archived articles after a forced revalidation (or a browser reload with cache bypass). If the UI keeps surfacing them, R5.d fails and the investigation in the Deferred question below is load-bearing.
  - R5.e. `classifier.articles` is consistent with `public.articles` for the cleanup window — no orphan rows referencing an archived id (see `project_next_session_check` §4 on the `ck_new_classified_against` FK).
  - R5.f. (NEW — 2026-04-22 finding) The cleanup script catches **rows with `published_at IS NULL`** as well as rows past the age cutoff. Stephen confirmed manually deleting NULL-`published_at` rows resolved the dashboard "ghost article" issue; the underlying script bug is almost certainly a `WHERE published_at < cutoff` clause that SQL tri-valued logic silently excludes NULL rows from. Fix: the script must also match `published_at IS NULL` (either as a separate pass, or via `WHERE published_at < cutoff OR published_at IS NULL`), with an explicit flag so null-dated rows aren't accidentally purged when the underlying bug is instead "a valid article lost its date upstream." Until this is fixed, the test suite should at minimum assert "no rows in `public.articles` have `published_at IS NULL`" and fail loud.

- **R6. Branch-state + deployment-provenance audit (prerequisite to all other Rs)** — Stephen flagged 2026-04-22 that he has in-flight feature branches across multiple repos and is not sure what's merged. **Audit completed 2026-04-22 (findings embedded below).** The audit confirms this is load-bearing: `syntech-article-classifier` has unmerged contract-level changes (label rename `unique` → `new` + CHECK-constraint drop), meaning no contract test against that service is meaningful until deployment provenance is clarified. Audit scope / assertions, per repo (`syntech-content-sourcing`, `syntech-article-classifier`, `syntech-biofuel-relevance-classifier`, `syntech-intelligence-dashboard`):
  - R6.a. Inventory of open branches, open PRs, and un-merged commits vs. `main` — for each, is the work complete, in review, or abandoned?
  - R6.b. For each Railway-deployed service: which branch / commit is actually running in production? Cross-check against `main` HEAD.
  - R6.c. For the Vercel-deployed dashboard: which Vercel branch deploys to the URL Stephen was viewing when he saw the "ghost" article? Which Neon branch does that Vercel deploy use? (Likely the source of the `ep-bold-recipe-adnk5m8k` vs `hidden-firefly-51918724` mismatch in the R5.d finding.)
  - R6.d. For any branch with unmerged contract-changing commits (label renames, constraint changes, schema migrations), flag explicitly — these need either a merge decision or a revert decision before testing proceeds.
  - R6.e. Produce a one-page branch-state map committed to `docs/testing/sourcing-e2e/branch-state-2026-04-22.md` that pins down, per repo: current `main` head, current deployed commit, open branches with summaries, and any merge/revert actions required.

  **2026-04-22 audit findings (first pass — Explore):**
  - `syntech-content-sourcing` — `main` HEAD `0637bf2` (21 Apr). Clean. No unmerged branches. Railway deploys from main via GitHub webhook.
  - `syntech-article-classifier` — `main` HEAD `320638f` (16 Apr, docs-only commit). **Contract drift on `feat/outbox-drainer` (6 commits, CANNOT auto-merge):** classifier label rename `unique` → `new` (`caaa9d6`), CHECK constraint drop (`1b108b3`, migration 0004), outbox producer (`22dcf7e`), outbox drainer + lifespan (`22bd666`), backfill script (`7611e02`), main-merge attempt (`019928c`). Also on the shelf: `fix/dashboard-sync-cleanup` +4 (dead-letter logic), `fix/dashboard-sync-pool-resiliency` +4 (Neon pooler idle-timeout guard). Railway deploy source unknown from files alone.
  - `syntech-biofuel-relevance-classifier` — `main` HEAD `f13caff` (15 Apr). Low-risk drift: `fix/retrieval-pooler-search-path` +1 (drops Neon-pooler-rejected `search_path` option). Railway deploys from main.
  - `syntech-intelligence-dashboard` — `main` HEAD `4e68078` (16 Apr, neon-http → neon-serverless Pool swap for transaction support, PR #15). Unmerged: `feat/classification-columns` +1 (accept classification fields on webhook — minor schema extension), `feat/news-intelligence-platform` (orphan, Initial-commit-only — delete), `fix/dashboard-pool-max-connections` +1 (Pool max=1 for Vercel sandbox). Audit found NO Vercel-Neon preview-branch integration — the `ep-bold-recipe-adnk5m8k` endpoint is likely a standalone prod Neon project, not a per-branch preview.

  **Tension vs. memory to resolve in planning:** `project_next_session_check` claims `27b4012` ("fix(classifier): dashboard sync cleanup (P2/P3 bundle)") is on `main` and is "where category stopped writing." Audit says `main` HEAD is `320638f` and `27b4012` is NOT on main. Either memory is stale, Railway is deploying from a feature branch, or the category-NULL bug has a different cause than the memory claims. Planner must reconcile before writing assertions that depend on what's running in prod.

  **2026-04-22 second-pass verification (Stephen + git log of `main`):**
  - ✅ All three Railway services deploy from `main` (Stephen confirmed via Railway dashboard).
  - ✅ Neon is a single project — `hidden-firefly-51918724` (project ID) and `ep-bold-recipe-adnk5m8k` (primary compute endpoint on the `main` branch `br-broad-voice-ady830j1`) are the same underlying DB. Neon console surfaces them under different identifiers. No Vercel-preview-branch isolation in play.
  - ✅ `feat/outbox-drainer` and its label/producer sub-branches are **stale redundant copies of already-merged work**, not in-flight feature drift. Running `git log main --oneline` shows PRs #1 (`f21a1b3` label rename `unique` → `new`), #2 (`83628a5` CHECK drop), #5 (`50a6f4b` outbox producer), #6 (`92fc02d` outbox drainer + lifespan), #7 (`af99d1c` P1 follow-ups), #9 (`27b4012` P2/P3 cleanup) are all on `main`. Audit's first-pass claim of "contract drift" was wrong — `main` is the production contract. Safe to delete: `feat/outbox-drainer`, `origin/feat/label-rename-contract`, `origin/feat/label-rename-expand`, `origin/feat/outbox-producer`.
  - ⚠️ **Two article-classifier branches contain genuine unmerged production-hardening work** (not contract drift — no API shape changes):
    - `fix/dashboard-sync-cleanup` (4 commits): dead-letter past 50 attempts, dedupe backoff, 3xx-as-permanent-failure, stale-fixture-label test, pool-wait delta logging.
    - `fix/dashboard-sync-pool-resiliency` (4 commits): Neon pooler idle-drop guard, periodic stale-lock sweep, 0003 migration downgrade guard, enqueue-failure rollback test.
    - These are resilience features for the already-merged outbox drainer. Not test-blocking. Separate merge decision.
  - **Memory `project_next_session_check` is now stale** on the point "syntech-article-classifier (main)" only listing `27b4012` — the fuller list is on main as of this audit. Update or supersede when the current session's memory is refreshed.

  **Immediate actions implied by the audit (ordered):**
  1. ✅ Confirmed: Railway deploy source = main for all three services.
  2. ✅ Confirmed: `ep-bold-recipe-adnk5m8k` and `hidden-firefly-51918724` are the same Neon project.
  3. Delete the 4 stale branches: `feat/outbox-drainer`, `origin/feat/label-rename-contract`, `origin/feat/label-rename-expand`, `origin/feat/outbox-producer`.
  4. Decide on the 2 genuine unmerged hardening branches: `fix/dashboard-sync-cleanup` and `fix/dashboard-sync-pool-resiliency` — both look like safe merges, non-contract.
  5. Low-risk: merge `syntech-biofuel-relevance-classifier/fix/retrieval-pooler-search-path`.
  6. Low-risk: merge `syntech-intelligence-dashboard/feat/classification-columns` + `fix/dashboard-pool-max-connections`; delete orphan `feat/news-intelligence-platform`.
  7. Proceed to R7 (field contract fix) and then R1-R5 contract tests.

## Success Criteria

- A repeatable shell script per service under `docs/testing/sourcing-e2e/` produces a green/red verdict (exit code + human-readable diff) against the live Railway service using Stephen-provided fixtures.
- Every failure mode from the first run has at least one assertion that would catch a regression of it: old-article leak → R1.d / R5.a, missing `published_at` → R1.c, source rename → R1.a + R2.b, garbled content → R1.e / R5.b, missing category → noted as out-of-scope here (covered by R4 assertions on `topic_*` fields + a planning deferral on the dashboard-sync side).
- Re-running the suite after any content-sourcing or classifier change takes <5 minutes and requires no manual inspection for the "did anything regress?" question.
- After R5 runs, the dashboard UI has no "ghost" articles — what's in `public.articles` is exactly what the UI shows (no stale cache, no reads from an untracked surface).

## Scope Boundaries

- **Not in scope:** semantic-dedup contract tests (no known bug traced to it; add later if a regression appears).
- **Not in scope:** fixing the bugs themselves. This work produces tests + a confidence report. Separate `/ce:plan` runs will own any fixes surfaced.
- **Not in scope:** assertions on the dashboard webhook write path (i.e. inspecting a freshly-inserted `public.articles` row right after a `/classify` call). The `category=NULL` regression lives there and is already diagnosed (see `project_category_regression_cause`) — tracked as a Deferred question.
- **In scope via R5:** `public.articles` read-side state after cleanup (old rows gone, garbled content gone, archive consistent) plus a dashboard-UI revalidation check. This is distinct from the webhook write-path assertions above.
- **Not in scope:** full n8n workflow execution. We are testing services via direct curl, not by triggering the n8n workflow end-to-end. Stephen will re-enable n8n only after these tests pass.
- **Not in scope:** automated CI wiring. Tests are manual/local first; CI is a later concern.

## Key Decisions

- **Stage-by-stage contract tests, not single end-to-end replay.** Rationale: each failure class has a clear suspect stage; contract tests localise blame instantly and can be re-run in isolation after a targeted fix. The "feed real URLs through the whole chain" approach is deferred — useful later, lower-leverage now.
- **Per-stage JSON fixtures provided by Stephen.** Rationale: Stephen will hand over realistic payloads that target the known failure modes (one keyword-source, one garbled-content URL, one BBC/dated feed, etc.). Synthesised fixtures wouldn't stress the right paths.
- **Assertions written as `jq` expressions + bash exit codes.** Rationale: simplest reproducible surface — no test framework dependency, runnable from any repo, output readable in a terminal.
- **Keyword fanout tested as R2 (sub-case of content-sourcing), not a separate service.** Rationale: the fanout is logic inside content-sourcing; testing it at the `/search/batch` boundary is where the output contract is defined.

## Dependencies / Assumptions

- Stephen has Railway bearer tokens for all three services locally (they are already wired into the n8n workflow, so same secrets will work for curl).
- All three Railway services are healthy / deployed and reachable from Stephen's machine.
- Fixtures will be committed under `docs/testing/sourcing-e2e/fixtures/` so the suite is re-runnable without re-asking Stephen for inputs.

## Outstanding Questions

### Resolve Before Planning

_All three previously-blocking questions resolved 2026-04-22 — see R6 findings:_

- ✅ **Railway deploy source:** all 3 services deploy from `main` (Stephen, Railway dashboard).
- ✅ **Neon identity:** `ep-bold-recipe-adnk5m8k` is the primary compute endpoint on the `main` branch of project `hidden-firefly-51918724` — single project, same DB surfaced under two identifiers. (Stephen, Neon console screenshot.)
- ✅ **Stale-branch resolution:** `feat/outbox-drainer` and its label/producer sub-branches are redundant copies of already-merged PRs (#1/#2/#5/#6/#7/#9). Safe to delete. Two other branches (`fix/dashboard-sync-cleanup`, `fix/dashboard-sync-pool-resiliency`) hold legitimate resilience work but are non-contract; not test-blocking.
- ✅ **R5.d "ghost articles" root cause:** NOT a caching or wrong-DB issue. The cleanup script's `WHERE published_at < cutoff` clause silently skipped rows with `NULL published_at` (SQL tri-valued logic). Stephen manually deleted those rows; prod UI now matches DB. **Script bug itself is still unfixed** — tracked as R5.f.

### Deferred to Planning

- [Affects R4][User decision] Does the article-classifier contract test need to inspect the `classifier.dashboard_sync_outbox` table (requires Neon access), or is testing just the `/classify` HTTP response enough? (If outbox inspection is in scope, the `category=NULL` regression from `dashboard_sync.py:150` can be asserted here.)
- [Affects R1.d][Technical] What's the actual `max_age_days` contract per handler? RSS enforces it; Google/Tavily/Twitter/LinkedIn may not. Planner should read each handler to confirm the default and capture it in the fixture expectation.
- [Affects R1.e][Needs research] What's the right minimum content length / printable-char ratio threshold? Probably lifted from `validate_content()` in content-sourcing; planner should check the current thresholds and whether they need tightening.
- [Affects R3.b][Technical] If the shadow-vote check (`classifier_vote` in `analysis_blob`) is already broken on Railway, R3.b will fail on day one — that's a bug, not a test artefact. Planner should verify shadow-vote is actually firing before writing the assertion (see `project_next_session_check` §6).
- [Affects R2][User decision] Stephen will need to provide (or confirm) a keyword fixture that historically triggered the `source="Google"` rename, so we know the assertion actually exercises the bug path.
- [Affects R5.d + R6.c][Likely root cause — 2026-04-22 Explore + Stephen's branch-state flag] **Dashboard UI and Neon console are pointing at different Neon instances — and this is probably a Vercel-Neon preview-branch artefact, not a bug.** Explore of `syntech-intelligence-dashboard` confirmed:
  - Dashboard reads `public.articles` directly via Drizzle with **zero app-level caching** (no ISR, no `unstable_cache`, no React Query stale windows — `src/app/[vertical]/explorer/page.tsx` + `src/lib/actions/articles.ts:29-187`). So caching is **ruled out**.
  - No view, no join to `classifier.articles`, no Notion/seed fallback, no background re-inserter. One table, one query. All other hypotheses are **ruled out**.
  - **The app's runtime `DATABASE_URL` points at endpoint `ep-bold-recipe-adnk5m8k-pooler.c-2.us-east-1.aws.neon.tech/neondb`** (from `syntech-intelligence-dashboard/.env.local`).
  - **Stephen's Neon console view was at project `hidden-firefly-51918724`, branch `br-broad-voice-ady830j1`** — a different compute endpoint, possibly a different project entirely.
  - Implication: the cleanup script almost certainly ran against whatever `DATABASE_URL` the content-sourcing repo uses, which may be a third distinct endpoint. Three repos, potentially three different Neon branches.
  - **New hypothesis (strongest):** Vercel's Neon integration creates a per-git-branch Neon DB branch for every preview deploy. The URL Stephen was viewing when he saw the "ghost" article may be a Vercel preview URL tied to an in-flight feature branch (see R6.c), meaning that deploy reads from a Neon branch that was never touched by the cleanup — which ran against the `main`-branch (or content-sourcing-branch) Neon DB. This would make the "ghost" an artefact of preview isolation, not a real data leak.
  - **Planner action:** (1) resolve R6 first — the branch-state audit will reveal which Vercel branch Stephen was viewing and which Neon branch it uses; (2) compare `DATABASE_URL` across all repos' `.env*` files; (3) decide whether the cleanup needs re-running against the preview branch too, or whether the preview branch will be garbage-collected when the feature merges; (4) add an invariant — after merges settle, all three services' `DATABASE_URL`s should resolve to the same Neon branch in prod.
- [Affects R5][User decision] What does "reset the data set correctly" mean operationally: re-run the existing cleanup with a wider cutoff, truncate `public.articles` entirely and re-seed from the classifier, or something more surgical? Depends on what the R5.d investigation finds.
- [Affects R5.b][Technical] The existing `cleanup_old_articles.py` was built around age, not garbled-content detection. If we want R5.b to be enforceable, the script needs a second pass (or a separate script) that detects non-UTF-8-printable content. Planner should scope whether to extend the existing script or write a sibling.

## Next Steps

Brainstorm is planning-ready. Three workstreams to sequence in `/ce:plan`:

1. **Field contract fix (prerequisite to R1-R5 tests):** new sibling brainstorm `/ce:brainstorm` — scope the `source` → platform restoration + new `author` column propagation across all four repos (content-sourcing handlers → classifier → outbox → dashboard schema + UI). Then `/ce:plan` from that brainstorm. Tracked as R7 below.
2. **Cleanup script fix (prerequisite to R5 tests):** small targeted fix — extend `scripts/cleanup_old_articles.py` to match `published_at IS NULL` as well as age-past-cutoff, with explicit flagging. R5.f covers the assertion side; this closes the hole.
3. **Contract tests (R1-R5, the core of this brainstorm):** `/ce:plan` once workstreams 1 and 2 have landed. Fixture files + per-service curl+jq scripts under `docs/testing/sourcing-e2e/`.

Plus housekeeping: branch hygiene (delete 4 stale branches in article-classifier, merge the 2 non-contract hardening branches, merge the biofuel pooler fix, merge the dashboard classification-columns + pool-max fixes, delete the orphan dashboard branch). None of these are test-blocking.

## R7. Field contract fix (sibling workstream, separate plan)

Scope for a new brainstorm + plan, not part of this testing brainstorm's implementation:

- Find the code path in content-sourcing that currently writes the article's author into `source`; restore `source` to the handler's platform name (`LinkedIn` / `Website` / `Tavily` / `RSS` / `Google` / `Keyword` / `Instagram` / `Twitter/X`).
- Add an `author` field to `ArticleResponse` (content-sourcing), propagate through the n8n workflow payload, classifier `/classify` input + `classifier.articles`, the outbox producer payload, the dashboard webhook payload + Zod schema, `public.articles` + Drizzle schema, and any UI read components.
- Migration for `public.articles`: `ADD COLUMN author TEXT` (nullable — some sources won't have an author).
- Backfill question (deferred): once the fix is live, do we backfill `author` for historical rows where we captured-but-mis-routed, or leave them null and let the fix take effect forward-only? Likely forward-only given cleanup has already churned historical data.

See `feedback_source_vs_author` memory for the full rationale and the pattern to avoid.
