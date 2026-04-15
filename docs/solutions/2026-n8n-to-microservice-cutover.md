---
date: 2026-04-15
category: deployment-issues
tags: [n8n, microservice, cutover, http-request-node, last-write-wins]
module: news-sourcing-production
symptom: "Replacing 5 LLM nodes + a code node with 1 HTTP Request node in a production n8n workflow without breaking downstream Notion mappers"
root_cause: "Several downstream nodes read $json.analysis.*; the new microservice must emit byte-compatible shape (canonical + legacy shim) and the Evaluation node must be rewired"
---

# n8n → Microservice Cutover Runbook

> **Use this when** replacing a cluster of LLM nodes + a code node in an n8n workflow with a single HTTP Request node that calls a separate microservice.
>
> Written for the **biofuel-relevance-classifier** cutover (commit applying to `workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts`). Generalises to any future LLM-cluster → microservice migration.

## Prerequisites

Do **not** start until all of these are green:

- [ ] Service deployed to Railway and reachable at a stable URL.
- [ ] `GET /readyz` returns 200 with `checks.{config,auth_classifier,auth_admin,anthropic,openai}` all `ok`.
- [ ] `RELEVANCE_CLASSIFIER_TOKEN` created as an n8n credential via `npx --yes n8nac credential create --file` (NOT inline).
- [ ] Shadow run completed with ≥3 days of fixtures; SURFACE/REJECT agreement ≥ (Stage-4A self-disagreement baseline + 5pp); pathway agreement ≥ 90%.
- [ ] Legacy-schema audit completed (see Appendix A) — every live consumer of the flat schema is either served by the service's legacy shim or annotated dead.
- [ ] Sibling article-classifier team notified; sequencing agreed.
- [ ] `git tag pre-biofuel-cutover` on current branch before pushing.

## The six nodes being replaced

| Node name | Type | File position | What it does |
|---|---|---|---|
| ⛽️ STAGE - 1: Fossil Fuel Filter | `lmChain` (Basic LLM Chain) | workflow.ts:6630+ | Auto-pass / reject on keyword + source rules |
| 🔑 STAGE - 2: VIP Keyword handler | `lmChain` | workflow.ts:6740+ | VIP headline / mention-count detection |
| 🪨 STAGE - 3: Topic Density Test | `lmChain` | workflow.ts:7067+ | Pathway routing (A/B/C/D/REJECT) |
| 📊 STAGE - 4A: Strategic Value Scorer | `lmChain` | workflow.ts:9261+ | Multi-component scoring for A/B/C |
| 🎓 STAGE - 4B: Expert Content Processor | `lmChain` | workflow.ts:9792+ | Pathway D extraction (content_type, topic, relevance) |
| Perform Final Calculation | `code` | workflow.ts:6274–6440 | Sum components → priority_band + decision |

**Related node to rewire (NOT delete):**

- `Evaluation1` at workflow.ts:1726–1735, which currently references `$('📊 STAGE - 4A: Strategic Value Scorer').item.json.output.final_score`. After cutover this must reference the HTTP node output: `$('Classify via Relevance Service').item.json.analysis.total_score`.

