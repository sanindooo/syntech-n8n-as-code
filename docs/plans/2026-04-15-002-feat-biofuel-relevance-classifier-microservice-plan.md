---
title: Biofuel Relevance Classifier Microservice
type: feat
status: active
date: 2026-04-15
origin: docs/brainstorms/2026-04-15-biofuel-relevance-classifier-microservice-requirements.md
---

# Biofuel Relevance Classifier Microservice

## Enhancement Summary

**Deepened on:** 2026-04-15 via 13 parallel review + research agents (correctness, maintainability, testing, architecture, performance, security, api-contract, reliability, data-integrity, simplicity, python-idioms, agent-native, deployment; plus git-history archaeology).

### Key improvements

1. **Legacy flat schema is LIVE, not dead.** Git archaeology + grep proved `scoring_breakdown.{topical_relevance,market_indicators,oem_validation,adoption_success_story,strategic_context,penalties.*}.reasoning`, `competitor_intel.note` (nested), and `calculation_summary.{penalty_total,component_total,final_score,penalties_applied.*}` are wired into both `Map Data for Notion` branches (workflow.ts:7570–7919, 8071–8376). Plan now commits a concrete **schema translation layer** — service emits pathway-specific canonical shape AND a flat-schema shim for the live Notion mappers, until mappers migrate in a separate PR.
2. **`competitor_intel` path correction.** Service emits `analysis.scoring_breakdown.competitor_intel.note` (nested), not top-level, to match live mappers.
3. **Phase 1 slimmed** — classifier/reranker/calibration scaffolding deferred to Phase 2. Phase 1 ships rules + LLM-escalation + score math + cutover only. Fewer deps, smaller Docker image, faster to ship, delivers ~60% of cost win.
4. **Output-shape ambiguities resolved:**
   - Pathway D → `scoring_breakdown: null` (literal, top-level), matching current code node (workflow.ts:6296).
   - Stage-3-reject (no pathway evaluable) → `pathway: "A"`, all-zero Pathway A components, templated rejection evidence, `decision: REJECT`, `priority_band: REJECT`.
   - Non-D pathways omit `vertical`/`content_type`/`topic_summary`/`syntech_relevance` entirely (matches current shape, not null-populated).
   - Pydantic invariant: `(decision == "REJECT") iff (priority_band == "REJECT")` enforced at schema layer.
5. **Rules-vs-classifier precedence rule (Phase 2):** deterministic rules (source autos: Expert/Customer LinkedIn) hard-win and bypass classifier. Keyword/entity rules soft-win — classifier may flip low-confidence rule verdicts in the escalation band only.
6. **Agent Control Plane added.** `scripts/{classify,relabel,promote_model,rollback_model,retrain,explain_decision,shadow_report,sample_for_review}.py` + `/admin/*` endpoints + structured `/healthz`/`/readyz` JSON. Closes AGENTS.md §5–25 Layer-3 gap.
7. **Split admin auth.** Separate `RELEVANCE_ADMIN_TOKEN` for `/admin/*`; `RELEVANCE_CLASSIFIER_TOKEN` for `/classify` only. Prevents n8n workflow token from poisoning the training set.
8. **Explicit request deadline (15s)** + per-upstream timeouts (connect 2s, read 8s). Upstream SDK retries capped at 1 when n8n itself retries, preventing 27× amplification storms.
9. **URL canonicalization at the boundary.** Canonical URL (lowercased host, strip `utm_*`/`gclid`/`fbclid`/fragment/trailing-slash) is the real PK, stored in `url_canonical`; `articles.article_id` is a UUID surrogate. Protects against Notion/n8n/service disagreeing on "same article."
10. **Per-service schema on Neon.** `classifier_relevance.*` schema owns `decisions`, `labels`; `articles` is explicitly owned by the sibling article-classifier (sole writer), this service reads by FK on `url_canonical`. Prevents dual-write collisions during alembic runs.
11. **Python stack decisions committed:** `psycopg[binary]` v3 async (not asyncpg), `uv` (not poetry), ONNX-INT8 reranker (not fp16 PyTorch), `def` route handlers with sync inference wrapped in `anyio.to_thread.run_sync`, Pydantic v2 discriminated unions on `scoring_breakdown`.
12. **Retention + partitioning.** `decisions` partitioned by `decided_at` month, 180-day retention, BRIN on `decided_at`, archive to R2.
13. **Model artifact signing.** sha256-pinned manifest.json in R2 bucket; `joblib.load` replaced with `skops`/`safetensors` to eliminate pickle RCE.
14. **Prompt injection defense.** Delimiter fencing (`<article_untrusted>…</article_untrusted>`), hardened system prompt, content length cap, injection-payload fixtures in tests.
15. **Shadow-run isolation.** Separate Anthropic/OpenAI API keys or rate-limit sub-budget, Neon branch for writes, `shadow: true` flag so shadow traffic never pollutes live decisions or competes for upstream quota.
16. **No-regression gate made statistically honest.** Minimum-N per pathway (N≥20) required for gate; below that, gate fails open with manual review. Parity threshold measured with bootstrap 95% CI, not point estimate.
17. **Stage 4A self-disagreement baseline.** Plan now measures live Stage 4A test-retest disagreement *before* declaring a parity target for the new service — today's "truth" is itself non-deterministic.
18. **Evaluation1 node rewiring.** `Evaluation1.actualAnswer` (workflow.ts:1734) currently references `$('📊 STAGE - 4A: Strategic Value Scorer').item.json.output.final_score` — cutover must rewire to the HTTP Request node output or `Evaluation1` breaks silently.

### New considerations discovered

- Training signal inherits today's bugs (null evidence, Pathway C zeros). Pathway C weak labels are **dropped entirely** until post-fix data accumulates; only gold + post-cutover data feed Pathway C training.
- Shadow-run parity against buggy Stage 4A is not ground truth — gate checks *agreement on correct pathways* + *independent gold-set accuracy*, not just agreement.
- `tol_score` typo search in `workflow.ts` via git history returned nothing — the bug may live in a prompt file or the user's paste included an edit artifact. Verify live workflow state during Phase 1 schema audit; fix applies regardless because the microservice owns the scoring logic fresh.

## Overview

Replace the 5-stage LLM relevance-filter decision tree (Stages 1, 2, 3, 4A, 4B + the JS `PerformFinalCalculation` code node) in `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts` with a single Railway microservice (`syntech-biofuel-relevance-classifier`, separate repo) that implements a **cascade**: deterministic rules → embedding + cross-encoder reranker classifier → small-LLM escalation → deterministic score math. Target: cut per-article relevance-filter cost from £10–20/day to under £2/day **and** improve surfacing quality over time via an active-learning loop. Output schema is retained and extended additively so downstream n8n nodes, Notion mappers, and the Pathway Router do not change.

## Problem Statement / Motivation

The current pipeline wastes money on two fronts:

1. **Stages 1–3 are keyword/source rules wrapped in LLM calls.** Every article pays for an LLM round-trip to execute logic that's deterministically expressible in code — source-category autos (LinkedIn Customer/Expert/Competitor), biofuel/VIP/policy keyword lists, VIP-in-headline + mention-count logic, pathway routing with competitor-permissive-bias.
2. **Stage 4A (the "brain") runs the full expensive model on every article**, including obvious passes and obvious rejects that don't need judgment. It also has two live bugs:
   - Pathway C `tol_score` typo in the code node silently zeros Pathway C scores (workflow.ts:6337).
   - Pathway B/C components return `evidence: null` even when awarded points (e.g. `project_scale.points: 5, evidence: null`), leaving `active_scoring_components` as `"Project Scale: null | Timeline: null | ..."` in Notion.

There is no feedback loop: when Tim's preferences drift, the only lever is editing a prompt, and historical surface/reject decisions (Notion corpus + hundreds of stored `analysis` blobs) are never used to compound quality.

The brainstorm (`docs/brainstorms/2026-04-15-biofuel-relevance-classifier-microservice-requirements.md`) locked in 16 requirements. This plan implements all of them.

## Proposed Solution

A stateful microservice on Railway with the following request/response shape, behind the existing n8n workflow:

```
n8n per-article call
    → POST /classify { title, content, url, source_platform, source_category, ... }
        → Rules tier       (Stages 1–3 logic + obvious Stage 4 cases, zero LLM tokens)
        → Classifier tier  (bge-small-en-v1.5 embedding → bge-reranker-v2-m3 NLI rerank
                             → SetFit pathway head + LightGBM component heads
                             → isotonic-calibrated confidence)
        → LLM escalation   (Claude Haiku 4.5 or gpt-4o-mini, kNN-ICL few-shot from gold set,
                             only when calibrated confidence ∈ [0.35, 0.65])
        → Score math       (deterministic: point sum → threshold → priority band, Pathway C bug fixed)
    ← { analysis: { pathway, decision, total_score, priority_band, scoring_breakdown,
                    strategic_summary, key_highlights, recommended_action,
                    active_scoring_components, competitor_intel, ...Pathway-D fields,
                    classifier_tier, confidence, service_version } }
```

The service is the single source of truth for the `analysis` object. n8n's existing Pathway Router, Notion mappers, and Set-score nodes are left unchanged; only five LLM nodes and the calculation code node are replaced with one HTTP Request node.

