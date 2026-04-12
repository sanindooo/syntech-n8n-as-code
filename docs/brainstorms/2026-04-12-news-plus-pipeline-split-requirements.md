---
date: 2026-04-12
topic: news-plus-pipeline-split
---

# Syntech News+ Pipeline — Stage 4 Split & Prompt Refresh

## Problem Frame
The Syntech Biofuel news filtering pipeline (workflow: `News Sourcing Production (V2)`) currently has a single Stage 4 scorer for all articles that pass Stage 3. The new design routes articles by Stage 3 `pathway`: deep-expert content (pathway `D`) goes to a new Stage 4B expert processor, everything else goes to the existing scorer (renamed Stage 4A), and `REJECT` pathways terminate. Prompts for Stages 2–4 are also being refreshed, with two new input fields (`SOURCE PLATFORM`, `SOURCE CATEGORY`) threaded into every stage.

## Requirements

- **R1.** Rename `prompts/` → `prompts/news-sourcing-production/` with files `stage_1.md`, `stage_2.md`, `stage_3.md`, `stage_4a.md`, `stage_4b.md`. Future workflows get their own sibling subfolder.
- **R2.** Replace the system prompt and user message in each of Stage 1, 2, 3, and 4A nodes with the contents of the corresponding prompt file. The prompt files are authoritative — use the expressions in them verbatim (ignore transcription truncations in the original brief).
- **R3.** Every stage's user message must include `SOURCE PLATFORM` and `SOURCE CATEGORY` referencing `$('Deduplicated Articles').item.json.source_platform` / `source_category`. Already present in the prompt files.
- **R4.** Rename the live Stage 4 node from `STAGE - 4: Classification Agent (Claude Optimisation)` → `📊 STAGE - 4A: Strategic Value Scorer`. Keep its node id, model (Claude Sonnet 4.5), credentials, and retry settings.
- **R5.** Add a new Basic LLM Chain node `🎓 STAGE - 4B: Expert Content Processor`, same model/credentials as 4A. Populate from `stage_4b.md`. Inputs per the prompt file (no Stage 3 output; all 4B items are pathway `D` by definition).
- **R6.** Insert a Switch node `🔀 Pathway Router` after Stage 3 routing on `$('🪨 STAGE - 3: Topic Density Test').item.json.output.pathway`:
  - `contains D` → Stage 4B
  - `contains REJECT` → no downstream (dead-end)
  - else → Stage 4A
- **R7.** Wire Stage 4B's output into the same downstream node(s) that Stage 4A currently feeds (so both scorers converge into the existing post-Stage-4 path).
- **R8.** Leave the orphan duplicate node `STAGE - 4: Classification Agent (Claude Optimisation)1` untouched (user keeps it as a fallback). Do not rename, rewire, or delete.

## Success Criteria
- Workflow pushes cleanly via `n8nac push` and activates without validation errors.
- A test run with a pathway-A/B/C article reaches Stage 4A; a pathway-D article reaches Stage 4B; a REJECT article terminates at the Switch.
- Stage 4A and 4B outputs arrive at the same existing downstream node(s).
- All stage prompts render `SOURCE PLATFORM` and `SOURCE CATEGORY` values for a real article.

## Scope Boundaries
- No changes to Stages before Stage 1 (sourcing/dedup), no changes to post-Stage-4 logic, no changes to the existing `Keep Keyword Dense Content1` filter.
- No dedicated reject-handler/logger node (flagged as follow-up).
- No change to the orphan `...Optimisation1` node.
- No change to models or credentials.

## Key Decisions
- **Prompt folder scoped per workflow:** keeps multi-workflow expansion clean.
- **Prompt files are source of truth:** the brief's truncated expression strings are ignored.
- **REJECT is a dead-end at the Switch:** matches current drop-via-filter behavior; avoids scope creep into building a handler.
- **Switch uses `contains`:** matches the brief. Low risk today since pathway values are `A/B/C/D/REJECT`, but flagged — if future pathways start with `D` (e.g. `DEFERRED`) this misroutes.
- **Orphan Stage 4 duplicate preserved as user-owned safety copy.**

## Dependencies / Assumptions
- `n8nac-config.json` exists and auth is valid (pipeline is initialized).
- Workflow must be pulled fresh before editing and pushed after editing per project discipline.
- Stage 3 output shape exposes `.output.pathway` at runtime (confirmed by existing `Keep Keyword Dense Content1` filter referencing the same path).

## Outstanding Questions

### Resolve Before Planning
(none)

### Deferred to Planning
- [Affects R7][Technical] What is the exact downstream node(s) connected to Stage 4A's output today? Planning step should read the connections block in the workflow file and wire 4B identically.
- [Affects R6][Technical] Confirm Switch node uses `contains` vs `equals` — flagged risk, but go with brief's `contains` unless planning finds a reason otherwise.
- [Affects R1][Technical] Any inbound references to the `prompts/` path from scripts or directives that need updating during the rename?

## Next Steps
→ `/ce:plan` for structured implementation planning