**Related prompt files to delete** (each has frontmatter pointing at a `node_id` we're removing — orphaned prompts trigger `sync_prompts.py check`):

- `prompts/news-sourcing-production/stage_1.md`
- `prompts/news-sourcing-production/stage_2.md`
- `prompts/news-sourcing-production/stage_3.md`
- `prompts/news-sourcing-production/stage_4a.md`
- `prompts/news-sourcing-production/stage_4b.md`

## The replacement node (exact TS)

Drop the following node definition into the workflow TS where the cluster of 6 nodes used to live. Template follows the HTTP-Request pattern already in this workflow at `workflow.ts:2520–2543` (the `AddContentWithDate` Notion-create node).

```ts
@node({
    id: '<<generate-uuid>>',
    name: 'Classify via Relevance Service',
    type: 'n8n-nodes-base.httpRequest',
    version: 4.3,
    position: [<<copy from STAGE - 1 position>>],
    credentials: {
        httpHeaderAuth: {
            id: '<<n8n credential id from `n8nac credential create`>>',
            name: 'Biofuel Relevance Classifier Token',
        },
    },
    onError: 'continueErrorOutput',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
})
ClassifyViaRelevanceService = {
    method: 'POST',
    url: 'https://syntech-biofuel-relevance-classifier.up.railway.app/classify',
    authentication: 'predefinedCredentialType',
    nodeCredentialType: 'httpHeaderAuth',
    sendHeaders: true,
    headerParameters: {
        parameters: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'X-Request-Id', value: '={{ $execution.id }}-{{ $itemIndex }}' },
        ],
    },
    sendBody: true,
    specifyBody: 'json',
    jsonBody: `={
        "title":            {{ JSON.stringify($('Deduplicated Articles').item.json.title) }},
        "content":          {{ JSON.stringify($('Deduplicated Articles').item.json.content) }},
        "url":              {{ JSON.stringify($('Deduplicated Articles').item.json.url) }},
        "source":           {{ JSON.stringify($('Deduplicated Articles').item.json.source) }},
        "source_category":  {{ JSON.stringify($('Deduplicated Articles').item.json.source_category || "") }},
        "summary":          {{ JSON.stringify($('Deduplicated Articles').item.json.summary || "") }}
    }`,
    options: {
        timeout: 15000,  // matches the service's own 15s deadline
        response: { response: { responseFormat: 'json' } },
    },
};
```

**Why these choices:**

- `retryOnFail: true, maxTries: 3, waitBetweenTries: 5000` matches the precedent pattern for LLM-adjacent nodes elsewhere in the workflow.
- `onError: 'continueErrorOutput'` is LOAD-BEARING. Downstream Slack-alerting branches assume HTTP errors route to the error output.
- `timeout: 15000` matches the service's own `REQUEST_DEADLINE_S = 15.0` so n8n doesn't wait longer than the service will.
- `Content-Type: application/json` is explicit; some n8n deployments have defaulted it wrong in the past.
- `X-Request-Id` threaded from `$execution.id` makes log correlation trivial.
- Body uses `JSON.stringify(…)` per field so newlines / quotes in article text are escaped correctly. Do not use the `={{ raw }}` form — it WILL break on articles containing quotation marks.

**Wiring:** the node's single `main` output wraps the service JSON response under `$json`. Because the service emits `{"analysis": {…}}` at top level, the existing consumers downstream that read `$json.analysis.*` continue to work unchanged. The error output (second port) routes to whatever the live workflow currently uses for error notifications — typically a Slack node.

## Evaluation1 rewire

Before (workflow.ts:1734):

```ts
actualAnswer: "={{ $('📊 STAGE - 4A: Strategic Value Scorer').item.json.output.final_score }}",
```

After:

```ts
actualAnswer: "={{ $('Classify via Relevance Service').item.json.analysis.total_score }}",
```

If you leave this as-is, `Evaluation1` silently receives `undefined` and tanks the evaluation grade without raising. Grep after the edit to confirm no other node references `$('📊 STAGE - 4A: …').item.json.output.*`.

## Cutover execution steps

```bash
# 1. From clean main, pull latest workflow
git checkout main && git pull origin main
git checkout -b feat/biofuel-relevance-cutover
npx --yes n8nac pull UzEv74M2D2q4z0Zx

# 2. Pre-check: drift detection must be green BEFORE editing
python execution/sync_prompts.py check \
    "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"

# 3. Edit workflow.ts:
#    - Remove the 6 nodes listed above
#    - Insert the ClassifyViaRelevanceService node (TS above)
#    - Rewire Evaluation1.actualAnswer
#    - Update any .to() / .out() wiring on the connections graph so the
#      HTTP Request node sits between Deduplicated Articles and PathwayRouter
#    - Grep for any other references to the 6 removed nodes and fix them

# 4. Delete prompt MDs whose node_ids no longer exist
rm prompts/news-sourcing-production/stage_1.md
rm prompts/news-sourcing-production/stage_2.md
rm prompts/news-sourcing-production/stage_3.md
rm prompts/news-sourcing-production/stage_4a.md
rm prompts/news-sourcing-production/stage_4b.md

# 5. Re-run drift check — must be green
python execution/sync_prompts.py check \
    "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"

# 6. Tag current main for rollback, then push
git checkout main
git tag pre-biofuel-cutover
git checkout feat/biofuel-relevance-cutover

# 7. Commit the diff
git add -A
git commit -m "feat(news-sourcing): cutover 5-stage LLM cluster to biofuel-relevance microservice"

# 8. Push to n8n (last-write-wins on workflow.ts; ensure sibling team is parked)
npx --yes n8nac push \
    "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"

# 9. Smoke-test end-to-end
npx --yes n8nac test UzEv74M2D2q4z0Zx

# 10. Push to GitHub for review
git push -u origin feat/biofuel-relevance-cutover
gh pr create --title "feat: cutover news-sourcing to biofuel-relevance microservice" \
    --body-file docs/solutions/2026-n8n-to-microservice-cutover.md
```

## Coordination protocol with the sibling article-classifier cutover

Both cutovers edit `News Sourcing Production (V2).workflow.ts`. `npx n8nac push` is last-write-wins at file granularity — concurrent pushes from two branches will silently lose one.

**Sequence:**

1. Relevance-classifier team (this runbook) ships **first** because it's upstream in the pipeline.
2. Announce the push SHA in the shared channel.
3. Article-classifier team waits for announcement, then pulls, rebases their diff onto the post-cutover workflow, and pushes.

Never attempt concurrent pushes.

## 48-hour post-cutover monitoring

Check at T+1h, T+4h, T+24h, T+48h. Any row trips → execute rollback.

| Metric | Source | Rollback threshold |
|---|---|---|
| Service HTTP 5xx rate | Railway logs | > 1% over 15 min |
| Service p95 latency (rules tier) | Railway metrics | > 1.5s sustained |
| Service p95 latency (escalation) | Railway metrics | > 4s sustained |
| Pathway distribution drift vs shadow baseline | `classifier_relevance.decisions` SQL hourly | > 5pp shift on any pathway |
| SURFACE rate | `classifier_relevance.decisions` | ±20% vs 7-day pre-cutover |
| Escalation rate | `classifier_tier = 'llm'` count / total | > 50% sustained 1h |
| Anthropic 429s | structlog | > 10/hour |
| Escalation-unavailable rate | `classifier_tier = 'classifier_escalation_unavailable'` | > 5% over 15 min |
| Notion publish failures | n8n executions | any sustained failure |
| `Evaluation1` null/undefined rate | Google Sheets eval output | any — evaluation is a guard rail |

### Baseline SQL queries

```sql
-- Hourly pathway distribution (paste into Neon console)
SELECT
  date_trunc('hour', decided_at) AS hr,
  pathway,
  count(*) AS n,
  round(100.0 * count(*) / sum(count(*)) OVER (PARTITION BY date_trunc('hour', decided_at)), 1)
    AS pct
FROM classifier_relevance.decisions
WHERE decided_at > now() - interval '48 hours' AND shadow = false
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- Tier mix — escalation should settle around 25-40% in Phase 1 (no classifier yet)
SELECT classifier_tier, count(*) AS n
FROM classifier_relevance.decisions
WHERE decided_at > now() - interval '24 hours' AND shadow = false
GROUP BY 1 ORDER BY 2 DESC;

-- Degraded-response rate (should be near zero)
SELECT
  date_trunc('hour', decided_at) AS hr,
  count(*) FILTER (WHERE degraded) * 1.0 / count(*) AS degraded_rate
FROM classifier_relevance.decisions
WHERE decided_at > now() - interval '48 hours' AND shadow = false
GROUP BY 1 ORDER BY 1 DESC;

-- p95 latency by tier
SELECT
  classifier_tier,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_ms,
  percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) AS p99_ms,
  count(*) AS n
FROM classifier_relevance.decisions
WHERE decided_at > now() - interval '2 hours' AND shadow = false
GROUP BY 1;
```

## Rollback procedure

```bash
# 1. Restore workflow.ts + prompts to pre-cutover state
git checkout pre-biofuel-cutover -- \
    "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts" \
    prompts/news-sourcing-production/

# 2. Push restored workflow back to n8n
npx --yes n8nac push \
    "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"

# 3. Verify in n8n UI that the legacy 5 LLM nodes + code node are back

# 4. Disable the HTTP Request credential so a stray manual test can't re-arm it
#    (via n8n UI → credentials → deactivate)

# 5. Confirm next manual execution routes through the legacy path
npx --yes n8nac test UzEv74M2D2q4z0Zx

# 6. Post-mortem snapshot
psql "$DATABASE_URL" -c "
  SELECT count(*) AS total,
         count(*) FILTER (WHERE degraded) AS degraded_count,
         count(*) FILTER (WHERE classifier_tier = 'classifier_escalation_unavailable') AS escalation_failed
  FROM classifier_relevance.decisions
  WHERE decided_at > '<cutover_ts>'"
```

## Appendix A: legacy-schema audit grep

Run this grep **before** cutover. Every hit must be either (a) served by the service's `legacy_shim` module, or (b) annotated `// dead-branch: remove post-cutover`. Any un-triaged hit = NO-GO.

```bash
grep -nE "scoring_breakdown\.(topical_relevance|market_indicators|oem_validation|adoption_success_story|strategic_context)|penalties\.(geographic|sector)\.reasoning|competitor_intel\.note|calculation_summary" \
  "workflows/syntech_biofuels_granite_automations_app_stephen_a/personal/News Sourcing Production (V2).workflow.ts"
```

The microservice's `app/legacy_shim.py` populates all of these leaves from the canonical pathway tree. After the Notion mappers migrate to the canonical schema (follow-up PR, NOT this cutover), the shim is removed and this grep should return zero hits.

## Appendix B: preserving the orphan STAGE-4 safety-copy node

The workflow contains an orphaned `STAGE - 4: Classification Agent (Claude Optimisation)1` node (around workflow.ts:8530) that the user deliberately kept as a safety copy during the 4A/4B split (per commit `250a7c2`). **Do not touch it** during this cutover. It's disconnected and shows in diffs but must remain for the user's fallback workflow.

## Appendix C: why we don't auto-execute this cutover

This runbook intentionally describes the cutover as a series of hand-executed steps rather than automating them, because:

1. **Last-write-wins coordination** with the sibling article-classifier cutover requires human sequencing.
2. **Shadow-run acceptance** is a human judgement call — "agreement rate within baseline" has edge cases that benefit from eyes.
3. **Deleting prompt MDs is irreversible** without git — must happen only after the HTTP node works end-to-end.
4. **The n8n workflow is production traffic** — a mistake here drops articles until rollback.

Once the service has been shadow-running cleanly for 3+ days and the sibling team confirms their cutover window, a human runs these steps. The runbook gives them everything they need.
