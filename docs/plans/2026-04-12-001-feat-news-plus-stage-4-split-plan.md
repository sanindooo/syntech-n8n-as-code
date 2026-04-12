---
title: News+ Pipeline — Stage 4 Split, Pathway Router, and Prompt Refresh
type: feat
status: active
date: 2026-04-12
origin: docs/brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md
---

# News+ Pipeline — Stage 4 Split, Pathway Router, and Prompt Refresh

## Overview

The Syntech Biofuel news filtering workflow (`News Sourcing Production (V2)`) currently routes every non-REJECT Stage 3 article through a single Stage 4 Classification Agent. This plan splits Stage 4 into two scorers — **4A (Strategic Value Scorer)** for pathway A/B/C articles and **4B (Expert Content Processor)** for pathway D articles — inserts a **Switch-based Pathway Router** after Stage 3, refreshes prompts for Stages 1–4, and threads new `SOURCE PLATFORM` / `SOURCE CATEGORY` fields into every stage's user message. Prompt files move to a per-workflow subdirectory (`prompts/news-sourcing-production/`) so future workflows can add their own prompt folders without collision.

## Problem Statement / Motivation

Tim's classification framework has evolved: pathway-D (expert/deep) content requires different prompting than the generic strategic-value scorer can provide. The existing monolithic Stage 4 produces muddy results for expert content. A Switch + second LLM chain gives each pathway the specialized treatment it needs, and REJECT pathways should terminate explicitly rather than be silently dropped by a downstream filter. Prompt content also needs updating to consume platform/category signals already present on every article item.

