---
date: 2026-04-15
topic: biofuel-relevance-classifier-microservice
---

# Biofuel Relevance Classifier Microservice

## Problem Frame

The n8n news-sourcing workflow runs a 5-step LLM decision tree (Stages 1, 2, 3, 4A, 4B) on every incoming article to decide whether it's relevant to Syntech's biofuel intelligence feed, route it to a pathway (A/B/C/D), score strategic value, and extract evidence. Total cost: **£10–20/day** and rising as throughput grows. Stages 1–3 are almost entirely deterministic source/keyword routing dressed up as LLM calls. Stage 4A is the expensive "brain" — multi-pathway scoring with evidence strings. The current design wastes tokens on rules that code can execute for free, pays full LLM price for obvious pass/reject cases, and has no feedback loop: when Tim's preferences drift, the only corrective action is editing a prompt.

The goal is to replace all 5 stages **and** the downstream score/priority-band calculation (currently a JS code node in n8n) with a single Railway microservice. Target: cut cost 80%+ *and* measurably improve what gets surfaced over time. This is distinct from the existing uniqueness-classifier microservice brainstorm (`2026-04-15-article-classifier-microservice-requirements.md`) which handles `unique`/`update`/`duplicate` tagging downstream.

## Requirements

- **R1.** The microservice exposes a single HTTP endpoint. Input: one deduplicated article (title, content, url, source_platform, source_category). Output: the full relevance verdict currently produced by Stages 1–4B plus the n8n code node — `pathway`, `decision` (SURFACE/REJECT), `total_score`, `priority_band` (MUST-READ / STRONG / MARGINAL / REJECT / EXPERT), `scoring_breakdown` with evidence strings, `strategic_summary`, `key_highlights`, `recommended_action`, `active_scoring_components`, plus Pathway-D-specific fields (`vertical`, `content_type`, `topic_summary`, `syntech_relevance`). Byte-for-byte drop-in for the current n8n output contract — no downstream node changes.
- **R2.** Architecture is a **cascade**: (i) deterministic rules engine for Stages 1–3 and obvious Stage 4 cases, (ii) embedding + cross-encoder reranker classifier for confident mid-tier decisions, (iii) small-LLM escalation (Haiku 4.5 / gpt-4o-mini class) for the ambiguous middle, (iv) deterministic score math + priority-band calculation in code.
- **R3.** Stages 1–3 logic runs as pure code — source-category autos (LinkedIn Customer/Expert/Competitor), Stage 1 biofuel/VIP/policy keyword lists, Stage 2 VIP-in-headline and mention-count logic, Stage 3 pathway routing including the competitor-permissive-bias case. Zero LLM tokens for this tier.
- **R4.** A classifier tier (embedding on `title + summary` + cross-encoder reranker + lightweight head such as SetFit or logistic regression) produces `(pathway, surface/reject, per-component-score-bucket, confidence)` for articles not resolved by rules. High-confidence predictions bypass the LLM entirely.
- **R5.** Low-confidence articles escalate to a small LLM that produces the full `scoring_breakdown` with evidence strings in the existing JSON schema. Pathway-specific prompts, few-shot examples drawn dynamically from nearest labeled exemplars.
- **R6.** Pathway D (Expert LinkedIn) always surfaces. A small LLM extraction pass fills `content_type`, `topic_summary`, `syntech_relevance`, `key_highlights`. No scoring.
- **R7.** Score math, threshold (≥3 → SURFACE), and priority-band assignment run as deterministic code in the service — same logic as today's n8n code node, with the `tol_score` typo in the Pathway C branch fixed (Pathway C articles currently score 0 silently).
- **R8.** Training data is bootstrapped from four existing tiers, no new hand-labeling required for v1:
  - **Gold set (~50–60 articles)** Tim has personally marked relevant/irrelevant. Held out for eval + active-learning seed — never in training.
  - **Surfaced set (Notion corpus)** — implicit `SURFACE=true` positive class. Partial metadata is fine; the surfacing outcome is the label.
  - **Rejected set** — every article with a stored `analysis` blob where `decision = "REJECT"`. Large, labeled negative class. Includes the hard cases (right-topic-wrong-fuel-type, right-topic-wrong-geography, project announcements without operational proof) that the classifier most needs to learn.
  - **Per-component regression targets** — `analysis.scoring_breakdown.<pathway>.<component>.points` across all stored blobs. Lets us train per-component heads to reproduce the scoring breakdown without invoking the LLM for confident cases.
  An ETL script consolidates these into a unified training table keyed by article URL. Gold overrides everything else when present.