Training uses four existing data tiers (gold from Tim's ~50–60 labels + Notion expert-verified, surfaced as weak positives, rejected as weak negatives, per-component `points` as regression targets), with `cleanlab` removing noisy labels before training and gold examples oversampled 5× in the contrastive loss to prevent weak-label drift.

An active-learning loop logs every decision with tier and calibrated confidence, surfaces 5–10 articles/day to Tim for review via a lightweight admin endpoint, and retrains weekly behind a no-per-pathway-regression gate.

## Technical Approach

### Architecture

Separate repo `syntech-biofuel-relevance-classifier` mirrors the sibling `syntech-article-classifier` (see `docs/plans/2026-04-15-001-feat-article-classifier-microservice-plan.md` lines 86–96, 188–260 for conventions this plan explicitly parallels).

**Stack:**
- Python 3.11, FastAPI, Pydantic v2, `pydantic-settings` for env
- `sentence-transformers` 5.x (embeddings + SetFit + CrossEncoder)
- `setfit` 1.1 (contrastive few-shot pathway classifier)
- `FlagEmbedding` with `BAAI/bge-reranker-v2-m3` (fp16 CPU)
- `lightgbm` (per-component 0–N regression heads)
- `cleanlab` 2.7+ (label-noise detection at training time)
- `anthropic` Python SDK (Haiku 4.5, structured-outputs beta) OR `openai` (gpt-4o-mini/gpt-5-mini) — benchmarked in Phase 1
- `openai` for embeddings (`text-embedding-3-small`)
- `psycopg[binary]` v3 async against Neon (`-pooler.neon.tech:6432`, transaction mode, `prepare_threshold=None`) with `pgvector` (HNSW index, 1536-dim)
- `alembic` migrations
- `structlog` JSON to stdout
- `httpx` AsyncClient for outbound
- `nannyml` for PSI drift detection
- `pytest` + fixtures in `tests/fixtures/`

### Service directory layout

```
syntech-biofuel-relevance-classifier/
├── app/
│   ├── main.py              # FastAPI app + lifespan (loads models once)
│   ├── api/routes.py        # POST /classify, GET /healthz, /readyz, POST /admin/relabel
│   ├── schemas.py           # Pydantic v2 input/output models
│   ├── cascade/
│   │   ├── rules.py         # Stages 1–3 deterministic logic (auto-routes, keyword lists)
│   │   ├── classifier.py    # SetFit pathway head + LightGBM component heads
│   │   ├── reranker.py      # bge-reranker-v2-m3 NLI scoring
│   │   ├── calibration.py   # isotonic regression wrapper
│   │   └── escalation.py    # LLM few-shot + structured output
│   ├── scoring.py           # deterministic point sum → band (fixes Pathway C bug)
│   ├── embeddings.py        # OpenAI client + pgvector cache read-through
│   ├── db.py                # asyncpg pool + pgvector helpers
│   ├── auth.py              # bearer middleware (comma-split rotation)
│   ├── logging.py           # structlog config
│   ├── config.py            # pydantic-settings, loads config/*.yaml
│   └── active_learning/
│       ├── logger.py        # decision log writer
│       ├── sampler.py       # uncertainty + disagreement sampling
│       └── retrain.py       # weekly retrain job (invoked by Railway cron)
├── config/
│   ├── keywords.yaml        # biofuel / VIP / policy lists (R12)
│   ├── vip_list.yaml        # VIP entities + aliases
│   ├── thresholds.yaml      # escalation band, score components
│   └── pathway_priority.yaml
├── prompts/
│   └── escalation_v1.md     # frontmatter-versioned; copied into docstring at build time
├── models/                  # trained artifacts (git-lfs or R2)
│   ├── setfit/
│   ├── lightgbm_a.txt
│   ├── lightgbm_b.txt
│   ├── lightgbm_c.txt
│   ├── calibrator_a.pkl
│   └── reranker/            # ONNX or safetensors
├── scripts/
│   ├── etl_training_data.py # consolidates 4 tiers into training table
│   ├── backfill_notion.py   # one-time seed from Notion corpus
│   ├── train_setfit.py
│   ├── train_lightgbm.py
│   ├── calibrate.py
│   ├── eval_parity.py       # SURFACE/REJECT + pathway agreement vs held-out
│   ├── eval_llm_judge.py    # pairwise + rubric against Gemini 2.5 Pro
│   └── shadow_run.py        # compare service output vs live Stage 4A for N days
├── migrations/              # alembic: articles, embeddings, decisions, labels
├── tests/
│   ├── fixtures/            # ~50 human-adjudicated articles + frozen Stage 4A outputs
│   ├── test_rules.py
│   ├── test_scoring.py      # locks in Pathway C bug fix, evidence-string rule
│   ├── test_cascade.py
│   ├── test_escalation_contract.py
│   └── test_parity.py       # CI gate
├── railway.toml
├── Dockerfile
├── pyproject.toml
└── README.md
```

### Output schema (R1, R14) — committed decisions

Live downstream consumers (verified by grep against workflow.ts) read **both** shapes:
- **Pathway-specific (canonical, what new consumers read):** `scoring_breakdown.pathway_{a,b,c}.<component>.{points,evidence,passed,...}` per current Stage 4A prompt.
- **Flat-legacy (live in Notion mappers at workflow.ts:7570–7919, 8071–8376):** `scoring_breakdown.{topical_relevance,market_indicators,oem_validation,adoption_success_story,strategic_context}.reasoning`, `scoring_breakdown.penalties.{geographic,sector}.reasoning`, `scoring_breakdown.competitor_intel.note`, `scoring_breakdown.calculation_summary.{penalty_total,component_total,final_score,penalties_applied.*}`.

**Decision:** service emits the canonical pathway-specific shape PLUS a **translation shim** that populates the legacy flat-schema fields from the canonical tree until the Notion mappers are migrated in a follow-up PR. The shim lives in `app/schemas/legacy_shim.py`, is unit-tested against current Notion outputs, and is removed when every flat-schema reference in `workflow.ts` is gone.

`competitor_intel` lives at `analysis.scoring_breakdown.competitor_intel.{is_competitor, competitor_name, note}` — **nested inside `scoring_breakdown`**, to match live mappers (not top-level as originally drafted).

**Byte-compatible** with every existing downstream consumer:

```jsonc
// Pathway A/B/C response (non-D pathways omit D fields entirely — do not emit as null)
{
  "analysis": {
    "pathway": "A" | "B" | "C",
    "decision": "SURFACE" | "REJECT",
    "total_score": 0,
    "priority_band": "MUST-READ" | "STRONG" | "MARGINAL" | "REJECT",
    "threshold_met": true | false,
    "active_scoring_components": "Project Scale: £10bn LTC | Timeline: 2026 start | ...",

    "scoring_breakdown": {
      "pathway_a": { /* fuel_type_gate, substance_gate, operational_deployment, ... */ } | null,
      "pathway_b": { /* vip_confirmation, project_scale, timeline_urgency, ... */ } | null,
      "pathway_c": { /* policy_scale, timeline_implementation, ... */ } | null,

      // competitor_intel nested here to match live Notion mappers
      "competitor_intel": { "is_competitor": bool, "competitor_name": "..." | null, "note": "..." },

      // Legacy-flat shim, populated from canonical tree, removed after Notion mapper migration
      "topical_relevance":        { "reasoning": "..." },
      "market_indicators":        { "reasoning": "..." },
      "oem_validation":           { "reasoning": "..." },
      "adoption_success_story":   { "reasoning": "..." },
      "strategic_context":        { "reasoning": "..." },
      "penalties":                { "geographic": { "reasoning": "..." }, "sector": { "reasoning": "..." } },
      "calculation_summary":      { "penalty_total": 0, "component_total": 0, "final_score": 0,
                                    "penalties_applied": {} }
    },

    "strategic_summary": "...",
    "key_highlights": ["...", "...", "..."],
    "recommended_action": "...",

    // Additive (R14) — new consumers read, existing ignore
    "classifier_tier": "rules" | "classifier" | "llm" | "classifier_escalation_unavailable",
    "confidence": 0.0-1.0,
    "service_version": "1.x.y",
    "degraded": false  // true only when escalation attempted but unreachable
  }
}

// Pathway D response (byte-matches current Stage 4B code-node output at workflow.ts:6294-6309)
{
  "analysis": {
    "pathway": "D",
    "decision": "SURFACE",
    "total_score": 10,
    "priority_band": "EXPERT",
    "threshold_met": true,
    "active_scoring_components": "Type: ... | Topic: ... | Relevance: ...",
    "scoring_breakdown": null,                    // literal null, not empty object
    "strategic_summary": "...",
    "key_highlights": [...],
    "recommended_action": "...",
    "vertical": "Expert",
    "content_type": "research_paper" | ...,
    "topic_summary": "...",
    "syntech_relevance": "...",
    "classifier_tier": "rules",
    "confidence": 1.0,
    "service_version": "1.x.y"
  }
}

// Stage-3-reject (no pathway evaluable) response
{
  "analysis": {
    "pathway": "A",                               // default; templated rejection on A's shape
    "decision": "REJECT",
    "total_score": 0,
    "priority_band": "REJECT",
    "threshold_met": false,
    "active_scoring_components": "",
    "scoring_breakdown": {
      "pathway_a": { "fuel_type_gate": { "points": 0, "passed": false,
                       "evidence": "No biofuel/VIP/policy signal detected at routing." },
                     /* all other components: points 0, evidence null */ },
      "pathway_b": null, "pathway_c": null,
      "competitor_intel": { "is_competitor": false, "competitor_name": null, "note": null },
      /* legacy shim fields populated with empty reasoning */
    },
    "strategic_summary": "Routed-reject: no relevance signal.",
    "key_highlights": [],
    "recommended_action": "No action — filtered at routing tier.",
    "classifier_tier": "rules",
    "confidence": 1.0,
    "service_version": "1.x.y"
  }
}
```

**Pydantic-enforced invariants** (`app/schemas.py`):
- `(decision == "REJECT") iff (priority_band == "REJECT")`
- Pathway D: `scoring_breakdown is None` and D-specific fields are non-null strings
- Pathway A/B/C: D-specific fields absent from output (not emitted as null)
- For every `<component>.points > 0` on the active pathway: `<component>.evidence` must be a non-empty string
- `classifier_tier == "classifier_escalation_unavailable"` iff `degraded == true`

Rejects emit with `decision: "REJECT"`, `priority_band: "REJECT"`, `total_score < 3`, and `scoring_breakdown` populated on the evaluated pathway so reviewers see *why*. Zero-point components on the active pathway may have null evidence; inactive pathways remain null.

### Cascade logic

**Rules tier (R3).** Pure Python, zero LLM tokens. Implements Stage 1 (source autos + fossil-fuel reject + biofuel/VIP/policy keyword auto-pass), Stage 2 (VIP-in-headline → VIP_PASS, mention-count + substance check), Stage 3 (pathway routing A→B→C priority with competitor-permissive-bias and LinkedIn autos). Resolves ~60–75% of articles including all hard rejects (no keyword, no VIP, no policy) and all obvious passes (biofuel in title, VIP in headline, Customer LinkedIn → Pathway B, Expert LinkedIn → Pathway D). For rules-tier decisions, `scoring_breakdown` evidence strings are templated from the triggered rule AND include the matched source span (top-ranked sentence via reranker or the keyword hit location) — reviewers never see a generic template without traceability. `source_platform` and `source_category` match case-insensitively (`"linkedin"` vs `"LinkedIn"`).

**Rules-vs-classifier precedence (R2).** Two classes of rules:
- **Hard-win rules** (bypass classifier entirely): source autos (Expert-LinkedIn → Pathway D; Customer-LinkedIn → Pathway B; fossil-fuel-only reject when no biofuel signal).
- **Soft-win rules** (classifier may override if confidence ∈ [0.35, 0.65]): VIP-in-headline, keyword auto-pass, Pathway A→B→C priority. Classifier can flip low-confidence rule verdicts upward (surface→reject or cross-pathway); cannot flip high-confidence.
- **Competitor LinkedIn permissive bias** is *both* a routing hint (rules tier, soft-win) and a scoring feature (`is_competitor=true` passed to classifier + scoring code applies the legacy scoring offset). Two sites, consistent behavior.

**Classifier tier (R4).** For articles not resolved by rules:

1. Compute `text-embedding-3-small` on `title + summary` (cache hit from pgvector if seen before — re-embed only on model-version bump).
2. `bge-reranker-v2-m3` scores article against a per-pathway "pathway description" anchor text (framed as NLI). Yields per-pathway relevance scores.
3. SetFit pathway head (trained on `bge-small-en-v1.5` embeddings via contrastive pairs) predicts `(pathway, surface/reject, confidence)`.
4. LightGBM regression heads per active pathway predict per-component point values (0–3 buckets), producing the `scoring_breakdown` structure with templated evidence.
5. Isotonic regression calibrates SetFit confidence to true probability on held-out gold.

If calibrated confidence falls in the escalation band `[0.35, 0.65]` (configurable in `thresholds.yaml`), escalate. Otherwise emit directly with `classifier_tier: "classifier"`.

**LLM escalation tier (R5).** Pathway-specific prompt, structured output (Anthropic structured-outputs beta OR OpenAI `response_format: json_schema` with `strict: true`). Few-shot examples selected via **kNN-ICL**: nearest 5 gold exemplars by embedding cosine, 2 from the classifier's predicted pathway and 3 from boundary pathways to sharpen the edge. Schema-enforced `evidence` strings on every awarded component. Emits with `classifier_tier: "llm_escalation"`.

**Pathway D (R6).** Expert LinkedIn always surfaces. Small LLM extraction pass fills `content_type`, `topic_summary`, `syntech_relevance`, `key_highlights`. No scoring, no escalation logic. `total_score = 10`, `priority_band = "EXPERT"`.

**Score math (R7).** Deterministic. Same logic as the current n8n code node (`decision = total_score >= 3 ? SURFACE : REJECT`, bands at 10/6/3), with:
- **Pathway C `tol_score` typo fixed** — actual `total_score` summed from all four Pathway C components.
- Pathway D short-circuit preserved (`total_score = 10`, `priority_band = "EXPERT"`, `threshold_met = true`).
- Unit test in `test_scoring.py` freezes the bug fix into CI forever.

### Data model (Neon pgvector) — schema `classifier_relevance`

**Schema ownership:** this service creates its own Postgres schema `classifier_relevance` and writes only to tables therein. `articles` is owned by the sibling article-classifier service (sole writer); this service reads it by FK on `url_canonical`. Alembic `version_table_schema` pinned to `classifier_relevance` so heads never collide across services.

**URL canonicalization.** Raw URLs break on trailing slashes, `utm_*`/`gclid`/`fbclid`, scheme/host case, `www.` prefix, fragments. `app/url_canonical.py` normalizes (lowercase host, scheme `https`, strip `www.`, strip tracking params by allowlist, strip fragment, strip trailing `/`). Canonical URL is the join key across services and the training pipeline.

```sql
CREATE SCHEMA IF NOT EXISTS classifier_relevance;
SET search_path = classifier_relevance, public;

-- Read-only reference to articles (owned by sibling service)
-- CREATE FOREIGN TABLE or view if in different schema; here assumed same Neon DB.

CREATE TABLE decisions (
  id                     bigserial,
  article_id             uuid NOT NULL,
  url_canonical          text NOT NULL,
  decided_at             timestamptz NOT NULL DEFAULT now(),
  service_version        text NOT NULL,
  artifact_version       text NOT NULL,  -- sha256[:12] of model bundle, or 'none' in Phase 1
  classifier_tier        text NOT NULL CHECK (classifier_tier IN
                            ('rules','classifier','llm','classifier_escalation_unavailable')),
  confidence             real CHECK (confidence IS NULL OR (confidence >= 0.0 AND confidence <= 1.0)),
  degraded               boolean NOT NULL DEFAULT false,
  pathway                text NOT NULL CHECK (pathway IN ('A','B','C','D')),
  decision               text NOT NULL CHECK (decision IN ('SURFACE','REJECT')),
  total_score            int NOT NULL,
  priority_band          text NOT NULL,
  analysis_blob          jsonb NOT NULL,
  escalation_cost_usd    numeric(10,6),
  latency_ms             int,
  shadow                 boolean NOT NULL DEFAULT false,  -- shadow-run isolation flag
  PRIMARY KEY (id, decided_at)
) PARTITION BY RANGE (decided_at);

-- Monthly partitions; cron job creates next-month partition; 180-day retention, then archive to R2.
CREATE INDEX decisions_article_id ON decisions (article_id, decided_at DESC);
CREATE INDEX decisions_url        ON decisions (url_canonical, decided_at DESC);
CREATE INDEX decisions_decided_at ON decisions USING BRIN (decided_at);

CREATE TABLE labels (
  id                     bigserial PRIMARY KEY,
  article_id             uuid NOT NULL,
  url_canonical          text NOT NULL,
  labeled_at             timestamptz NOT NULL DEFAULT now(),
  source                 text NOT NULL CHECK (source IN
                            ('gold','notion_surfaced','stage4a_reject','active_learning')),
  labeler                text NOT NULL,
  pathway                text,
  decision               text,
  scoring_breakdown      jsonb,
  confidence_weight      numeric(3,2) NOT NULL CHECK (confidence_weight BETWEEN 0.0 AND 1.0),
  UNIQUE (url_canonical, source, labeler, pathway)  -- business key, append-only
);

CREATE TABLE shadow_disagreements (
  id                     bigserial PRIMARY KEY,
  url_canonical          text NOT NULL,
  observed_at            timestamptz NOT NULL DEFAULT now(),
  legacy_analysis        jsonb NOT NULL,
  service_analysis       jsonb NOT NULL,
  kind                   text NOT NULL  -- 'decision' | 'pathway' | 'score_delta' | 'priority_band'
);

-- Training-label precedence view: gold > notion_surfaced > stage4a_reject > active_learning
CREATE VIEW v_training_labels AS
SELECT DISTINCT ON (url_canonical)
  url_canonical, source, labeler, pathway, decision, scoring_breakdown, confidence_weight
FROM labels
ORDER BY url_canonical,
  CASE source WHEN 'gold' THEN 1 WHEN 'notion_surfaced' THEN 2
              WHEN 'stage4a_reject' THEN 3 ELSE 4 END,
  labeled_at DESC;
```

**Migrations run on direct Neon endpoint**, not the pooler (`DATABASE_URL_DIRECT` env, separate from `DATABASE_URL`). Alembic `upgrade head` runs in Railway release phase once per deploy, not per instance.

### Auth, transport, and deadlines (R11)

**Two separate tokens** (split from original single-token design after security review):
- `RELEVANCE_CLASSIFIER_TOKEN` — authorises `/classify` only. Held by n8n. Comma-split list for rotation.
- `RELEVANCE_ADMIN_TOKEN` — authorises `/admin/*` endpoints (relabel, retrain, model promote/rollback, config reload). Separate value, rotated independently, rate-limited (60 req/min/token). Prevents n8n workflow token compromise from poisoning the training set.

```python
# app/auth.py
class TokenSet:
    def __init__(self, env_var: str):
        self._tokens = frozenset(t.strip() for t in os.environ[env_var].split(",") if t.strip())
    def verify(self, bearer: str) -> bool: return bearer in self._tokens

CLASSIFIER_TOKENS = TokenSet("RELEVANCE_CLASSIFIER_TOKEN")
ADMIN_TOKENS      = TokenSet("RELEVANCE_ADMIN_TOKEN")
```

n8n credentials created via `npx --yes n8nac credential create --file` (never inline per AGENTS.md §727–737). Startup log line emits `sha256(token)[:8]` fingerprints (never values) of all active tokens for rotation verification.

**Rotation runbook** (documented in service README):
1. Add new token to comma-split env (Railway variables), redeploy.
2. Rotate n8n credential to new token, test execution.
3. Verify via classifier fingerprint logs that both tokens are seen.
4. Remove old token from env, redeploy.

**Request-level deadline: 15s hard cap** via `asyncio.wait_for` around the full cascade. Propagated to all upstream calls:

| Upstream | Connect | Read | Total | Retries |
|---|---|---|---|---|
| OpenAI embeddings | 2s | 5s | 8s | 1 (n8n retries the whole call) |
| Anthropic escalation | 2s | 8s | 10s | 0 (direct fallback to OpenAI) |
| OpenAI fallback (gpt-4o-mini) | 2s | 6s | 8s | 0 |
| Neon query | — | `statement_timeout=3s` | 3s | 0 (async log is fire-and-forget) |
| Neon pool acquire | — | — | 500ms | 0 (fail-fast, don't stack) |

n8n HTTP node sets `retryOnFail: true, waitBetweenTries: 5000` (up to 3 tries). Because the service caps internal retries at ≤1 and has a 15s deadline, the worst-case amplification is 3× (n8n only), not 27× (compounding).

**SSRF enforcement.** `httpx.AsyncClient` uses a custom transport with a host allowlist (Anthropic, OpenAI, Neon pooler only). Unit test asserts requests to `169.254.169.254`, `10.0.0.0/8`, `127.0.0.1`, `fd00::/8` are refused. No user-controlled URL is ever resolved server-side.

**Prompt injection defense.** Article content fenced with `<article_untrusted>…</article_untrusted>` in the escalation prompt. System message explicitly states that article text is data, not instructions. Content capped at 8KB before prompt assembly. `tests/fixtures/injections/` contains payloads that attempt to flip pathway/decision/score; regression test asserts the service ignores them.

### n8n cutover (R1, R16)

Procedure, per `AGENTS.md` §152–189 and repo-research-analyst findings:

1. `npx --yes n8nac pull UzEv74M2D2q4z0Zx` — pull latest workflow TS.
2. `python execution/sync_prompts.py check workflows/.../News\ Sourcing\ Production\ \(V2\).workflow.ts` — confirm no UI drift before editing.
3. In `workflow.ts`, replace five Basic LLM Chain nodes (Stages 1, 2, 3, 4A, 4B at node_ids `cd2c63a0-…`, `204327f7-…`, `b16581b0-…`, `7a8e8544-…`, `e8a4c711-…`) **and** the JS `PerformFinalCalculation` code node (workflow.ts:6286-6440) with one `n8n-nodes-base.httpRequest` node. Copy template from workflow.ts:2520–2543 (`predefinedCredentialType` + `sendHeaders` + `sendBody/specifyBody:'json'` + `jsonBody`). Set `retryOnFail: true`, `waitBetweenTries: 5000`, `onError: 'continueErrorOutput'` — downstream error branches assume this shape.
4. Wire HTTP node's main output as `json.analysis` so the existing Pathway Router, Notion mappers, and Set-score nodes (which read `$json.analysis.*`) continue to work unchanged.
5. **Delete** prompt MDs `prompts/news-sourcing-production/stage_{1,2,3,4a,4b}.md` — frontmatter links orphaned node_ids; keeping them triggers sync drift alarms.
6. `python execution/sync_prompts.py check` must pass.
7. `npx --yes n8nac push workflows/.../News\ Sourcing\ Production\ \(V2\).workflow.ts` — pre-push hook runs check again if `git config core.hooksPath .githooks` has been set per clone.
8. `npx --yes n8nac test UzEv74M2D2q4z0Zx` — trigger a test execution end-to-end.

**Coordinate with the sibling article-classifier cutover.** Both services edit the same `workflow.ts`; `npx n8nac push` is last-write-wins at file granularity. Sequence: ship the relevance classifier cutover first (upstream in the pipeline); then article-classifier cutover pulls, replays its changes, and pushes.

**Schema audit before go-live (R16):** grep the workflow for legacy flat-schema references (`scoring_breakdown.topical_relevance`, `.market_indicators`, `.oem_validation`, `.adoption_success_story`, `.strategic_context`, `.penalties.geographic`, `.penalties.sector`, `.competitor_intel.note`). Any live consumers either (a) get updated to pathway-specific schema, or (b) kept as dead branches to be cleaned up post-cutover. Trace every one; do not assume they're dead.

### Key code snippets

**FastAPI lifespan loading models once:**
```python
# app/main.py
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    state["embeddings"] = OpenAIEmbedder()
    state["reranker"] = CrossEncoder("BAAI/bge-reranker-v2-m3", max_length=512)
    state["pathway_clf"] = SetFitModel.from_pretrained("./models/setfit")
    state["component_clfs"] = {p: lgb.Booster(model_file=f"./models/lightgbm_{p}.txt") for p in "abc"}
    state["calibrators"] = {p: joblib.load(f"./models/calibrator_{p}.pkl") for p in "abc"}
    state["db"] = await asyncpg.create_pool(settings.DATABASE_URL, statement_cache_size=0)
    yield
    await state["db"].close()

app = FastAPI(lifespan=lifespan)
```

**Structured output via Anthropic structured-outputs beta:**
```python
# app/cascade/escalation.py
resp = await client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": build_prompt(article, few_shots)}],
    extra_headers={"anthropic-beta": "structured-outputs-2025-11-13"},
    output_format={"type": "json_schema", "schema": PATHWAY_SCHEMAS[pathway]},
)
return json.loads(resp.content[0].text)
```

### Agent control plane (AGENTS.md §5–25)

Every operational action must have both a CLI script in `scripts/` and an HTTP endpoint under `/admin/*` so agents (Layer 2) can orchestrate Layer-3 deterministic actions without a human in the loop.

| Operation | CLI | HTTP | Auth |
|---|---|---|---|
| Classify an article | `scripts/classify.py --url …` | `POST /classify` | classifier token |
| Explain a decision | `scripts/explain_decision.py --url …` | `GET /decisions?url_canonical=…` | admin token |
| Sample articles for review | `scripts/sample_for_review.py --n 10 --out .tmp/review.jsonl` | `GET /admin/active_learning/sample` | admin token |
| Submit relabels (batch) | `scripts/relabel.py --batch labels.jsonl [--dry-run]` | `POST /admin/relabel` | admin token |
| Retrain on demand | `scripts/retrain.py [--dry-run]` | `POST /admin/retrain` → returns job_id | admin token |
| Check retrain job | `scripts/job_status.py --id …` | `GET /admin/jobs/{id}` | admin token |
| Promote a model | `scripts/promote_model.py --version <sha>` | `POST /admin/model/promote` | admin token |
| Rollback model | `scripts/rollback_model.py --to <sha>` | `POST /admin/model/rollback` | admin token |
| Current model version | `scripts/current_model.py` | `GET /admin/model/current` | admin token |
| Reload config (keywords, thresholds) | `scripts/update_config.py --file …` | `POST /admin/config/reload` | admin token |
| Shadow-run report | `scripts/shadow_report.py --since …` | `GET /admin/shadow/disagreements` | admin token |

All scripts emit JSON on stdout (per AGENTS.md §99–110), support `--dry-run` + `--mock`, and incremental-save intermediate state to `.tmp/` for resume-on-failure.

**Health endpoints return structured JSON**, not bare 200:

```json
// GET /healthz — liveness (always 200 once process is up)
{"status":"ok","service_version":"1.2.3","pid":1234}

// GET /readyz — readiness (200 only after lifespan complete and all dependencies reachable)
{
  "status":"ready",
  "service_version":"1.2.3",
  "artifact_version":"a7f3c9d1",
  "embedding_model_version":"text-embedding-3-small",
  "checks":{"db":"ok","anthropic":"ok","openai":"ok","models":"ok"},
  "degraded_mode":false,
  "escalation_fallback_active":false
}
```

**Model promotion is programmatic**, not env-var-and-redeploy. Service reads `active_artifact_version` from a `model_versions` table at boot and on SIGHUP; `scripts/promote_model.py` updates the row + signals the service. Rollback is symmetric.

**Startup in degraded mode.** If a model artifact fails to load (corrupt file, HF download hiccup), service boots with `degraded_mode: true`, serves only rules + LLM-escalation tier for affected pathways, and surfaces the state via `/readyz` + Slack alert. Does not crash-loop.

**Pathway C bug fix (frozen in test):**
```python
# tests/test_scoring.py
def test_pathway_c_total_score_fixed():
    breakdown = {"pathway_c": {
        "policy_scale": {"points": 5},
        "timeline_implementation": {"points": 3},
        "syntech_alignment": {"points": 3},
        "market_opportunity": {"points": 2},
    }}
    assert compute_total("C", breakdown) == 13  # was 0 under tol_score typo
```

### Implementation Phases

Two phases, matching sibling-plan convention (2 phases per simplicity review). Phase 1 ships a functional replacement with cost savings but without the learned classifier tier; Phase 2 adds the classifier and active-learning loop.

#### Phase 1: Rules + LLM-escalation + cutover (ship-ready in isolation)

**Slimmed from the original draft after simplicity review.** Phase 1 has no classifier tier, no embedding cache, no pgvector, no SetFit/LightGBM/reranker/calibration, no active-learning loop, no nannyml/cleanlab/distilabel — **rules + LLM-escalation + scoring + cutover only**. This alone delivers ~60% of the cost win (Stage 1–3 token waste eliminated; Stage 4A bypassed on ~60–75% of articles) and full behavioral parity. Classifier scaffolding lands in Phase 2's branch, not as Phase 1 scaffolding.

Deliverables:
- `syntech-biofuel-relevance-classifier` repo skeleton: `uv` project, Dockerfile (binds `::`), `railway.toml`, split auth middleware (`RELEVANCE_CLASSIFIER_TOKEN` + `RELEVANCE_ADMIN_TOKEN`), structured `/healthz`/`/readyz` JSON, structlog with `BaseHTTPMiddleware` + `clear_contextvars()` per request, Pydantic v2 schemas with discriminated-union `scoring_breakdown` + invariant validators.
- Neon schema `classifier_relevance.*` via alembic (migrations via direct endpoint, release phase only): `decisions` (partitioned monthly, BRIN on decided_at, 180-day retention + R2 archive), `labels`, `shadow_disagreements`, `v_training_labels` view.
- Rules engine (`app/cascade/rules.py`): every Stage 1–3 branch, hard-win vs soft-win distinction, case-insensitive source matching, schema-validated YAML load with non-empty-list canary at startup. Keyword/VIP lists in **one** `config/config.yaml` (not four files).
- Scoring module (`app/scoring.py`): deterministic totals, Pathway-C tol_score-class prevention via hypothesis property tests across all pathways. Frozen unit tests for the Sizewell C and Uzbekistan brainstorm examples.
- Evidence-string schema enforcement (Pydantic validator) — awarded components must carry non-empty evidence; zero-point components on active pathway MAY be null; inactive pathways MUST be null on A/B/C and `scoring_breakdown: null` on D.
- Legacy-flat-schema translation shim (`app/schemas/legacy_shim.py`) populating `scoring_breakdown.{topical_relevance,market_indicators,oem_validation,adoption_success_story,strategic_context,penalties.*,calculation_summary}` from the canonical tree. Unit-tested against captured live Stage 4A outputs in `tests/fixtures/legacy_shim/`.
- LLM-escalation tier (`app/cascade/escalation.py`): pathway-specific prompts, structured-outputs beta schema, kNN-ICL few-shot (Phase 1: static exemplars from gold set; Phase 2 switches to dynamic nearest-neighbour). 15s request deadline, explicit timeouts, Haiku 4.5 → gpt-4o-mini fallback with `classifier_tier: "classifier_escalation_unavailable"` + `degraded: true` on fallback-of-fallback. Benchmark Haiku vs gpt-4o-mini on 50-article escalation sample → pick and commit.
- Prompt-injection defense: delimiter fencing, hardened system prompt, 8KB content cap, `tests/fixtures/injections/` regression suite.
- Pathway D extraction (small LLM, content tag + topic + relevance + highlights).
- Agent control plane (Phase 1 subset): `scripts/classify.py`, `scripts/explain_decision.py`, `GET /decisions?url_canonical=…`, `POST /admin/config/reload`, `scripts/update_config.py`. Training-related CLIs land in Phase 2.
- URL canonicalization module (`app/url_canonical.py`) with table-driven tests.
- ETL script `scripts/etl_training_data.py` consolidates 4 tiers into `labels` table (dead-letter table for parse failures, Notion cursor checkpoint, per-article upsert in Neon tx). Agent-native JSON-on-stdout.
- `scripts/eval_parity.py`: SURFACE/REJECT + pathway agreement against held-out gold (bootstrap 95% CI, per-pathway minimum-N≥20 or fails-open-with-review). Reports Stage-4A self-disagreement baseline (same article twice) before declaring service parity threshold.
- `scripts/shadow_run.py` with isolation: separate API keys (or rate-limit sub-budget), Neon branch for writes, `shadow=true` on every row. 3–5 day run, logs to `shadow_disagreements`.
- n8n cutover (coordinate with sibling, ship first): replace 5 LLM nodes + code node with one HTTP Request node (workflow.ts:2520–2543 pattern), rewire `Evaluation1.actualAnswer` (workflow.ts:1734) to new node output, delete the 5 prompt MDs, run `sync_prompts.py check`, `npx n8nac push`. Tag `pre-biofuel-cutover` before pushing for rollback.
- Schema audit (R16): grep `workflow.ts` for every legacy-flat-schema reference; the translation shim serves them, migration to canonical is a separate follow-up PR.
- Deployment Go/No-Go checklist (see §Deployment).
- `docs/solutions/2026-railway-python-service.md` + `docs/solutions/2026-n8n-to-microservice-cutover.md` written as Phase 1 closes.

Success gates (all required):
- p95 < 1.5s rules tier; p95 < 4s escalation tier (revised down from <500ms/<3s after performance review flagged unrealistic budgets on Railway 1vCPU; bump to 2vCPU / 4GB if tighter is needed).
- Shadow run: SURFACE/REJECT agreement ≥ (Stage-4A self-disagreement baseline + 5pp). Pathway agreement ≥ 90%. No pathway has < 20 shadow samples in the measurement window.
- Pathway C scoring correct (property-tested, not just the one case).
- Evidence strings populated on every awarded component on the active pathway.
- Legacy-shim outputs byte-match captured live Stage 4A outputs on ≥ 20 fixtures per pathway.
- `Evaluation1.actualAnswer` resolves to a non-null value post-cutover.
- Rollback procedure dry-run succeeded.

#### Phase 2: Classifier tier + active-learning loop

Insert the learned classifier between rules and LLM-escalation so escalation drops to the calibrated uncertainty band only. Start the active-learning flywheel.

Deliverables:
- pgvector HNSW (`m=16, ef_construction=128`, `ef_search=40` default / `=100` for kNN-ICL retrieval) on `articles.embedding`. 1536-dim `text-embedding-3-small` via Batch API for backfill (50% discount), sync for live.
- `scripts/train_setfit.py` — trains pathway classifier on `v_training_labels`. Gold oversampled 5× with gold-never-in-held-out disjoint-split discipline (leakage guard asserted in test). `cleanlab` pass flags label noise on weak rows only (gold is exempt).
- Shared `app/features.py` featurizer used by both training scripts and serving cascade (prevents train/serve skew).
- `scripts/train_lightgbm.py` — per-pathway component regression heads. **Pathway C weak labels dropped** (today's tol_score zeros would teach the model REJECT is always Pathway C). Pathway C model trains on gold + post-cutover-corrected data only; until N≥30 gold for C, service routes Pathway C straight to LLM.
- `scripts/calibrate.py` — isotonic regression with a flatness sanity test: calibrator is rejected if output range < 0.3 or the curve is flat within 5%; falls back to raw SetFit probability with a wider escalation band `[0.40, 0.60]`.
- Classifier tier wiring (`app/cascade/classifier.py` + `reranker.py`): ONNX-INT8 quantized `bge-reranker-v2-m3` (via `optimum` export + `onnxruntime` — not PyTorch fp16; drops model size ~4×, latency 2–4×). Model artifacts stored in R2 with sha256-pinned `manifest.json`; `joblib.load` replaced with `skops`/`safetensors` (eliminates pickle RCE). Load path: `def` route handlers with sync inference wrapped in `anyio.to_thread.run_sync`.
- kNN-ICL fallback: gold-same-pathway → gold-any-pathway → Notion-verified. Minimum-k assertion with degraded-mode log when unmet. Pin LLM temperature=0 + seed for determinism.
- Active-learning sampler (`app/active_learning/sampler.py`): uncertainty (calibrated p near 0.5) + disagreement (classifier vs escalation LLM) + drift-triggered (PSI > 0.2). `scripts/sample_for_review.py` emits CSV for Tim's review; `scripts/relabel.py` ingests corrections into `labels`. Sampler reads only from `decisions WHERE shadow = false AND confirmed = true` (confirmed = n8n successfully wrote to Notion; Phase 2 adds an outbox reconciler).
- `scripts/retrain.py` — manual run-on-demand; automation via Railway cron is deferred until the manual cadence proves stable. Atomic artifact swap (sha256-pinned), post-promotion canary window (next 100 live decisions shadow-scored by previous model, auto-revert on >2pp delta), alerting on retrain-job non-zero exit.
- No-per-pathway-regression gate: bootstrap 95% CI macro-F1 per pathway; blocks promotion if any pathway's lower CI falls more than 1pp below previous model. Pathways with < 20 held-out examples skip the gate and emit a warning (don't fail closed on too-small slices).
- `scripts/eval_llm_judge.py` — pairwise + rubric + position-swap against Gemini 2.5 Pro (cross-family judge). Quarterly. Correlation with Tim's gold labels tracked; judge retired if correlation drops below 0.7.
- `nannyml` weekly PSI alarm on embedding centroids per pathway; structured JSON report via `scripts/drift_report.py`.
- Flip n8n HTTP Request node to production URL (from Phase-1 shadow URL); 1-week canary under close monitoring (thresholds in §Deployment).
- Phase 2 agent-control-plane endpoints activated: `POST /admin/retrain`, `/admin/model/{promote,rollback,current}`, `/admin/active_learning/sample`, `/admin/shadow/disagreements`, `GET /admin/jobs/{id}`.
- `docs/solutions/2026-active-learning-loop.md`.

Success: escalation rate drops from Phase-1 baseline by ≥30% over 4–8 weeks; LLM-judge rubric score on fresh audit set matches or exceeds Phase-1 baseline; daily cost < £2; calibration sanity test has rejected at least one degenerate calibrator (proving the guard works); no-per-pathway-regression gate has blocked at least one bad retrain.

## Alternative Approaches Considered

| Approach | Why rejected |
|---|---|
| Single compressed small-LLM prompt (all 5 stages in one Haiku 4.5 call) | No quality lift vs today — still prompt-engineering bound. Doesn't satisfy the "better filter" half of the brainstorm goal. Brainstorm §Approaches Approach 2. |
| Fine-tuned self-hosted transformer (ModernBERT on all training data) | Premature for ~100 articles/day and 50–60 gold labels. Needs ≥500 examples/class to beat SetFit. Biggest upfront investment, worst quality/effort ratio at current scale. Revisit at 6-month mark. Brainstorm §Approaches Approach 3. |
| Keep code in this n8n-as-code repo | ML dependencies (torch, FlagEmbedding) are heavy and don't belong next to n8n workflow source. Separate repo matches sibling `syntech-article-classifier`, enables independent CI/deploy/versioning. |
| 3-phase plan (rules → classifier → active learning) | Chose 2 phases to match sibling-plan simplicity convention and to ship cost savings in Phase 1 before investing in classifier complexity. |
| Cohere Rerank API instead of self-hosted BGE | Adds an external API dependency the brainstorm is explicitly trying to escape. Quality win is marginal; BGE-reranker-v2-m3 is best-in-class self-hosted in 2026. |
| Snorkel for weak supervision | OSS Snorkel is effectively in maintenance; commercial Snorkel Flow absorbed active dev. Cleanlab + simple labeling functions covers our needs with 20 lines instead of a framework. |
| GPT-5-mini over Haiku 4.5 for escalation | Benchmarked in Phase 1 rather than pre-committed. Anthropic's structured-outputs beta + prompt caching may tip cost/quality. Pick on evidence. |

## System-Wide Impact

### Interaction graph

Live n8n path today:
- `Deduplicated Articles` → Stage 1 LLM → Stage 2 LLM → Stage 3 LLM → Pathway Router Switch → (Stage 4A LLM | Stage 4B LLM) → `PerformFinalCalculation` code node → Set nodes → `Map Data for Notion` / `Map Data for Notion1` → Notion create/update → Slack alerting branch (via `continueErrorOutput`).

After cutover:
- `Deduplicated Articles` → HTTP Request (`/classify`) → same Pathway Router Switch (still reads `$json.analysis.pathway`) → same Set nodes (still read `$json.analysis.*`) → same Notion mappers → same Slack branch. Error output on HTTP Request continues to route to the existing error branch unchanged.

Inside the service:
- `/classify` → rules.evaluate() → (classifier.predict() if Phase 2) → (escalation.call_llm() if uncertain) → scoring.compute() → decisions.log() async → response.

### Error and failure propagation

- **Service 5xx / timeout** → HTTP Request node `onError: 'continueErrorOutput'` → existing Slack error branch fires. Retry: `retryOnFail: true, waitBetweenTries: 5000` covers transient network + embedding/LLM upstream 429s.
- **OpenAI embedding 429** → internal exponential-backoff retry (httpx.AsyncClient with `Retry` transport), up to 3 attempts; cached embedding on hit avoids the call entirely.
- **Anthropic escalation 429** → fall back to OpenAI gpt-4o-mini if configured; otherwise return last-classifier-tier decision with `classifier_tier: "classifier"` and log the escalation miss. Never emit a 500 on a recoverable upstream failure.
- **Neon connection loss** → classification succeeds (decisions log is best-effort async); health check flips to degraded but `/classify` stays green unless pool is fully exhausted.
- **Rules / classifier / escalation internal exception** → return structured error envelope `{status: "error", error_code, message}` per AGENTS.md §99–132 with HTTP 500. HTTP Request node routes to error output.

### State lifecycle risks

- **Embedding cache staleness on model-version bump.** `embedding_version` column forces re-embed when the OpenAI model changes. CI gate fails the build if `EMBEDDING_MODEL_VERSION` env mismatches the persisted fixture baseline without an accompanying migration.
- **Classifier model drift.** No-per-pathway-regression promotion gate; rollback is a `MODEL_VERSION` env change + restart. Previous model artifacts retained for 30 days.
- **Partial write on `decisions` log.** Async write; failure logs to stderr and continues. Classification response is unaffected (best-effort telemetry). Row count drift alarm in Phase 2 monitoring catches silent loss.
- **Duplicate URL on re-classification.** `articles.url` is PK; re-classification updates the `decisions` row with a new entry, preserving history.
- **Notion backfill idempotency.** `scripts/backfill_notion.py` uses `INSERT ... ON CONFLICT (url) DO UPDATE` so re-runs are safe.

### API surface parity

- Existing Pathway Router, Set nodes, Notion mappers read `$json.analysis.*`. Service matches this shape byte-compatibly.
- Legacy flat-schema references (`scoring_breakdown.topical_relevance`, `.market_indicators`, etc.) must be audited pre-cutover (Phase 1 deliverable). Current suspicion: stale code from pre-Stage-4-split. Confirmed dead branches are deleted post-cutover; live branches get a thin translation layer in n8n.
- The sibling article-classifier microservice reads the output of this service downstream (`FilterArticlesByTopic` at workflow.ts:1758–1849 is its replacement target). Its contract inputs must match what this service emits. Cross-check during cutover sequencing.

### Integration test scenarios

1. **Obvious Pathway B from VIP-in-headline (rules-tier).** Article "Balfour Beatty wins £800M highway contract" → `pathway: B, decision: SURFACE, total_score ≥ 5, classifier_tier: "rules"`. Latency < 100ms.
2. **Obvious Pathway A from biofuel keyword (rules-tier).** Article "John Deere approves B30 across Tier 4 engines" → `pathway: A, classifier_tier: "rules"`, evidence mentions B30 + OEM trigger.
3. **Hard reject (rules-tier).** Uzbekistan SAF project announcement → `pathway: A, decision: REJECT, total_score < 3`, evidence explains fuel-type-gate + substance-gate failure.
4. **Ambiguous case forces escalation.** Article with mixed biofuel/VIP signals and classifier confidence 0.45 → `classifier_tier: "llm_escalation"`, full evidence strings populated on every awarded component.
5. **Sizewell C regression test.** The article from the brainstorm example → `pathway: B, decision: SURFACE, total_score: 13, priority_band: "MUST-READ"` with non-null `project_scale.evidence`, fixing the current null-evidence bug.
6. **Pathway C article scores correctly.** Policy article → `total_score = sum of pathway_c components ≠ 0`, fixing the `tol_score` typo.
7. **Expert LinkedIn → Pathway D short-circuit.** Source_category=Expert + source_platform=LinkedIn → `pathway: D, total_score: 10, priority_band: "EXPERT"`, no scoring_breakdown, tag + summary only.
8. **Competitor LinkedIn permissive bias.** Borderline Pathway-A-or-reject article from competitor LinkedIn → surfaced with `competitor_intel.is_competitor: true, note: "Intel Only — internal monitoring, not for publishing"`.
9. **Service 500 → Slack alert fires.** Simulate upstream failure; verify `continueErrorOutput` branch runs.
10. **Re-classification is idempotent.** Same URL submitted twice yields matching `decision`/`total_score`/`pathway` and two `decisions` rows.

## Acceptance Criteria

### Functional requirements

- [ ] `POST /classify` returns byte-compatible `analysis` shape for all downstream n8n consumers. (R1, R14)
- [ ] Cascade executes rules → classifier → escalation → score math in order; short-circuits at earliest confident tier. (R2)
- [ ] Stages 1–3 logic runs as pure Python with zero LLM tokens, covering all current auto-routes and permissive-bias cases. (R3)
- [ ] Classifier tier emits calibrated confidence; escalation band configurable in YAML. (R4)
- [ ] LLM-escalation tier uses pathway-specific prompts, kNN-ICL few-shot, schema-enforced structured output with non-null evidence on every awarded component. (R5)
- [ ] Pathway D extraction returns `content_type`, `topic_summary`, `syntech_relevance`, `key_highlights` with `total_score: 10`, `priority_band: "EXPERT"`. (R6)
- [ ] Score math lives in service as unit-tested code with Pathway C `tol_score` typo fixed. (R7)
- [ ] ETL script produces four-tier training table keyed by URL with gold > Notion > Stage 4A precedence. (R8)
- [ ] Rejected articles flow through with full analysis blob on the evaluated pathway. (R15)
- [ ] n8n cutover replaces five LLM nodes + code node with one HTTP Request node; prompt MDs deleted; `sync_prompts.py check` passes. (R1, R16)

### Non-functional requirements

- [ ] p95 latency < 500ms for rules/classifier-tier decisions; p95 < 3s for escalation-tier. (R11)
- [ ] Daily LLM spend < £2/day steady state at current volume.
- [ ] Three additive observability fields (`classifier_tier`, `confidence`, `service_version`) present on every response. (R14)
- [ ] Service binds `::` (IPv6) and is reachable on Railway private network.
- [ ] Bearer auth with comma-split token rotation. (R11)
- [ ] All paths emit JSON; zero-result responses use `{status: "success", count: 0}` not silence. (AGENTS.md §99–110)
- [ ] Structured error envelope `{status, error_code, message}` on all failure paths. (AGENTS.md §99–132)
- [ ] SSRF protection: outbound calls restricted to Anthropic/OpenAI/Neon; RFC1918 + loopback + link-local blocked.
- [ ] External API schema validation on every OpenAI/Anthropic response before use.
- [ ] Prompt caching enabled on Anthropic calls where system prompt is static.

### Quality gates

- [ ] `pytest` covers rules tier branch-completely AND via fixture-level tests (not just keyword-table tests that couple to `config.yaml`).
- [ ] Property-based test (hypothesis) over scoring math across all four pathways prevents another tol_score-class typo.
- [ ] Parity test (`eval_parity.py`): SURFACE/REJECT agreement ≥ (Stage-4A self-disagreement baseline + 5pp); pathway agreement ≥ 90%; bootstrap 95% CI reported; minimum-N≥20 per pathway or fails-open-with-review. (R9)
- [ ] LLM-judge eval (`eval_llm_judge.py`): pairwise + rubric + position-swap with Gemini 2.5 Pro; quarterly + every retrain. Judge correlation with Tim's gold labels tracked; judge retired if correlation < 0.7. (R9)
- [ ] No-per-pathway-regression gate: bootstrap 95% CI, not point estimate; skips pathways with held-out N<20 with warning. (R10)
- [ ] Shadow run ≥3 days, Stage-4A self-disagreement baseline reported, ≤ (baseline + 5pp) disagreement. Shadow traffic uses separate API keys (or sub-budget) + Neon branch + `shadow=true` flag.
- [ ] Consumer-driven contract test: JSON-schema snapshot of service output for every pathway (A/B/C/D + Stage-3-reject) compared byte-for-byte against captured live Stage 4A output fixtures. Legacy-shim fields match.
- [ ] Pydantic invariants tested (positive + negative): `(decision == REJECT) iff (priority_band == REJECT)`; awarded components must have non-empty evidence (negative test: awarded + null evidence raises); Pathway D `scoring_breakdown: null` literal; non-D pathways omit D fields.
- [ ] Contract input-shape test: feed the literal `Deduplicated Articles` n8n output into `/classify` and assert 200 with correct pathway. Field-name parity (the n8n field is `source`, not `source_platform` — case & name must match).
- [ ] Integration scenario coverage expanded from 10 to ≥20 cases: Anthropic 429 → OpenAI fallback; escalation 5xx → `degraded: true`; Neon pool exhaustion → classification still 200s; embedding 429 with cache miss; Competitor LinkedIn borderline → permissive bias applied in both routing and scoring; Stage-3-reject end-to-end; Pathway D byte-match; SSRF guard rejects RFC1918; bearer rotation (old + new both valid during overlap); escalation-band edges (conf=0.35, 0.65 inclusive/exclusive).
- [ ] Load test (`scripts/load_test.py` via k6 or locust): p95 SLO at target concurrency + cold-start + burst.
- [ ] Chaos test: toxiproxy-simulated Neon drop, Anthropic 5xx, OpenAI 429. Service stays up + emits degraded `/readyz`.
- [ ] Migration idempotency test: clean Neon branch → alembic upgrade head twice → no errors; pgvector extension bootstrapped.
- [ ] Bearer rotation test: old + new both accepted during overlap window; old rejected post-rotation; whitespace-only entries in comma-split are filtered.
- [ ] SSRF test: httpx outbound refuses link-local, RFC1918, loopback.
- [ ] Log redaction test: forced pool-init failure does not leak `DATABASE_URL` or bearer tokens in structlog output.
- [ ] Model artifact hash verification test: tampered manifest.json prevents service start.
- [ ] Calibrator flatness test (Phase 2): degenerate calibrator is rejected at load time; service falls back to raw probabilities.
- [ ] Determinism test: kNN-ICL prompt content is reproducible given fixed (article, model_version, corpus snapshot).
- [ ] CI fails on `ARTIFACT_VERSION` or `PROMPT_VERSION` change without accompanying fixture regeneration.
- [ ] Pre-push hook (`git config core.hooksPath .githooks`) runs `sync_prompts.py check` on every push.
- [ ] `docs/solutions/2026-railway-python-service.md` and `docs/solutions/2026-n8n-to-microservice-cutover.md` written as Phase 1 closes.

## Success Metrics

- **Daily relevance-filter spend:** £10–20/day → <£2/day (≥80% cost cut).
- **SURFACE/REJECT parity:** ≥85% with live Stage 4A on a 100+ article held-out set.
- **Pathway agreement:** ≥90% with live Stage 4A.
- **Pathway C scoring:** correct for the first time (total_score ≠ 0 when policy_scale > 0).
- **Evidence strings:** non-null on every awarded component in Pathway B/C outputs (was broken before).
- **Escalation rate drift:** trends down by ≥30% over 4–8 weeks of active learning.
- **LLM-judge rubric score:** on a fresh audit set, matches or exceeds Phase-1 baseline.
- **Operational:** no downstream n8n schema changes required; no regressions in Notion rows; Slack error branch fires appropriately on service failures.

## Dependencies & Prerequisites

- Access to Neon Postgres with `pgvector` extension (may share project with the sibling article-classifier service).
- Anthropic API key (Haiku 4.5 access) and OpenAI API key (embeddings + optional gpt-4o-mini escalation).
- Railway project + billing — new service (~$10–20/month expected).
- n8n credentials created via `npx --yes n8nac credential create --file` with bearer token env var (`RELEVANCE_CLASSIFIER_TOKEN`).
- Historical data accessible: n8n execution store (or logs), Notion source database, and wherever stored `analysis` blobs live. **Planning-phase investigation task** to confirm exact shape and extraction mechanism (brainstorm §Deferred Q on R8).
- Coordination with the sibling article-classifier cutover (same `workflow.ts`; last-push-wins at file granularity).
- `.githooks/pre-push` enabled per clone: `git config core.hooksPath .githooks`.

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Classifier parity below 85% on held-out | Medium | High | Phase 1 ships rules+escalation-only (no classifier in the path); Phase 2 gates promotion on parity. If Phase 2 classifier underperforms, keep Phase 1 config indefinitely — already delivers most of the cost win. |
| Legacy flat-schema consumer silently breaks | Medium | High | Pre-cutover audit (R16) greps every reference and traces to live vs dead. Shadow run for 3+ days catches any missed consumer. `continueErrorOutput` ensures Slack alerts any breakage. |
| Sibling cutover collides on `workflow.ts` | Medium | Medium | Sequence explicitly (this service first, then article-classifier pulls and rebases). Document sequencing note in both plans. |
| Cold start latency breaks n8n retry budget | Low | Medium | Railway healthcheck waits for lifespan model load; n8n HTTP node `waitBetweenTries: 5000` covers warm-up. Models loaded once at startup. |
| Embedding cost creeps up on backfill | Low | Low | Notion backfill uses Batch API (50% discount); per-article steady-state embedding cost <$0.00005. |
| cleanlab drops genuinely-correct weak labels | Medium | Low | Review flagged labels before dropping; keep confidence_weight=0.5 rather than deleting. Gold is never subject to cleanlab. |
| Active-learning loop amplifies classifier's own mistakes | Low | High | Disagreement sampling (classifier vs escalation LLM) plus Tim's manual relabels dominate the training signal. No-per-pathway-regression promotion gate blocks bad retrains. |
| Calibration breaks after a retrain | Medium | Medium | Isotonic regression refit on each retrain; shadow-test against held-out gold before promoting. |
| Railway IPv6 misconfigured → internal calls fail | Low | Medium | Dockerfile binds `::`, documented in deploy README. Smoke test on first deploy. |
| Prompt cache invalidation after prompt edits | Low | Low | `PROMPT_VERSION` env forces re-embed of any cached few-shot exemplars on change. |
| Legacy flat-schema consumers are LIVE, not dead (proven) | Confirmed | High | Phase 1 ships a translation shim; migration of Notion mappers to canonical schema is a follow-up PR, not a blocker. |
| `Evaluation1.actualAnswer` breaks silently post-cutover | Medium | Medium | Rewire to HTTP Request node output as part of cutover diff; CI grep test asserts no orphaned `.output.final_score` references remain. |
| Compounding retry storm (n8n × upstream SDK retries × fallback) | Medium | High | 15s request deadline, internal retries capped at ≤1 when n8n itself retries (worst-case 3× not 27×), explicit per-upstream timeouts. |
| Admin token compromise poisons training set | Low | High | Split `RELEVANCE_ADMIN_TOKEN` from `RELEVANCE_CLASSIFIER_TOKEN`; rate-limit `/admin/*`; `labels.labeler` audit trail + source-IP in structlog. |
| Pickle RCE via tampered calibrator in R2 | Low | Critical | `skops`/`safetensors` instead of `joblib.load`; sha256-pinned `manifest.json`; R2 bucket ACL roster documented. |
| Prompt injection flips pathway/decision via article content | Medium | Medium | Delimiter fencing, hardened system prompt, 8KB content cap, regression tests with injection payloads. |
| Escalation-unavailable silently downgrades to classifier tier (masking quality drop) | Medium | High | Distinct `classifier_tier: "classifier_escalation_unavailable"` + `degraded: true` flag; Slack alert on hourly escalation-miss rate > threshold. |
| Stage-4A self-disagreement is confused with service regression | High | Medium | Measure and report Stage-4A test-retest disagreement baseline before setting shadow-run acceptance threshold; service gate = baseline + 5pp, not a fixed 85%. |
| Stage-3-reject articles blow up downstream (schema-mismatch) | Medium | Medium | Schema block enumerates the Stage-3-reject shape byte-for-byte; fixture test covers it. |
| Neon pool exhaustion under burst blocks responses | Low | Medium | `pool.acquire(timeout=500ms)`; `statement_timeout=3s`; fire-and-forget decisions-log with bounded queue and drop-on-full policy (logs stderr on drop, classification still 200s). |
| Train/serve skew on featurizer | Medium | Medium | Single `app/features.py` imported by both; golden-test asserts identical features for a fixed article across training and serving paths. |
| Bootstrapped training signal inherits today's Pathway C tol_score bug | High | Medium | Drop Pathway C weak labels entirely; route Pathway C direct to LLM until N≥30 gold accumulates post-cutover. |
| Notion write fails after service 200 → Neon/Notion drift | Medium | Medium | Outbox + reconciler in Phase 2: active-learning sampler reads only `confirmed = true` rows (Notion write acknowledged); Phase 1 accepts drift explicitly. |
| Shadow-run contention with live quotas | Medium | Medium | Separate Anthropic/OpenAI API keys (or rate-limit sub-budget); Neon branch; `shadow: true` flag on every write; live Stage 4A never called by shadow. |

## Future Considerations

- **Fine-tuned ModernBERT** once training data reaches ≥500 examples/pathway (likely 6-month horizon) — may replace SetFit + reranker with a single model for Pathway A/B/C classification.
- **Review UI** (Argilla self-host) for Tim to quickly label surfaced articles without a CLI — deferred from v1 scope per brainstorm.
- **Multi-tenant** if Syntech ever adds a second customer profile. Current design is single-tenant.
- **Shared Neon project with article-classifier** — operationally simpler. Decide during Phase 1 infra provisioning.
- **Populate `docs/solutions/`** with compounding institutional learnings as this and the sibling service go live (first Railway deploy, first pgvector usage, first embedding pipeline in the org). Per learnings-researcher recommendation.

## Documentation Plan

- Service repo `README.md` — setup, env vars, local dev, deploy.
- Service repo `docs/ARCHITECTURE.md` — cascade design diagram, training pipeline.
- This repo `docs/solutions/2026-railway-python-service.md` — first Railway deploy lessons.
- This repo `docs/solutions/2026-n8n-to-microservice-cutover.md` — LLM-node → HTTP-node swap pattern (reusable for future cutovers).
- Update `AGENTS.md` §190–236 if a new prompt-sync pattern emerges (escalation prompt version management inside the service repo).
- Cross-link from sibling plan so future readers see both services in context.

## Sources & References

### Origin

- **Origin document:** [docs/brainstorms/2026-04-15-biofuel-relevance-classifier-microservice-requirements.md](../brainstorms/2026-04-15-biofuel-relevance-classifier-microservice-requirements.md)

Key decisions carried forward from the brainstorm (see origin for full context and rationale):
- Cascade architecture (rules → classifier → LLM escalation → score math) — origin §Key Decisions "Cascade over monolithic prompt or pure classifier"
- Four-tier data strategy (human-verified gold / Stage 4A positives / Stage 4A negatives / per-component regression targets) — origin §Key Decisions "Four-tier data strategy"
- Retain output schema, extend additively — origin §Key Decisions "Retain output schema, extend additively" + R14
- Rejects flow through with full analysis blob — origin R15
- Active learning on day one — origin §Key Decisions "Active-learning loop is day-one"
- Narrow-scoped evidence-string bug fix (awarded components only) — origin §Key Decisions "Fix the evidence-string bug — narrowly scoped"
- Cross-encoder reranker in classifier tier — origin §Key Decisions
- Service owns score math + priority bands — origin §Key Decisions + R7

### Research (external, 2025–2026 sources)

- **Cascade pattern in production**: AlphaSense engineering talks (2025), Feedly Leo AI engineering posts (2024–2025), Recorded Future "tiered triage" post (2025), Anthropic "Building effective agents" (Dec 2024).
- **SetFit 1.1**: HuggingFace [setfit GitHub](https://github.com/huggingface/setfit) + [release notes](https://github.com/huggingface/setfit/releases/tag/v1.1.0). Tunstall et al. 2022 foundational paper.
- **BGE reranker v2-m3**: [HuggingFace model card](https://huggingface.co/BAAI/bge-reranker-v2-m3) + [FlagEmbedding repo](https://github.com/FlagOpen/FlagEmbedding).
- **cleanlab**: [PyPI](https://pypi.org/project/cleanlab/) 2.7+; Snorkel avoided (OSS maintenance).
- **LLM-as-teacher distillation**: Orca (Microsoft, 2023), Distilling Step-by-Step (Google, 2023), Argilla `distilabel` library (2025).
- **LLM-as-judge**: Zheng et al. "Judging LLM-as-a-Judge", Anthropic "On evaluating LLMs" (2025), Vertex AI eval guide (Aug 2025). Pairwise + rubric + cross-family judge + position-swap.
- **kNN-ICL few-shot**: Liu et al. 2022; Dong et al. "In-Context Learning Survey" (2024).
- **Anthropic Structured Outputs** (GA late 2025): `anthropic-beta: structured-outputs-2025-11-13`.
- **pgvector HNSW** default at this scale: [pgvector docs](https://github.com/pgvector/pgvector); [Neon pgvector optimization](https://neon.com/docs/ai/ai-vector-search-optimization).
- **Railway deploy**: [FastAPI guide](https://docs.railway.com/guides/fastapi); Dockerfile preferred over Railpack/Nixpacks for ML deps with native wheels.
- **nannyml** for drift without ground truth: 2025-active library.

### Internal references (this repo)

- `AGENTS.md` §5–25 (3-layer architecture), §99–132 (agent-native output + execution standards), §152–189 (n8n sync discipline), §190–236 (prompt sync), §617–633 (n8n Common Mistakes), §727–737 (credentials via `n8nac credential create`).
- `docs/plans/2026-04-15-001-feat-article-classifier-microservice-plan.md` lines 86–96, 188–260, 278–283, 302, 335–343, 352–358 — authoritative reference for microservice conventions this plan parallels (stack, layout, auth, deploy, testing, CI gates, Neon branching for shadow runs).
- `docs/plans/2026-04-12-001-feat-news-plus-stage-4-split-plan.md` lines 50, 70, 72, 102, 111, 112, 174 — Stage 4 split precedent, `PerformFinalCalculation` shape risk, rename-breaks-reference pattern, `continueErrorOutput` discipline.
- `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts` lines 2520–2543 (HTTP node template), 6286–6440 (code node to replace), 1758–1849 (sibling cutover target area — do not touch).
- `prompts/news-sourcing-production/stage_{1,2,3,4a,4b}.md` — current prompts defining the output contract the service must reproduce; deleted post-cutover.
- `execution/sync_prompts.py` + `.githooks/pre-push` — drift detection to keep green through cutover.
- `compound-engineering.local.md` — CE review config, invoke `/ce:review` before merging.
- `docs/solutions/` — empty; populate as part of Phase 1 deliverables.

### Related work

- Sibling plan: [docs/plans/2026-04-15-001-feat-article-classifier-microservice-plan.md](./2026-04-15-001-feat-article-classifier-microservice-plan.md) — coordinate cutover sequencing.
- Precursor plan: [docs/plans/2026-04-12-001-feat-news-plus-stage-4-split-plan.md](./2026-04-12-001-feat-news-plus-stage-4-split-plan.md) — shipped Stage 4 split this plan builds on.
- Precursor brainstorm: [docs/brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md](../brainstorms/2026-04-12-news-plus-pipeline-split-requirements.md).
- Related brainstorm (different service): [docs/brainstorms/2026-04-15-article-classifier-microservice-requirements.md](../brainstorms/2026-04-15-article-classifier-microservice-requirements.md) — uniqueness classifier, not relevance.

---

## Deployment — Go/No-Go Checklist (Phase 1)

### Pre-Cutover Verification (T-24h)

Legacy-schema consumer audit:
```bash
grep -n -E "scoring_breakdown\.(topical_relevance|market_indicators|oem_validation|adoption_success_story|strategic_context)|penalties\.(geographic|sector)\.reasoning|competitor_intel\.note|calculation_summary" \
  "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"
```
Every hit must be either served by the legacy-shim or annotated `// dead-branch: remove post-cutover`. Any un-triaged hit = **NO-GO**.

Baseline SQL (classifier_relevance):
```sql
SELECT COUNT(*) FROM classifier_relevance.decisions WHERE decided_at > now() - interval '7 days';
SELECT pathway, classifier_tier, COUNT(*) FROM classifier_relevance.decisions
  WHERE decided_at > now() - interval '24 hours' GROUP BY 1,2;
```

Auth handoff:
- [ ] `syntech-biofuel-relevance-classifier` n8n credential created (Header Auth, bearer)
- [ ] Token matches Railway `RELEVANCE_CLASSIFIER_TOKEN`
- [ ] Manual test execution on HTTP Request node returns 200 on a known article
- [ ] `/healthz` and `/readyz` both 200 from n8n egress
- [ ] Startup log shows expected `sha256(token)[:8]` fingerprints

### Shadow-Run Acceptance Gates (T-72h → T-0)

- [ ] ≥ 500 articles processed in shadow, ≥ 20 per pathway
- [ ] SURFACE/REJECT agreement ≥ (measured Stage-4A self-disagreement baseline + 5pp)
- [ ] Pathway agreement ≥ 90%
- [ ] p95 latency < 1.5s rules tier, < 4s escalation tier
- [ ] Zero 5xx; `classifier_tier` distribution ~60–75% rules
- [ ] Canonical + legacy-shim fixtures pass byte-match
- [ ] `Evaluation1.actualAnswer` resolves post-cutover in a test execution

### Cutover Coordination (Sibling Protocol)

Relevance classifier ships **first** (upstream). Sequence:
1. Relevance team: `npx n8nac pull` → swap 5 LLM + code nodes for HTTP Request → rewire `Evaluation1` → `npx n8nac push` → announce SHA in shared channel.
2. Article-classifier team: waits for announcement, pulls, replays their diff, pushes.

No concurrent pushes — last-write-wins at file granularity.

### Rollback

Before cutover: `git tag pre-biofuel-cutover`.

1. `git checkout pre-biofuel-cutover -- workflows/.../News\ Sourcing\ Production\ \(V2\).workflow.ts`
2. Restore 5 prompt MDs: `git checkout pre-biofuel-cutover -- prompts/news-sourcing-production/`
3. `npx --yes n8nac push workflows/.../News\ Sourcing\ Production\ \(V2\).workflow.ts`
4. Disable HTTP Request node credential in n8n
5. Manual test execution confirms legacy path
6. Post-mortem: `SELECT * FROM classifier_relevance.decisions WHERE decided_at > '<cutover_ts>' ORDER BY decided_at;`

### 48h Post-Cutover Monitoring

| Metric | Source | Rollback threshold |
|---|---|---|
| HTTP 5xx rate | Railway logs | > 1% over 15 min |
| p95 latency (rules) | Railway metrics | > 1.5s over 15 min |
| p95 latency (escalation) | Railway metrics | > 4s over 15 min |
| Pathway drift vs shadow | `decisions` hourly SQL | > 5pp shift on any pathway |
| SURFACE rate | `decisions` | ±20% vs 7-day pre-cutover |
| Escalation rate | `classifier_tier='llm'` | > 50% sustained 1h |
| Anthropic 429s | structlog | > 10/hour |
| Escalation-miss rate | `degraded=true` | > 5% over 15 min |
| Notion publish failures | n8n executions | any sustained failure |

Check at T+1h, T+4h, T+24h, T+48h. Any threshold breach → execute rollback.

---

## Open Architectural Questions (flagged, not blocking Phase 1)

1. **Monorepo vs two repos.** Architecture review recommended a single `syntech-classifiers/` monorepo with shared `packages/common/` for db/auth/embeddings/logging (60–70% of infra is identical between this service and the sibling). Current plan keeps two separate repos to match the already-in-flight sibling. Revisit post-Phase-1 when shared drift becomes observable — a monorepo refactor is reversible and cheap compared to avoiding it now.
2. **Training as a separate Railway service.** Retrain co-located with serving competes for RAM and can OOM mid-request when artifacts are loaded. Phase 2 runs retrain manually + on demand; if frequency increases, split into a dedicated Railway service or one-off job runner.
3. **Notion↔Neon outbox reconciler.** Phase 1 accepts possible Notion/Neon drift explicitly; Phase 2 adds an outbox + reconciler so the active-learning sampler reads only `confirmed = true` decisions. Worth revisiting scope if drift proves material during Phase 1.
4. **Schema sharing with article-classifier.** Decision: separate Postgres schema (`classifier_relevance` vs article-classifier's own). `articles` is sibling-owned (sole writer); this service reads by FK on `url_canonical`. Coordinate migration cadence with sibling; each service's alembic `version_table_schema` pinned to its own schema.