Origin decisions carried forward (see origin: `docs/brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md`):
- Orphan `...Optimisation1` duplicate node is preserved untouched (user's fallback).
- REJECT is a dead-end at the Switch (matches existing drop-via-filter behavior).
- Stage 4B converges into the same downstream as Stage 4A.
- Prompt folder scoped per-workflow.

## Proposed Solution

### Target wiring

```
Stage3 ─▶ ViewDensityResults ─▶ 🔀 Pathway Router ──▶ (A/B/C) ─▶ Merge2.in(0) ─▶ 📊 STAGE 4A ─┐
                                                │                                             ├─▶ PerformFinalCalculation
                                                ├──▶ (D)       ──▶ 🎓 STAGE 4B ───────────────┘
                                                └──▶ (REJECT)  ──▶ (dead-end)

ViewVipResults ─▶ Merge2.in(1)   (VIP bypass, unchanged)
```

### Node changes summary

| Action | Node | Notes |
|---|---|---|
| Rename folder | `prompts/` → `prompts/news-sourcing-production/` | Files renamed to lowercase `stage_{1,2,3,4a,4b}.md` |
| Update prompt | `⛽️ STAGE - 1: Fossil Fuel Filter` | Body from `stage_1.md` |
| Update prompt | `🔑 STAGE - 2: VIP Keyword handler` | Body from `stage_2.md` |
| Update prompt | `🪨 STAGE - 3: Topic Density Test` | Body from `stage_3.md` |
| Rename + update | `STAGE - 4: Classification Agent (Claude Optimisation)` → `📊 STAGE - 4A: Strategic Value Scorer` | Body from `stage_4a.md`. Keep id, model, credentials, retry settings. |
| New node | `🔀 Pathway Router` (Switch v3.4) | Inserted after `ViewDensityResults` |
| New node | `🎓 STAGE - 4B: Expert Content Processor` (Basic LLM Chain) | Same model/creds as 4A. Body from `stage_4b.md`. |
| Remove | `Keep Keyword Dense Content1` (Filter) | Switch subsumes its REJECT-drop behavior |
| Leave | `STAGE - 4: Classification Agent (Claude Optimisation)1` | Untouched per origin decision |
| Fix reference | `Evaluation1.actualAnswer` (line 1721) | Update `$('STAGE - 4: Classification Agent (Claude Optimisation)')` → `$('📊 STAGE - 4A: Strategic Value Scorer')` |

## Technical Considerations

**Architecture impacts:** Single workflow file change. No new scripts, no directive changes.

**Sync discipline (from AGENTS.md):** `pull → edit → push`. Must pull the workflow before editing, push after, and test the webhook/chat endpoint on completion.

**Node research:** Switch v3.4 schema retrieved via `npx n8nac skills node-info "switch"`. Use `mode: 'rules'`, `numberOutputs: 3`, with each rule having an `outputKey` label (`"A/B/C"`, `"D"`, `"REJECT"`) and a `string contains` operator comparing `={{ $json.output.pathway }}` to the literal.

**Rule order matters with `contains`:** evaluate `REJECT` and `D` **before** the catch-all "else → A/B/C". Put REJECT first, then D, then fall through to default = A/B/C. This avoids the `DEFERRED contains D` edge case flagged in origin.

**Expression authority:** All user-message bodies come verbatim from prompt files. The transcription in the original brief had two truncated expressions (`Stage 3 output` and `Stage 1 output` lines) — ignore the brief, use the files.

**Model/credential preservation:** Stage 4A keeps `claude-sonnet-4-5-20250929` and its current credential binding. Stage 4B clones those settings.

## System-Wide Impact

- **Interaction graph:** Stage 3 → ViewDensityResults → Switch (new) → {Stage 4A | Stage 4B | ∅}. Both 4A and 4B feed `PerformFinalCalculation`. `Evaluation1` depends on Stage 4A's renamed reference.
- **Error propagation:** Basic LLM Chain retries are configured on Stage 4A (`retryOnFail: true, waitBetweenTries: 5000`); mirror on 4B. Switch itself does not retry — upstream parse failures propagate as workflow errors.
- **State lifecycle risks:** REJECT dead-end means rejected items produce no downstream execution. No state orphaned (no persistent write in REJECT path today).
- **API surface parity:** `PerformFinalCalculation` and any downstream consumers currently assume Stage 4's output shape. 4B's output must match the same `{ output: { final_score, ... } }` contract if `PerformFinalCalculation` uses it. **Open question — see Deferred.**
- **Integration test scenarios:**
  1. Pathway A/B/C article: flows Stage3 → Switch(default) → 4A → PerformFinalCalculation. Must produce scored output.
  2. Pathway D article: flows Stage3 → Switch(D) → 4B → PerformFinalCalculation. Must produce output consumable downstream.
  3. Pathway REJECT article: flows Stage3 → Switch(REJECT) → terminate. No downstream execution.
  4. VIP bypass article: skips Stage 3 entirely, enters Merge2.in(1) directly. Must still reach 4A unchanged.
  5. `Evaluation1` run: references Stage 4A by new name and still resolves `output.final_score`.

## Acceptance Criteria

- [ ] `prompts/` renamed to `prompts/news-sourcing-production/` with files `stage_{1,2,3,4a,4b}.md`.
- [ ] Stages 1, 2, 3, 4A system prompts and user messages replaced with corresponding prompt-file contents.
- [ ] Every stage user message includes resolved `SOURCE PLATFORM` and `SOURCE CATEGORY` expressions.
- [ ] Stage 4 node renamed to `📊 STAGE - 4A: Strategic Value Scorer` (id, model, creds, retry preserved).
- [ ] New `🎓 STAGE - 4B: Expert Content Processor` node added (same model/creds/retry as 4A).
- [ ] New `🔀 Pathway Router` Switch node added with rules in order: REJECT → dead-end, D → 4B, default → 4A.
- [ ] `ViewDensityResults.out(0)` rewired to `🔀 Pathway Router.in(0)`.
- [ ] `KeepKeywordDenseContent1` Filter removed and its wiring torn down.
- [ ] Switch's A/B/C branch wired into `Merge2.in(0)` (preserving VIP bypass via Merge2.in(1)).
- [ ] Switch's D branch wired into Stage 4B; Switch's REJECT branch has no downstream.
- [ ] Stage 4B output wired into `PerformFinalCalculation.in(0)` (same input as 4A).
- [ ] `Evaluation1.actualAnswer` expression updated to reference the renamed Stage 4A node.
- [ ] `STAGE - 4: Classification Agent (Claude Optimisation)1` untouched (name, connections, content unchanged).
- [ ] `npx n8nac push` succeeds without validation errors.
- [ ] `npx n8nac test <workflowId>` shows a pathway-A/B/C article hitting 4A, a pathway-D article hitting 4B, and a REJECT article terminating at the Switch.

## Success Metrics

- Workflow activates without error after push.
- Manual test runs confirm all three Switch branches behave correctly.
- Downstream `PerformFinalCalculation` produces output for both 4A and 4B paths without schema mismatch.

## Dependencies & Risks

**Dependencies:**
- `n8nac-config.json` must exist (workspace initialized).
- Must pull the workflow fresh before editing.

**Risks:**
- **Rename-breaks-reference risk (MEDIUM):** Renaming Stage 4 node also needs the `Evaluation1` reference at line 1721 updated. If missed, eval scoring breaks silently.
- **Output shape divergence (MEDIUM — deferred):** If Stage 4B's prompt emits a different JSON shape than 4A, `PerformFinalCalculation` may misread or error. Verify by reading `stage_4b.md`'s required output section before implementation.
- **Switch rule ordering (LOW):** `contains` with wrong ordering misroutes. Mitigated by explicit ordering: REJECT → D → default.
- **Orphan node coupling (LOW):** `...Optimisation1` is unreferenced elsewhere (verified via grep); safe to leave untouched.
- **Prompt folder rename collateral (LOW):** No scripts or directives reference `prompts/` today (verified by grep). Rename is isolated.

## Implementation Sequence

Order matters — do it this way to keep each step pushable and testable.

1. **Folder rename** (file-system only): `git mv prompts prompts/news-sourcing-production`, rename files to lowercase `stage_*.md`. No workflow change yet.
2. **Pull workflow fresh**: `npx n8nac list` → find workflowId → `npx n8nac pull <id>`.
3. **Update Stages 1, 2, 3 prompts** in the `.workflow.ts` file. Push and spot-check. If it fails, investigate and fix per AGENTS.md self-annealing loop.
4. **Rename Stage 4 → Stage 4A** + update prompt + update `Evaluation1.actualAnswer` reference. Push and spot-check.
5. **Add Stage 4B node** (new `@node` decorator + class property). Push — should be inert (not yet wired).
6. **Add `🔀 Pathway Router` Switch node** with rules ordered REJECT → D → default. Push — still inert.
7. **Rewire `@links` `defineRouting()` block:**
   - Remove: `ViewDensityResults → KeepKeywordDenseContent1`, `KeepKeywordDenseContent1 → Merge2.in(0)`.
   - Add: `ViewDensityResults → PathwayRouter.in(0)`.
   - Add: `PathwayRouter.out(0)` (default/A/B/C) → `Merge2.in(0)`.
   - Add: `PathwayRouter.out(1)` (D) → `Stage4B.in(0)`.
   - Leave: `PathwayRouter.out(2)` (REJECT) unwired.
   - Add: `Stage4B.out(0)` → `PerformFinalCalculation.in(0)`.
   - Add: `Stage4B.uses({...})` mirroring Stage 4A's AI model + output parser bindings.
8. **Delete `KeepKeywordDenseContent1`** @node decorator and class property.
9. **Push final** and `npx n8nac test` with sample articles for each pathway.

### Pseudo-diff for the `defineRouting()` block

```typescript
// workflows/.../News Sourcing Production (V2).workflow.ts

@links()
defineRouting() {
    // ... existing upstream wiring ...

    // REMOVE:
    // this.ViewDensityResults.out(0).to(this.KeepKeywordDenseContent1.in(0));
    // this.KeepKeywordDenseContent1.out(0).to(this.Merge2.in(0));

    // ADD:
    this.ViewDensityResults.out(0).to(this.PathwayRouter.in(0));
    this.PathwayRouter.out(0).to(this.Merge2.in(0));      // default: A/B/C
    this.PathwayRouter.out(1).to(this.Stage4BExpertContentProcessor.in(0)); // D
    // this.PathwayRouter.out(2) left unwired — REJECT dead-end
    this.Stage4BExpertContentProcessor.out(0).to(this.PerformFinalCalculation.in(0));

    // UNCHANGED:
    this.Merge2.out(0).to(this.Stage4StrategicValueScorer.in(0));  // property renamed from Stage4ClassificationAgentClaudeOptimisation
    this.Stage4StrategicValueScorer.out(0).to(this.PerformFinalCalculation.in(0));
    this.ViewVipResults.out(0).to(this.Merge2.in(1));

    // Stage 4B uses same AI bindings as 4A:
    this.Stage4BExpertContentProcessor.uses({
        ai_languageModel: /* same as Stage4StrategicValueScorer */,
        ai_outputParser:  /* same as Stage4StrategicValueScorer */,
    });
}
```

## Outstanding Questions

### Deferred to Planning → Implementation
- **[Affects Stage 4B output shape][Needs verification]** Does `stage_4b.md` specify an output JSON schema compatible with `PerformFinalCalculation`'s input expectations? Read the prompt file's output section at implementation time; if the shape differs from 4A, either (a) add a Set node to reshape 4B's output before `PerformFinalCalculation`, or (b) adjust `PerformFinalCalculation` to handle both shapes. Surface this to the user before pushing.
- **[Affects Switch node][Technical]** The brief specifies `contains` operator. We preserve that, but order rules REJECT-first to mitigate substring risk (origin decision).
- **[Affects prompt folder rename][Verification]** Confirm no AGENTS.md / CLAUDE.md content refers to `prompts/` path; quick grep already suggests none but re-verify at implementation.

## Sources & References

### Origin
- **Origin document:** [docs/brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md](../brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md) — carries forward: folder-scoping decision, Stage 4 dup handling, REJECT dead-end, 4B→downstream convergence.

### Internal References
- Workflow: `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts`
  - Stage 1 node: line 6526
  - Stage 2 node: line 6607
  - Stage 3 node: line 6921
  - Stage 4 live node: line 9164
  - Stage 4 orphan dup: line 8433 (leave alone)
  - `KeepKeywordDenseContent1` filter: line 5747 (to remove)
  - `Merge2`: line 6250
  - `ViewDensityResults`: line 6416
  - `Evaluation1.actualAnswer`: line 1721 (reference to update)
  - `@links defineRouting()`: line 10278
- Prompt files: `prompts/STAGE_{1,2,3,4A,4B}.md` → will become `prompts/news-sourcing-production/stage_*.md`
- Agent instructions: `AGENTS.md` / `CLAUDE.md` — n8n-as-code sync discipline, node research protocol

### External References
- n8n Switch node schema v3.4 — retrieved via `npx n8nac skills node-info "switch"`
- n8n-as-code transformer decorators: `@workflow`, `@node`, `@links`