- **R9.** An offline evaluation harness measures classifier parity vs the current LLM output on a held-out set, and uses LLM-as-judge (Claude/GPT-4-class) to grade whether decisions match Tim's stated criteria. Parity target: ≥85% agreement with current Stage 4A SURFACE/REJECT decisions on a 100+ article held-out set, measured before go-live and on every retrain.
- **R10.** Active-learning feedback loop: the service logs every decision with confidence, pathway, rules-vs-classifier-vs-LLM tier, and inputs. Borderline decisions and any Tim manual reclassifications feed a weekly retrain. Escalation rate is tracked as a health metric and should trend down over time.
- **R11.** Deployed on Railway. Reachable from n8n via HTTPS with a shared bearer token. Per-article latency budget: p95 under 500ms for rules/classifier tier, under 3s for LLM-escalation tier.
- **R12.** Configuration (keyword lists, VIP list, thresholds, score component weights, pathway routing priority) lives in a config file/table in the service, not in code. Tim's criteria can be updated without a redeploy for rule changes; classifier criteria shifts trigger a retrain.
- **R13.** The service is observable: structured logs of decisions and confidence, per-tier cost counter, daily cost report, classifier drift alarms (e.g. sudden shift in pathway distribution or escalation rate).
- **R14.** The output schema is **retained and extended additively** — no breaking changes to downstream consumers. The current pathway-specific `scoring_breakdown` (pathway_a/pathway_b/pathway_c), plus `pathway`, `decision`, `total_score`, `priority_band`, `threshold_met`, `active_scoring_components`, `strategic_summary`, `key_highlights`, `recommended_action`, `competitor_intel`, and Pathway-D fields (`vertical`, `content_type`, `topic_summary`, `syntech_relevance`) remain byte-compatible. Three additive fields are added: `classifier_tier` (`"rules"`/`"classifier"`/`"llm_escalation"`), `confidence` (0.0–1.0), and `service_version` (string). Existing consumers ignore the new fields; new consumers (the visualisation layer, the active-learning logger) read them.
- **R15.** Rejected articles continue to flow through the output with full analysis blob (`decision: "REJECT"`, `priority_band: "REJECT"`, `scoring_breakdown` populated on the evaluated pathway). The service does not filter rejects — it tags them. Downstream n8n branches handle reject routing/persistence unchanged, and any future reject-visualisation surface reads from the same output.
- **R16.** A planning-phase audit task verifies the live output schema against every downstream consumer in the workflow. The workflow JSON currently references both the new pathway-specific scoring schema AND an older flat schema (`scoring_breakdown.topical_relevance.reasoning`, `.market_indicators.reasoning`, `.oem_validation.reasoning`, `.adoption_success_story.reasoning`, `.strategic_context.reasoning`, `.penalties.*.reasoning`, `.competitor_intel.note`) in Notion-mapper branches. The microservice emits the pathway-specific schema as canonical; any live flat-schema consumers are either cleaned up or, if still needed, mapped in a thin translation layer. This audit blocks go-live, not brainstorm sign-off.

## Success Criteria

- Daily relevance-filter spend drops from £10–20/day to under £2/day at current volume. Per-article cost dominated by the escalated fraction.
- ≥85% SURFACE/REJECT agreement with current Stage 4A decisions on a labeled held-out set. Pathway agreement ≥90%.
- After 4–8 weeks of active learning, classifier escalation rate drops (fewer articles need LLM) AND LLM-judge eval score on a fresh audit set improves vs v1 baseline — evidence the system is getting *better*, not just cheaper.
- n8n workflow end-to-end continues to run with no schema changes to downstream nodes.
- Pathway C scoring bug is fixed; Pathway C articles score correctly for the first time.
- Every awarded component on the active pathway has a non-null evidence string — fixing the Pathway B/C regression that leaves `active_scoring_components` unreadable. (Inactive-pathway null evidence is correct by design and stays.)

## Scope Boundaries

- **Not** replacing the upstream RSS/LinkedIn scraping or the semantic-deduplication microservice.
- **Not** replacing the downstream uniqueness classifier (`unique`/`update`/`duplicate`) — that's a separate microservice in its own brainstorm.
- **Not** changing the output contract — all downstream n8n nodes see the same JSON they see today.
- **Not** building a UI for reviewing decisions in v1. Active-learning corrections come via Tim flagging in the existing review flow + a small CLI / admin endpoint for reclassification.
- **Not** multi-tenant — single Syntech criteria set.
- **Not** self-hosting a fine-tuned transformer in v1. Cross-encoder reranker can run on CPU but stays off-the-shelf. Fine-tuning is deferred to a v2 if steady-state throughput justifies it.
- **Not** attempting to eliminate the LLM entirely. The escalation tier is a feature, not a failure — it's where evidence strings come from and where judgment calls happen.

