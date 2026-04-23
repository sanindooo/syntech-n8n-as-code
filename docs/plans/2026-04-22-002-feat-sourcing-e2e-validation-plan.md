---
title: News Sourcing Production (V2) — End-to-End Curl Validation Suite
type: feat
status: active
date: 2026-04-22
origin: docs/brainstorms/2026-04-22-sourcing-e2e-validation-requirements.md
blocked_by: docs/plans/2026-04-22-001-feat-source-author-field-contract-plan.md
---

# News Sourcing Production (V2) — End-to-End Curl Validation

## Overview

Build a suite of reproducible curl+jq contract tests — one per live Railway microservice — that catches the five failure modes from the first "News Sourcing Production (V2)" run and any regression of them. Fixtures + scripts live under `docs/testing/sourcing-e2e/`. Tests hit live Railway services with Stephen-provided fixtures and produce a green/red verdict with a human-readable diff. Re-running the suite takes <5 minutes and requires no manual inspection.

**Blocking dependency:** R1.a (source = platform enum) and R1.f (author assertion) cannot be written until the [source/author field contract plan](2026-04-22-001-feat-source-author-field-contract-plan.md) has shipped through prod — that plan adds the `author` field, fixes the dashboard_sync override, and restores `source` to the 7-value enum. This plan executes **after** plan 001.

**Also includes** (Phase 0): a targeted fix to `scripts/cleanup_old_articles.py` so R5.a and R5.f can pass. The cleanup script's `WHERE published_at < cutoff` clause silently excludes NULL rows; it needs an explicit `OR published_at IS NULL` pass with a flag.

## Problem Statement / Motivation

Stephen's first run of the new "News Sourcing Production (V2)" workflow (live cutover of biofuel-relevance + article-classifier microservices) surfaced five failures in the final dashboard rows:

1. Articles >1 month old reached the dashboard.
2. Some articles landed with `published_at = NULL` (82/619 in the 2026-04-21 sample).
3. `public.articles.category` was NULL on every row written after the outbox cutover (diagnosed — `dashboard_sync.py:150` hardcodes `category: None`; see `project_category_regression_cause`).
4. Some articles had `source="Google"` when they should have stayed `source="Keyword"` (post-fanout re-stamp — being fixed by plan 001).
5. Some articles had binary/garbled content (`��6QT…`) that broke readability but still persisted.

Before re-enabling the workflow, Stephen wants confidence — driven by reproducible curl tests — that each live microservice honours its output contract, that the keyword→AI-search+Google-search fanout preserves `source="Keyword"` where appropriate, and that nothing drops fields or accepts garbage silently. Current confidence is too low: the first run's five failures were discovered in prod data, not in tests.

## Proposed Solution

Per-service curl+jq contract tests, backed by Stephen-provided fixtures, producing green/red verdicts with readable diffs. Organized as:

- `docs/testing/sourcing-e2e/fixtures/` — JSON fixtures per source type and per service.
- `docs/testing/sourcing-e2e/scripts/` — one bash script per service + a top-level `run-all.sh`.
- `docs/testing/sourcing-e2e/branch-state-2026-04-22.md` — the R6 branch-state map (already drafted in the brainstorm; finalise here).
- Cleanup script fix lives in `syntech-content-sourcing/scripts/cleanup_old_articles.py` — single targeted edit, not a rewrite.

No test framework dependency; bash + jq + curl only.

## Technical Considerations

### Architecture

Tests are **stage-local**, not end-to-end replay. Each script:

