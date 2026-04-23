---
title: n8n Workflow Update — URL Work Queue Cutover
type: cutover-runbook
target_workflow: News Sourcing Production (V2)
workflow_id: UzEv74M2D2q4z0Zx
plan: docs/plans/2026-04-23-001-feat-sourcing-url-work-queue-plan.md
date: 2026-04-23
executor: Stephen (manual n8n UI edits per Decision D10)
---

# n8n Workflow Update — URL Work Queue Cutover

> **Agent does not edit or publish this workflow.** It ships the `syntech-content-sourcing`
> PR, provides the instructions below, and pauses. Stephen executes the n8n UI changes.

## Summary of what changes

The scheduled trigger's `CallContentSourcingBatch` node is retired. It's replaced by:

1. A **per-source loop** that calls `POST /search` once per Notion row (instead of one batched call).
   `/search` is now a fast discover-and-enqueue endpoint returning `{status, queued, skipped_dedup}`.
2. A **new Webhook trigger** (`FlushSyntechQueueWebhook`) that receives the microservice's
   flushed batch of articles and feeds them into the existing classifier → Notion → Slack chain.

The scheduled branch between the old `CallContentSourcingBatch` and the classifier rejoin point
becomes a no-op log/aggregator: there are no articles to route at scheduled-trigger time.

```
Before:
  Schedule → GetAllSources → MapToContentSourcing → CallContentSourcingBatch (POST /search/batch)
      → SplitOutArticles → RemoveDuplicates3 → ClassifyViaRelevanceService → Notion → Slack

After:
  Schedule → GetAllSources → MapToContentSourcing → CallContentSourcingDispatch (POST /search, per source)
      → [Set/Log node only — no classifier work here]

  WebhookTrigger(/webhook/flush-syntech-queue) → SplitOut $json.body.articles
      → RemoveDuplicates3 → ClassifyViaRelevanceService → Notion → Slack
```

## Prerequisite

The `syntech-content-sourcing` PR must be merged + deployed on Railway with:

- `QUEUE_ENABLED=true`
- `WEBHOOK_URL=""` (empty — drainer accumulates `ready` rows without flushing until you finish the n8n side)
- `WEBHOOK_BEARER_TOKEN=<your chosen token>` — set this now, you'll also put it in the n8n webhook credential
- `MAX_ATTEMPTS=6` (default)
- `CONTENT_SOURCING_TOKEN=<existing>`
- `ADMIN_TOKEN=<existing>`
- `DISCOVERY_TIMEOUT_SEC_*=<defaults>` unless tuning needed

Verify: `GET /admin/queue/status` returns 200 with an all-zero `counts_by_status`.

## Step-by-step (n8n UI)

### Step 1 — Open the workflow

Open `News Sourcing Production (V2)` in the n8n UI (workflow id `UzEv74M2D2q4z0Zx`).

**Disable the Schedule trigger** for the duration of the cutover so no scheduled run fires mid-change.

### Step 2 — Retire `CallContentSourcingBatch`

Locate the `CallContentSourcingBatch` HTTP Request node (it currently calls `POST /search/batch`).

- **Rename** it to `CallContentSourcingDispatch`.
- **Change the HTTP method / URL** to `POST {{ $env.CONTENT_SOURCING_BASE_URL }}/search` (no `/batch`).
- **Change the body shape** from the old batch envelope:

    ```jsonc
    // OLD — delete this body
    {
      "sources": {{ JSON.stringify($input.all().map(item => ({
        source_type: item.json.source_type,
        url_or_keyword: item.json.url_or_keyword,
        source_name: item.json.source_name,
        source_category: item.json.source_category,
        prompt: item.json.prompt,
        additional_formats: item.json.additional_formats,
        test_mode: item.json.test_mode
      }))) }},
      "max_concurrent_apify": 3
    }
    ```

  to the new per-source flat body:

    ```jsonc
    {
      "source_type": "={{ $json.source_type }}",
      "url_or_keyword": "={{ $json.url_or_keyword }}",
      "source_name": "={{ $json.source_name }}",
      "source_category": "={{ $json.source_category }}",
      "prompt": "={{ $json.prompt }}",
      "additional_formats": "={{ $json.additional_formats }}",
      "test_mode": "={{ $json.test_mode }}"
    }
    ```

