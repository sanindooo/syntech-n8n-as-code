---
date: 2026-04-21
topic: open-ideation
focus: null
---

# Ideation: Open-Ended Improvements

## Codebase Context

**Project Shape:**
- TypeScript + Python hybrid for n8n workflow-as-code using `@n8n-as-code/transformer`
- 3-layer architecture: Directives (empty), Orchestration (AI/n8n), Execution (Python)
- Git-like sync model (pull -> edit -> push) for n8n workflows
- Prompt sync discipline (Markdown files canonical, embedded into TS)

**Notable Patterns:**
- Self-annealing loop: errors -> fix -> update directive -> solution doc
- Workflow-map comments for navigating 300KB+ workflow files
- Compound Engineering plugin for plan/work/review/compound workflow

**Pain Points Identified:**
- Empty directives/ folder despite 3-layer architecture referencing it
- Only one execution script exists (sync_prompts.py)
- Manual prompt embedding step required
- Railway deployment has many gotchas (IPv6, pgbouncer, readiness checks)
- Last-write-wins sync model risks silent overwrites

**Past Learnings:**
- Use `httpBearerAuth` not `httpHeaderAuth` for bearer tokens
- JSON.stringify per-field for article text in HTTP bodies
- Railway IPv6-only private networking requires `--host ::`
- Pre-cutover git tags essential for rollback

## Ranked Ideas

### 1. Shadow-Run Drift Alerting via Scheduled Agent
**Description:** A scheduled Claude Code agent runs daily SQL queries against `classifier_relevance.decisions`, compares pathway distribution to stored baseline, and alerts Slack when drift exceeds thresholds. Replaces the manual T+1h/T+4h/T+24h/T+48h monitoring checklist from the cutover runbook.

**Rationale:** The cutover runbook explicitly lists monitoring metrics and SQL queries but requires human discipline across 48 hours. Automating this inverts the burden: humans only get involved when something breaks.

**Downsides:** Requires /schedule setup and Slack integration. Alert fatigue if thresholds too sensitive.

**Confidence:** 85%

**Complexity:** Medium

**Status:** Unexplored

### 2. Schema-Driven Contract Testing Between Services
**Description:** Generate JSON Schema from Pydantic models in biofuel-relevance-classifier and content-sourcing. Run contract tests in CI that assert content-sourcing output validates against classifier input schema. Fail fast on schema drift.

**Rationale:** Three microservices share implicit contracts. A field rename or type change breaks the pipeline silently at runtime. Contract tests enforce compatibility at build time.

**Downsides:** Requires maintaining schema exports. False positives if schema generation is imperfect.

**Confidence:** 80%

**Complexity:** Medium

**Status:** Unexplored

### 3. Pre-Commit Workflow Validation Hook
**Description:** Extend `.githooks/pre-push` to also run `npx n8nac skills validate` on staged workflow files, catching invalid node schemas before commits reach the remote.

**Rationale:** The pre-push hook only runs `sync_prompts.py check`. Invalid TypeScript/n8n schema errors slip through to n8n and cause runtime failures. The 11 error types in AGENTS.md "Common Mistakes" section are all catchable by validate.

**Downsides:** Slightly slower commits. May require npm install in hook.

**Confidence:** 90%

**Complexity:** Low

**Status:** Unexplored

### 4. Apify Actor Parameter Drift Detector
**Description:** A scheduled script fetches Apify actor schemas for all actors referenced in workflows, compares against last-known-good parameters, and alerts when breaking changes occur.

**Rationale:** Apify actors are third-party dependencies that change without notice. The content-sourcing requirements reference 6+ actors. A breaking change silently breaks sourcing until someone notices missing articles.

**Downsides:** Requires Apify API integration. Schema changes may be benign.

**Confidence:** 70%

**Complexity:** Medium

**Status:** Unexplored

### 5. Quote-Safe JSON Body Generation
**Description:** Add a `jsonSafeBody` mode to the n8n-as-code transformer or a linter rule that auto-wraps interpolated values in `JSON.stringify()` for HTTP Request nodes.

**Rationale:** Article content containing quotation marks breaks JSON parsing at runtime. The cutover runbook explicitly warns against the `={{ raw }}` form. This is a recurring footgun.

**Downsides:** May require changes to the transformer. Could over-escape already-safe values.

**Confidence:** 75%

**Complexity:** Low

**Status:** Unexplored

### 6. Solution Doc Auto-Linking to Future Plans
**Description:** Build a pre-plan research step that searches `docs/solutions/*.md` frontmatter for keywords matching a new task, automatically surfacing relevant learnings before implementation.

**Rationale:** Solution docs compound knowledge only if future work finds them. Auto-surfacing ensures the self-annealing loop actually closes.

**Downsides:** Requires structured frontmatter discipline. May surface irrelevant matches.

**Confidence:** 65%

**Complexity:** Low

**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Directive scaffolding/bootstrap | Directives layer is unused; solves non-existent problem |
| 2 | VS Code LSP extension | Engineering effort disproportionate to benefit |
| 3 | Workflow-map diff viewer | Git diff on map header already readable |
| 4 | Prompt embedding automation | Deliberately manual per AGENTS.md design decision |
| 5 | Auto-pull watchdog | Deliberately manual; explicit sync model is intentional |
| 6 | Cross-repo solution federation | Over-engineering for 2 repos |
| 7 | Python DSL for workflows | Throws away 700+ lines of existing TS tooling |
| 8 | Ditch n8n for Prefect/Temporal | Rewrite energy; n8n is working |
| 9 | Event-driven architecture | Architecture astronautics; current model works |
| 10 | Fly.io + LiteFS switch | Horizontal move, not vertical improvement |
| 11 | Monolith collapse | Opposite of current microservice direction |
| 12 | Self-annealing auto-draft | Vaporware; can't detect learning opportunities programmatically |
| 13 | Cold-start prewarming | Already documented; Railway has min-replicas |
| 14 | Decision log WAL | Over-engineering for best-effort telemetry |
| 15 | Jinja2 prompt compilation | Adds build step for zero benefit |
| 16 | Workflow execution replay | Unclear incremental value over existing test command |
| 17 | Auto-indexing solution docs | Premature optimization at 2 docs |
| 18 | Execution script templates | AGENTS.md already documents patterns; copying suffices |
| 19 | Shared microservice library | Organic DRY when second service needs shared code |
| 20 | Batched source endpoint | Already in content-sourcing plan, not a new idea |

## Session Log

- 2026-04-21: Initial open-ended ideation - 48 raw ideas generated across 6 frames, 6 survivors after adversarial filtering