1. Loads a fixture JSON.
2. Curls the live Railway service (auth via Stephen's existing bearer token, read from `$HOME/.config/syntech/railway-tokens` or an env var — decide during scripting).
3. Pipes the response through `jq` to assert contract invariants.
4. Prints a unified diff if any assertion fails; exits non-zero.

Why stage-local over end-to-end replay: each failure class has a clear suspect stage; contract tests localise blame instantly. Full-chain replay is deferred.

### Railway + Neon topology (confirmed 2026-04-22)

- All three services deploy from `main` of their respective repos (Stephen, Railway dashboard).
- Single Neon project `hidden-firefly-51918724`; the `main` branch `br-broad-voice-ady830j1` exposes primary compute endpoint `ep-bold-recipe-adnk5m8k`. The endpoint-vs-project naming confusion behind the R5.d "ghost article" hypothesis is a Neon console UX artefact, not distinct databases.
- No Vercel per-branch Neon preview isolation is in play (audit confirmed).

### Contract invariants per service

Per the brainstorm:

**R1. Content Sourcing (`POST /search/batch`)** — per `ArticleResponse`:
- R1.a. `source ∈ {RSS, LinkedIn, Instagram, X, Website, Google, Keyword}` (depends on plan 001 Phase 2/3).
- R1.b. `source_name`, `source_category`, `title`, `url` populated (non-empty).
- R1.c. `publication_date` non-null OR handler is on the undated-allowed allowlist (RSS undated-bypass is currently the documented allowance — cross-ref recent RSS work in `syntech-content-sourcing`).
- R1.d. `publication_date`, when present, within `max_age_days` of today (default 21; per-handler overrides honoured — see Phase 1 deliverables).
- R1.e. `content` valid UTF-8 printable, length ≥ current `validate_content` threshold (100 chars per `extraction.py:686-701`).
- R1.f. `author` populated for LinkedIn/X/Instagram, null for RSS/Website/Keyword/Google (depends on plan 001 Phase 3).

**R2. Keyword fanout** (sub-case of R1):
- R2.a. Both AI-search and Google legs return results (neither silently empty for a fixture with known hits).
- R2.b. Post-merge, articles are stamped per-retrieval-path: AI-search-leg = `Keyword`, Google-leg = `Google`. (Depends on plan 001 removing the `keyword.py:106` re-stamp.)
- R2.c. URLs present in both legs collapse to a single article (dedup works).

**R3. Biofuel Relevance Classifier (`POST /classify`)**:
- R3.a. Response envelope is `{ "analysis": {...} }`; `.analysis.threshold_met` is a boolean.
- R3.b. `.analysis.total_score` is a number; `.analysis.classifier_vote` path exists in the DB decision (shadow-vote invariant — assert post-call via a read from `classifier_relevance.decisions.analysis_blob` rather than the HTTP response, since the HTTP envelope doesn't expose it).
- R3.c. No passthrough field renaming that downstream depends on.

**R4. Article Classifier (`POST /classify`)**:
- R4.a. Response returns `classification ∈ {new, update, duplicate}`, plus `topic_subject`, `topic_action`, `topic_entities` (Pydantic `FactExtractionFlat` + `TopicalSignature` per `app/schemas.py:103-125`).
- R4.b. `publication_date` echoes through to the outbox payload unchanged (requires inspecting `classifier.dashboard_sync_outbox` — see Deferred Question resolution below).
- R4.c. `source` echoes through to the outbox payload unchanged (same inspection).

**R5. Cleanup + dataset reset validation** — SQL assertions on `public.articles` / `classifier.articles` post-cleanup (see Phase 0 for the script fix):
- R5.a. No row `WHERE published_at < cutoff`.
- R5.b. No row with binary / non-UTF-8-printable `content`.
- R5.c. Archive table contains the removed rows; `INSERT INTO public.articles SELECT * FROM <archive>` would reverse.
- R5.d. Dashboard UI no longer surfaces archived articles post-revalidation.
- R5.e. `classifier.articles` has no orphan referencing an archived id (`ck_new_classified_against` consistency).
- R5.f. Cleanup matches `published_at IS NULL` rows alongside age-past-cutoff rows (bug fix — see Phase 0).

## System-Wide Impact

- **Interaction graph:** tests are read-only (curl HTTP GET/POST against services + SQL SELECT against Neon) except for the cleanup script fix in Phase 0, which runs a destructive migration-like operation against `public.articles` (archive-and-delete). The cleanup script already has a `--dry-run` default; use it.
- **Error propagation:** each script exits non-zero on first failed assertion. `run-all.sh` aggregates exit codes and prints a final green/red summary.
- **State lifecycle risks:** fixtures must not pollute `seen_urls` in prod. Content-sourcing's `/search/batch` accepts `test_mode: true` per `SearchRequest.test_mode` (default `False`) — all test fixtures set `test_mode: true` so dedup is checked but URLs are not marked as seen. **Critical:** confirm with Stephen that `test_mode: true` does what we think before the first run. (If not, tests write prod state on every run.)
- **API surface parity:** content-sourcing has `/search` *and* `/search/batch`; tests target `/search/batch` since that's what n8n uses, but one Phase-1 smoke test should hit `/search` too to catch divergence.
- **Integration test scenarios:** see "Integration tests" in plan 001 for the five cross-layer scenarios; this plan's scripts are the mechanism that actually runs them.

## Acceptance Criteria

### Functional Requirements

- [ ] `docs/testing/sourcing-e2e/run-all.sh` exits 0 against live Railway when every invariant R1-R5 passes.
- [ ] Each failure mode from the first run has ≥1 assertion that would catch a regression:
  - Old-article leak → R1.d / R5.a
  - Missing `published_at` → R1.c
  - Source rename → R1.a + R2.b
  - Garbled content → R1.e / R5.b
  - Missing `category` → noted out-of-scope here (see Deferred Questions); covered by R4 topic-field presence + flagged for a separate fix
- [ ] Re-run time <5 minutes end to end.
- [ ] Post-R5 dashboard UI shows no ghost articles vs. the DB read.

### Non-Functional Requirements

- [ ] Scripts run from any repo checkout (path-independent; use `$(dirname "$0")` patterns).
- [ ] No secrets in fixtures or scripts; tokens read from env or an external config path.
- [ ] Each script's human-readable diff names the failing invariant (`R1.a`, `R2.b`, etc.) for fast triage.

### Quality Gates

- [ ] Phase 0 cleanup-script fix has its own test (a `--dry-run` run against a throwaway Neon branch with a seeded NULL-`published_at` row, asserting it would be archived).
- [ ] Scripts are idempotent — re-running doesn't pollute prod state (via `test_mode: true`).
- [ ] Branch-state map finalised at `docs/testing/sourcing-e2e/branch-state-2026-04-22.md`.

## Implementation Phases

Phases are numbered by execution order. Phase 0 ships first (and before the contract-test scaffolding) because R5 assertions depend on it. Phase 1-4 are parallelisable once Phase 0 lands.

### Phase 0 — Cleanup-script NULL-pub fix (R5.f prerequisite)

Deliverables:

- **Edit** `syntech-content-sourcing/scripts/cleanup_old_articles.py:409-421` to match NULL rows as well:
  - Current clause:
    ```sql
    DELETE FROM {schema}.{source}
    WHERE created_at >= %(created_after)s
      AND {pub} IS NOT NULL
      AND {pub} < %(cutoff)s
    ```
  - Replace with two-pass logic, behind an explicit CLI flag:
    - Pass 1 (existing): age-past-cutoff — unchanged.
    - Pass 2 (NEW): rows with `{pub} IS NULL` — gated by a new `--include-null-pub` flag, default **off** for safety, with `--dry-run` default preserved.
  - Add the new flag to `build_args()` at `scripts/cleanup_old_articles.py:112-178`. Help text: *"Also archive rows where published_at IS NULL. Use only after confirming upstream isn't dropping legitimate dates (see docs/brainstorms/2026-04-22-sourcing-e2e-validation-requirements.md R5.f)."*
  - The `archive_one()` helper (line 405 onwards) currently calls the `DELETE ... WHERE pub IS NOT NULL AND pub < cutoff` — extend it to accept a `null_pub: bool` parameter and emit the corresponding clause.
- **Test:** against a throwaway Neon branch (or a local Postgres container if the repo ships one), seed three rows:
  1. `published_at = '2025-11-01'` (pre-cutoff)
  2. `published_at = '2026-04-20'` (post-cutoff)
  3. `published_at = NULL`
  Run `--dry-run --include-null-pub --cutoff 2026-02-01`; assert rows 1 and 3 are listed for archive, row 2 is not.
- **R5.f fail-loud fallback assertion** — until the fix is live, the e2e test suite asserts:
  ```sql
  SELECT count(*) FROM public.articles WHERE published_at IS NULL;
  ```
  and fails if non-zero. Once Phase 0 lands, switch this to a cleanup-audit assertion (`after running cleanup with --include-null-pub, 0 rows remain`).

Acceptance:
- [ ] `--include-null-pub` flag merged; default off; help text references the brainstorm.
- [ ] Test run against a seeded DB passes.
- [ ] Archive table creation (`LIKE {schema}.{source} INCLUDING DEFAULTS` at line 272-274) still captures NULL-pub rows (it will — column definition is inherited).

### Phase 1 — Fixtures + directory scaffolding

Deliverables:

- **Directory layout** under `syntech-n8n-as-code/docs/testing/sourcing-e2e/`:
  ```
  docs/testing/sourcing-e2e/
  ├── README.md                         # how to run, what each test covers, token setup
  ├── branch-state-2026-04-22.md        # finalised R6 branch-state map
  ├── fixtures/
  │   ├── content-sourcing/
  │   │   ├── rss.json
  │   │   ├── linkedin.json
  │   │   ├── instagram.json
  │   │   ├── twitter.json
  │   │   ├── website.json
  │   │   ├── google.json
  │   │   ├── keyword.json              # triggers both AI-search + Google fanout legs
  │   │   └── batch-all.json            # one of each, for /search/batch smoke
  │   ├── biofuel-relevance/
  │   │   └── dated-article.json        # realistic title/content/url/source_category
  │   └── article-classifier/
  │       ├── fresh-article.json        # expects classification=new
  │       └── duplicate-article.json    # expects classification=duplicate
  └── scripts/
      ├── lib/
      │   ├── env.sh                    # resolves bearer tokens, Railway URLs
      │   └── assert.sh                 # jq-based assertion helpers
      ├── test-content-sourcing.sh
      ├── test-biofuel-relevance.sh
      ├── test-article-classifier.sh
      ├── test-r5-cleanup-postconditions.sh
      └── run-all.sh
  ```
- **Fixture content requirements** (Stephen provides; this plan specifies the shape):
  - Each content-sourcing fixture is a `BatchSearchRequest` (one `SearchRequest` per source type, `test_mode: true`).
  - `keyword.json` must use a keyword that historically triggered the `source="Google"` rename (Stephen supplies — see Deferred Question resolution).
  - Biofuel fixture includes the envelope fields required by `app/schemas.py` (title, content, url, source, source_category, summary).
  - Article-classifier fixture is shaped `{"article": "<json string>"}` matching `ClassifyRequest.article: str` at `app/schemas.py:128-130`.
- **`env.sh` resolves:**
  - `CONTENT_SOURCING_URL`, `ARTICLE_CLASSIFIER_URL`, `BIOFUEL_RELEVANCE_URL` — from env or a dotfile at `$HOME/.config/syntech/e2e.env`.
  - Bearer tokens: `CONTENT_SOURCING_TOKEN`, `ARTICLE_CLASSIFIER_TOKEN`, `BIOFUEL_RELEVANCE_TOKEN` — same source. Fail loud if missing.
  - `NEON_DATABASE_URL` for the R5 SQL assertions (prod Neon main branch).
- **`branch-state-2026-04-22.md`** — lift the finalised branch-state section from the brainstorm's R6 (lines 62-87 of the brainstorm) verbatim, plus a dated header and the "immediate actions" list. This is the canonical artefact the brainstorm R6.e deliverable points at.

Acceptance:
- [ ] Directory tree exists; `README.md` documents token setup and how to run.
- [ ] Stephen has confirmed fixture payloads (especially the `keyword.json` Google-fanout trigger and the garbled-URL fixture for R1.e / R5.b).

### Phase 2 — `test-content-sourcing.sh` (covers R1, R2)

Script:

1. Load `fixtures/content-sourcing/batch-all.json`.
2. `curl -XPOST $CONTENT_SOURCING_URL/search/batch -H "Authorization: Bearer $CONTENT_SOURCING_TOKEN" --data @batch-all.json`.
3. For each returned article, assert:
   - R1.a — `.source` ∈ the 7-value enum (jq `test("^(RSS|LinkedIn|Instagram|X|Website|Google|Keyword)$")`).
   - R1.b — `.source_name`, `.source_category`, `.title`, `.url` are non-empty strings.
   - R1.c — `.publication_date != null` OR `.source == "RSS"` (the only currently-documented undated-allowed handler — revisit allowlist if it expands).
   - R1.d — if `.publication_date != null`: parse and assert `now - publication_date <= max_age_days` (default 21 unless fixture overrides it).
   - R1.e — `.content` length ≥ 100; no bytes outside printable UTF-8 (`jq` + python/perl fallback to check bytes — bash-only UTF-8 check is brittle; include a python helper for R1.e).
   - R1.f — *post plan 001:* `.source == "LinkedIn" | "X" | "Instagram"` ⇒ `.author != null`; other source values ⇒ `.author == null`. **Until plan 001 ships, mark R1.f as skipped in the script output** — don't assert against missing field.
4. Load `fixtures/content-sourcing/keyword.json` separately; hit `/search/batch`; assert:
   - R2.a — at least one article with `.source == "Keyword"` **and** at least one with `.source == "Google"`.
   - R2.b — no article with `.source` outside those two values.
   - R2.c — `group_by(.url) | map(length)` — all groups are length 1 (dedup).

Acceptance:
- [ ] Script exits 0 against a known-good run.
- [ ] Each assertion failure names the invariant (`R1.a`, etc.) and prints the offending article URL.

### Phase 3 — `test-biofuel-relevance.sh` (covers R3)

Script:

1. Load `fixtures/biofuel-relevance/dated-article.json`.
2. `curl -XPOST $BIOFUEL_RELEVANCE_URL/classify -H "Authorization: Bearer $BIOFUEL_RELEVANCE_TOKEN" --data @dated-article.json`.
3. Assert:
   - R3.a — `.analysis.threshold_met` is a boolean.
   - R3.b.1 (HTTP) — `.analysis.total_score` is a number; `.analysis.pathway ∈ {A,B,C,D}`; `.analysis.decision ∈ {SURFACE, REJECT}`.
   - R3.b.2 (DB, shadow-vote invariant) — SQL:
     ```sql
     SELECT count(*) FILTER (WHERE analysis_blob ? 'classifier_vote') AS with_vote,
            count(*) AS total
     FROM classifier_relevance.decisions
     WHERE decided_at > now() - interval '5 minutes';
     ```
     Assert `with_vote > 0` (our curl call just produced one). See `project_phase2_future_work` and `project_next_session_check` §6 — if this fails on day one, the issue is upstream config on Railway, not a test artefact; flag and investigate before trusting other assertions.
   - R3.c — response includes every field listed in `Analysis` at `app/schemas.py:165-194` (no stripped fields).

Acceptance:
- [ ] Script exits 0 against a known-good run.
- [ ] Shadow-vote DB assertion runs before declaring green (catches the Phase-2 silent-drop regression).

### Phase 4 — `test-article-classifier.sh` (covers R4)

Script:

1. Load `fixtures/article-classifier/fresh-article.json` (already wrapped as `{"article": "<json string>"}`).
2. `curl -XPOST $ARTICLE_CLASSIFIER_URL/classify -H "Authorization: Bearer $ARTICLE_CLASSIFIER_TOKEN" --data @fresh-article.json`.
3. Assert:
   - R4.a — `.classification ∈ {new, update, duplicate}`; `.topical_signature.topic_subject`, `.topical_signature.topic_action`, `.topical_signature.topic_entities` present.
4. Repeat with `duplicate-article.json` (same URL as fresh fixture, submitted twice); assert `.classification == "duplicate"` on the second call.
5. **R4.b / R4.c (outbox inspection — Deferred Question resolution):** the brainstorm flagged "does this need outbox inspection or is HTTP enough?" Decision: **include outbox inspection** — without it, R4.b (`publication_date` echo) and R4.c (`source` echo) can't be verified, and those are precisely the bugs plan 001 is fixing. SQL:
   ```sql
   SELECT payload
   FROM classifier.dashboard_sync_outbox
   WHERE payload->>'url' = <fixture_url>
   ORDER BY created_at DESC LIMIT 1;
   ```
   Assert `payload->>'source'` equals the fixture's `source`; `payload->>'published_at'` equals the fixture's `publication_date` in ISO format.

Acceptance:
- [ ] Script exits 0 against a known-good run.
- [ ] Outbox inspection runs against prod Neon; read-only; does not mutate rows.

### Phase 5 — `test-r5-cleanup-postconditions.sh` (covers R5)

Script (read-only — assumes the cleanup has already been run; this validates the *resulting state*):

1. R5.a — `SELECT count(*) FROM public.articles WHERE published_at < '<cutoff>'` → 0.
2. R5.b — `SELECT count(*) FROM public.articles WHERE octet_length(content) > length(content);` (rough proxy for non-UTF-8 bytes) → 0. For a stricter check, run a short Python helper over the `content` column: any row with chars outside the printable-UTF-8 set fails.
3. R5.c — reversibility: `SELECT count(*) FROM public.cleanup_archive_<suffix>` > 0 for at least one archive table; dry-run the reverse `INSERT ... SELECT` inside a transaction and ROLLBACK, asserting the INSERT would succeed (no PK/FK violations).
4. R5.d — dashboard-UI assertion: HTTP-GET the explorer page (or its API surface if one exists), parse the article list, assert no URL matches an archived URL.
5. R5.e — orphan check:
   ```sql
   SELECT count(*)
   FROM classifier.articles ca
   LEFT JOIN public.articles pa ON pa.id = ca.<fk>
   WHERE ca.classified_against IS NOT NULL AND pa.id IS NULL;
   ```
   (Exact column names depend on the classifier self-FK; check `0001_initial_schema.py` during scripting.) → 0.
6. R5.f — `SELECT count(*) FROM public.articles WHERE published_at IS NULL` → 0 (once the Phase 0 script fix has been run with `--include-null-pub`).

Acceptance:
- [ ] Script exits 0 against post-cleanup state.
- [ ] R5.d walk of the UI's article list surface catches any caching ghost (shouldn't be one, but assert it).

### Phase 6 — `run-all.sh` + housekeeping

Deliverables:

- `run-all.sh`: runs Phase 2-5 scripts in sequence; aggregates exit codes; prints a per-phase colored verdict + a final `PASS` / `FAIL` summary with failing-invariant names.
- **Branch hygiene (non-test-blocking but worth doing once R6 is authoritative):** execute the R6 immediate-actions list from the brainstorm in a single session — delete 4 stale article-classifier branches, decide on the 2 genuine unmerged hardening branches, merge 3 low-risk fixes (biofuel pooler, dashboard classification-columns, dashboard pool-max), delete 1 orphan dashboard branch. See brainstorm R6 lines 80-87.

Acceptance:
- [ ] Total runtime <5 minutes on Stephen's machine.
- [ ] Branch-state map finalised and matches current state after housekeeping.

## Success Metrics

- **Primary:** `run-all.sh` exits 0 on a clean prod run, and every named invariant passes with specific article/row-level details.
- **Secondary:** when a deliberate regression is introduced in a test repo (e.g. set `author: source_name` at a handler), the corresponding script fails with the specific invariant name (dogfoods the failure message quality).
- **Confidence:** after the suite is green, Stephen re-enables the "News Sourcing Production (V2)" workflow in n8n.

## Dependencies & Risks

### Dependencies

- **Plan 001 (field contract) must ship before R1.a and R1.f assertions become enforceable.** Until then, those assertions are marked SKIPPED in script output — not deleted — so the shape of the suite doesn't change post-cutover.
- **Phase 0 cleanup fix must ship before R5.a / R5.f can pass.**
- **Neon read access** from Stephen's machine (already in place — existing `DATABASE_URL` in `.env.local` files).
- **Railway bearer tokens** for all three services (already wired into n8n; same secrets reused).

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `test_mode: true` doesn't actually skip `seen_urls` marking | Low | High (tests pollute prod state) | Verify with Stephen before first run; inspect `SearchRequest.test_mode` handling in each handler |
| Shadow-vote assertion (R3.b.2) fails on day one because vote column isn't being written | Medium | Medium | Separate issue from test correctness; brainstorm Deferred Question — investigate and fix before relying on R3 |
| Fixture URLs go stale (content changes, site takedown) | Medium | Low | Fixtures are static JSON; regen process documented in README |
| Railway rate limits on repeated runs | Low | Low | `run-all.sh` sleeps 2s between phases; if rate-limited, split across 2 runs |
| R5.d "ghost article" reappears despite Phase 0 fix | Low | High | Points to a different root cause; fall back to the full investigation in brainstorm's Deferred Question §R5.d + R6.c |
| Outbox inspection (R4.b/R4.c) picks up a stale row from a prior run | Medium | Low | Query filters by fixture URL + `ORDER BY created_at DESC LIMIT 1` — latest wins |

## Scope Boundaries (carried forward from brainstorm)

- **Not in scope:** semantic-dedup contract tests (no known bug; add later if needed).
- **Not in scope:** fixing bugs surfaced by the tests — those are separate `/ce:plan` runs. This plan ships **tests + a confidence report**.
- **Not in scope:** full n8n workflow execution (curl-per-service only).
- **Not in scope:** CI wiring — manual/local first.
- **Not in scope (but flagged):** inspecting `public.articles` write-path immediately after `/classify` to catch the `category=NULL` regression on the write side. The regression is already diagnosed (`project_category_regression_cause`) and lives in `dashboard_sync.py:150`. Picking a category vocab is its own decision — see Future Considerations.

## Deferred Question Resolutions

From the brainstorm's "Deferred to Planning" list:

- **[R4][User decision] Outbox inspection vs HTTP-only?** → **Include outbox inspection.** R4.b and R4.c depend on it; adding it costs one SQL query per test; read-only.
- **[R1.d][Technical] Per-handler `max_age_days` defaults?** → Default 21 globally (`config.py:55`). All handlers honour it. Fixture-level override is supported via `SearchRequest.max_age_days`. No per-handler deviations found in the research pass.
- **[R1.e][Technical] Min content length / printable-char threshold?** → Current `validate_content()` threshold is 100 chars (`extraction.py:689`). No printable-UTF-8 check exists. Tests assert the existing 100-char threshold **plus** printable-UTF-8 (stricter than the current validator — documents what we *want*, not just what the validator enforces; a separate plan can extend the validator if needed).
- **[R3.b][Technical] Shadow-vote verification before assertion?** → Script runs a pre-check: if `classifier_relevance.decisions` has 0 rows with `classifier_vote` in the last 5 minutes despite recent traffic, flag as "shadow-vote not firing" and skip R3.b.2 with a loud warning, not a silent pass.
- **[R2][User decision] Keyword fixture selection?** → Stephen supplies a keyword that historically triggered the Google rename (flagged in Phase 1 acceptance). Candidate (pending confirmation): a biofuel-industry term that's both in Google News indexing and in Tavily's AI-search corpus.
- **[R5.d + R6.c][Root cause]** → Resolved during the 2026-04-22 brainstorm itself. Neon topology is a single project; the "ghost" was NULL-pub rows skipped by the cleanup's `IS NOT NULL` clause. Phase 0 closes the hole.
- **[R5][User decision] What does "reset correctly" mean?** → Run the existing cleanup with `--include-null-pub` (post-Phase-0), plus a one-time manual garbled-content scan (see R5.b). Not a full truncate-and-reseed.
- **[R5.b][Technical] Extend existing script or new one?** → Extend a sibling pass in `cleanup_old_articles.py` *only if* garbled-content detection logic fits naturally. Otherwise write a new `scripts/cleanup_garbled_content.py`. Decide during scripting; bias toward sibling script for independence.

## Future Considerations

- **Category vocab decision** (separate plan): the `category=NULL` regression at `dashboard_sync.py:150` is the last un-addressed failure from the first run. Two paths (per `project_next_session_check` §1): (a) pick a vocab and plumb from topic fields; (b) reintroduce an n8n-level write of `source_category`. Scope separately.
- **CI wiring:** once the suite is stable, wire `run-all.sh` into a GitHub Action that runs on PRs touching `app/handlers/`, `app/dashboard_sync.py`, `src/lib/validations/webhook.ts`, or the n8n classifier POST node.
- **Full end-to-end replay:** deferred per brainstorm Key Decisions. Worth adding once contract tests have been stable for a cycle.
- **Garbled-content cleanup script** (R5.b enforcement side): pair with a `validate_content()` hardening PR in content-sourcing.

## Documentation Plan

- `docs/testing/sourcing-e2e/README.md` — how to run, token setup, what each invariant means, how to add a new fixture.
- Update `syntech-n8n-as-code/AGENTS.md` with a pointer to the e2e suite.
- Post-ship: `/ce:compound` writeup capturing the cleanup-script NULL-logic lesson and the per-service-contract-testing pattern.

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-04-22-sourcing-e2e-validation-requirements.md](../brainstorms/2026-04-22-sourcing-e2e-validation-requirements.md). Key decisions carried forward:
  1. Stage-by-stage contract tests, not single end-to-end replay.
  2. Per-stage JSON fixtures provided by Stephen, realistic payloads targeting known failure modes.
  3. Assertions as `jq` expressions + bash exit codes — no test-framework dependency.
  4. Keyword fanout tested as R2 (sub-case of content-sourcing), not a separate service.
  5. Neon topology confirmed as a single project; no preview-branch isolation in play.