## Key Decisions

- **Cascade over monolithic prompt or pure classifier.** Rules handle the easy majority, classifier handles the confident middle, LLM judges only the ambiguous remainder. Matches the industry-standard pattern for domain-specific relevance filtering (competitive-intel platforms, news aggregators, RAG pre-filters).
- **Four-tier data strategy: human-verified gold / Stage 4A positives / Stage 4A negatives / per-component regression targets.** This gives us both label classes (no implicit-positives-only problem), dense per-component signals, and a separate human-verified gold tier for eval and active-learning seed. Strictly stronger than hand-labels alone or weak supervision alone. Human-verified positives (Notion expert-reviewed) sit above Stage 4A weak positives in the label hierarchy.
- **Fix the evidence-string bug in the service — narrowly scoped.** Pathway B and C components returning `evidence: null` *when points are awarded* (e.g. `project_scale.points: 5, evidence: null`) is the real regression, not null evidence on inactive pathways or zero-point components (those are correct by design). The microservice's escalation prompt must schema-enforce evidence strings on every awarded component.
- **Cross-encoder reranker in the classifier tier.** Small CPU model, ~10ms/article, meaningfully more accurate than cosine similarity alone for pairwise relevance. Single highest-leverage upgrade over vanilla embedding classification.
- **Service owns score math + priority bands.** The existing n8n code node has a silent Pathway C bug. Moving this logic into the service means one authoritative implementation, unit-tested, alongside the scoring breakdown it consumes.
- **Active-learning loop is day-one, not a "later" feature.** The quality compounding depends on it; without it this is just Approach 2. Logging schema and retrain cadence are v1 requirements.
- **LLM escalation preserves evidence strings.** Reviewers still see human-readable evidence for the borderline cases that most need explanation. Rules-tier and classifier-tier decisions generate templated evidence from their triggered components — acceptable because these are the obvious cases.
- **Retain output schema, extend additively.** The cascade architecture is independent of output shape — rules/classifier/LLM all produce the same `analysis` object. No downstream consumer is forced to change. Three additive observability fields (`classifier_tier`, `confidence`, `service_version`) let the new visualisation + active-learning layers work without touching existing contracts.

## Dependencies / Assumptions

- n8n can replace the 5 LLM nodes + code node with a single HTTPS call and inject a bearer token.
- Embedding provider available (OpenAI `text-embedding-3-small` or equivalent); per-article embedding cost is negligible.
- Historical n8n executions retain enough detail (input article + Stage 4A output) to reconstruct labeled pairs via ETL.
- Neon (pgvector) or similar is available for embedding store + decision log. Likely piggybacks on the infra planned for the uniqueness-classifier microservice.
- Railway service can run a small cross-encoder model on CPU within latency budget.

## Outstanding Questions

### Resolve Before Planning

- *(none — scope and shape are clear enough to plan against)*

### Deferred to Planning

- [Affects R4][Needs research] Specific classifier architecture — SetFit vs gradient-boosted tree on embeddings vs zero-shot NLI as bootstrap. Decide during a prototyping spike against the extracted labeled set.
- [Affects R4][Technical] Cross-encoder choice — `bge-reranker-base` self-hosted on Railway CPU vs Cohere Rerank API. Benchmark cost + latency during planning.
- [Affects R5][Technical] Small LLM choice for escalation — Haiku 4.5 vs gpt-4o-mini. Benchmark on a 50-article escalation sample during planning.
- [Affects R8][Technical] Where historical labeled data actually lives (n8n execution DB, Notion, Neon, logs) and the ETL shape — investigation task for planning phase.
- [Affects R9][Technical] LLM-as-judge prompt design and eval harness structure (run cadence, threshold for blocking deploys on regression).
- [Affects R10][Technical] Active-learning retrain cadence, trigger conditions, rollback if a retrained model underperforms.
- [Affects R11][Technical] Auth model between n8n and the Railway service — likely mirrors the uniqueness-classifier service decision.
- [Affects R12][Technical] Config storage (file in repo, env vars, database table) and update workflow.
- [Affects R13][Technical] Observability stack — Railway logs + simple daily email, or a more structured metrics pipeline.

## Next Steps

→ `/ce:plan` for structured implementation planning