- n8n will automatically iterate this node **once per input item** (per Notion source row). You should
  see one output item per source, each shaped `{"status": "queued", "queued": N, "skipped_dedup": M}`.
- Keep the existing `httpBearerAuth` credential (`CONTENT_SOURCING_TOKEN`).
- Set "Options → Timeout" to **10000 ms** (10s) — `/search` is fast now; anything slower is a bug.

### Step 3 — Short-circuit the scheduled branch

The branch from `CallContentSourcingDispatch` all the way to `ClassifyViaRelevanceService` no longer
has articles to carry. Replace every downstream node up to the classifier rejoin point with a
single `Set` or `NoOp` node named `ScheduledDispatchSink` that just logs the dispatch counters:

```jsonc
{
  "dispatched": true,
  "sources_total": "={{ $input.all().length }}",
  "queued_total": "={{ $input.all().reduce((sum, it) => sum + (it.json.queued || 0), 0) }}",
  "skipped_dedup_total": "={{ $input.all().reduce((sum, it) => sum + (it.json.skipped_dedup || 0), 0) }}"
}
```

**Disconnect** the old path (SplitOutArticles → RemoveDuplicates3 → ... → classifier) from the
scheduled trigger side. Leave those nodes in place — the webhook side will connect to them.

### Step 4 — Add the webhook trigger

1. Add a new **Webhook** trigger node.
2. Name it `FlushSyntechQueueWebhook`.
3. HTTP method: `POST`.
4. Path: `/webhook/flush-syntech-queue` (n8n will prepend your instance URL, giving the full URL
   `https://syntech-biofuels.granite-automations.app/webhook/flush-syntech-queue`).
5. Authentication: **Header Auth** — create a credential `Syntech Queue Webhook Token` with:
   - Name: `Authorization`
   - Value: `Bearer <the same WEBHOOK_BEARER_TOKEN you set in Railway>`
6. Response: "When last node finishes" is fine (microservice doesn't read the body).

### Step 5 — Wire the webhook into the classifier branch

From `FlushSyntechQueueWebhook`, add a `Split Out` node:

- **Field to split**: `body.articles`

The body shape arriving at the webhook is (see Decision D6):

```jsonc
{
  "status": "success",
  "articles": [ /* N ArticleResponse objects */ ],
  "articles_returned": N,
  "sources_processed": <distinct source_name count>,
  "sources_failed": 0,
  "errors": null,
  "flush_id": "<uuid>",
  "queue_row_ids": [id, ...]
}
```

So `body.articles` is the array you want to split. After `Split Out`, each output item is a
single `ArticleResponse`.

**Connect** the `Split Out` output to the existing `RemoveDuplicates3` node (or whichever node
is the first one in the classifier rejoin point — confirm during your audit).

### Step 6 — Audit the classifier branch for empty-array safety

Walk every node between the (now disconnected) `SplitOutArticles`/`RemoveDuplicates3` entry and
the classifier's input. Flag any node that errors when fed zero items. Candidate list from the
plan:

- `SplitOutArticles`
- `RemoveDuplicates3`
- `GetAllResults`
- `RemoveDuplicates`
- `IfFromForm`
- `SelectFields`
- `Filter`
- `FinalInput`
- `ClassifyViaRelevanceService`
- `PerformFinalCalculation`
- `ThresholdMet`

For each, check "Options → Always Output Data" and set where safe. A scheduled run now arrives
with zero items on the scheduled branch; the classifier branch only runs when the webhook fires.

### Step 7 — Save + Publish

- Save the workflow.
- Re-enable the Schedule trigger.
- Publish/activate the workflow so the webhook URL goes live.

### Step 8 — Signal the agent

Tell the agent that the webhook is live. The agent will then:

1. Update Railway env var `WEBHOOK_URL=https://syntech-biofuels.granite-automations.app/webhook/flush-syntech-queue`.
2. Watch the drainer flush accumulated `ready` rows to the webhook.
3. Verify one full scheduled tick end-to-end (articles land in Notion + Slack as before).

## Rollback

If anything breaks post-cutover:

1. Clear Railway `WEBHOOK_URL` (set it to `""`). The drainer stops flushing; `ready` rows accumulate
   harmlessly.
2. Re-disable the Schedule trigger in n8n.
3. Agent reverts the content-sourcing PR if code-level rollback is needed.

Data is never lost — the queue persists across restarts and rollbacks.