### Internal References

- Content sourcing route: `syntech-content-sourcing/app/api/routes.py:144`
- `ArticleResponse` model: `syntech-content-sourcing/app/models.py:39-57`
- `validate_content()`: `syntech-content-sourcing/app/extraction.py:686-701`
- Default `max_age_days`: `syntech-content-sourcing/app/config.py:55`
- Cleanup script current WHERE clause: `syntech-content-sourcing/scripts/cleanup_old_articles.py:409-421`
- Cleanup flag wiring: `syntech-content-sourcing/scripts/cleanup_old_articles.py:112-178`
- Archive table creation: `syntech-content-sourcing/scripts/cleanup_old_articles.py:272-274, 405-407`
- Article-classifier route: `syntech-article-classifier/app/main.py:99-105`
- `ClassifyRequest`: `syntech-article-classifier/app/schemas.py:128-130`
- `ClassifyResponse`: `syntech-article-classifier/app/schemas.py:122-125`
- `TopicalSignature` + `FactExtractionFlat`: `syntech-article-classifier/app/schemas.py:103-125`
- Biofuel-relevance route: `syntech-biofuel-relevance-classifier/app/api/routes.py:161-239`
- `Analysis` + `ClassifyResponse`: `syntech-biofuel-relevance-classifier/app/schemas.py:165-194, 243-247`
- Outbox payload builder: `syntech-article-classifier/app/dashboard_sync.py:112-168`
- n8n classifier POST node: `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts:~3057`

### Cross-cutting memory

- `project_next_session_check` — end-to-end pipeline audit agenda (2026-04-22); Neon + Railway topology
- `project_phase2_future_work` — shadow-vote invariant context for R3.b.2
- `project_category_regression_cause` — the category=NULL regression (out of scope here, flagged)
- `feedback_source_vs_author` — per-retrieval-path stamping rationale
- `feedback_output_fields_are_schema` — why these contracts matter

### Related Work

- Blocking plan: [docs/plans/2026-04-22-001-feat-source-author-field-contract-plan.md](2026-04-22-001-feat-source-author-field-contract-plan.md)
- Prior classifier cutover: [docs/plans/2026-04-15-001-feat-article-classifier-microservice-plan.md](2026-04-15-001-feat-article-classifier-microservice-plan.md)
- Prior biofuel-relevance cutover: [docs/plans/2026-04-15-002-feat-biofuel-relevance-classifier-microservice-plan.md](2026-04-15-002-feat-biofuel-relevance-classifier-microservice-plan.md)
- Content-sourcing microservice plan: [docs/plans/2026-04-21-001-feat-content-sourcing-microservice-plan.md](2026-04-21-001-feat-content-sourcing-microservice-plan.md)
