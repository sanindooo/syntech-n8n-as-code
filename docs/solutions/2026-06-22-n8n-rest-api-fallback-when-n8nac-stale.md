# Solution: n8n REST API as fallback when n8nac config is stale

**Date:** 2026-06-22
**Tags:** n8n, n8nac, workflows, rest-api, recovery

## Context

`npx --yes n8nac pull <id>` and `push <path>` fail with:

> ❌ CLI not configured. Create a V4 workspace environment with `n8nac env add <name> --base-url <url> --workflows-path workflows/<name>` and store auth with `n8nac env auth set <name> --api-key-stdin`.

This repo's `n8nac-config.json` is on schema `version: 2` but the installed CLI expects v4. Cross-repo plan execution (here, `docs/plans/2026-06-22-001-feat-source-date-and-custom-site-intake-plan.md`) needed to push code-node updates to AI Research Sourcing (`txdJXCYFkB1HCZtI`) and create a new `Custom Site — Argus Media` workflow without the CLI.

## Fallback workflow (REST API)

n8n's Public REST API at `${N8N_BASE_URL%/}/api/v1` is the source of truth that n8nac wraps. Auth is `X-N8N-API-KEY: ${N8N_API_KEY}` from `.env`. Use it directly when the CLI is unavailable.

### Pull a workflow

```bash
source .env && N8N_BASE_URL="${N8N_BASE_URL%/}"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_BASE_URL/api/v1/workflows/<id>" > workflow.json
```

### Update an existing workflow (PUT)

The PUT endpoint replaces the workflow. **Strip read-only / computed fields** before sending — the API rejects unknown properties on `settings` and similar.

```bash
# Keep only the writable subset
jq '{name, nodes, connections, settings: {executionOrder: .settings.executionOrder}, staticData}' \
  workflow.json > workflow-push.json

curl -s -X PUT \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  --data @workflow-push.json \
  "$N8N_BASE_URL/api/v1/workflows/<id>"
```

Settings keys n8n's v1 schema accepts: `executionOrder`, `errorWorkflow`, `timezone`, `saveDataErrorExecution`, `saveDataSuccessExecution`, `saveExecutionProgress`, `saveManualExecutions`, `callerPolicy`. Keys like `availableInMCP` and `binaryMode` are surfaced by the UI but **not** writable via the public API.

### Create a new workflow (POST)

```bash
curl -s -X POST \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  --data @new-workflow.json \
  "$N8N_BASE_URL/api/v1/workflows"
```

Returns the created workflow with assigned `id` + `webhookId` per webhook node. The workflow starts `active: false` — activate via UI or `POST /workflows/<id>/activate` once tested.

### Activate / deactivate

```bash
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_BASE_URL/api/v1/workflows/<id>/activate"
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_BASE_URL/api/v1/workflows/<id>/deactivate"
```

## Reconciling with the repo

n8nac normally generates a `.ts` mirror under `workflows/<instance>/<project>/` for every workflow. When the CLI is broken and you push via REST, the local `.ts` will drift. Two reconciliation paths:

1. **Restore the CLI first** (preferred). Run the v4 init commands in the error message:
   ```
   npx --yes n8nac env add stephen --base-url $N8N_BASE_URL --workflows-path workflows/<instance>
   echo $N8N_API_KEY | npx --yes n8nac env auth set stephen --api-key-stdin
   npx --yes n8nac pull <workflow-id>
   ```
   This regenerates the `.ts` cleanly from the live n8n state.

2. **Snapshot the JSON to `workflows/snapshots/`** (this PR's path). Saves a sanitised `.workflow.json` (id/timestamps/webhookId removed) so the live state is reproducible from git history even before the CLI is restored. Not a substitute for the `.ts` mirror — just a record.

## Lessons

- `npx --yes n8nac update-ai` is what keeps `AGENTS.md`'s n8n-as-code section in sync — if the CLI is broken, that section may also drift. Verify before extending.
- Auth via `X-N8N-API-KEY` header (not Bearer). The same key in `.env` works for both n8nac and direct REST.
- The webhook node's `webhookId` is server-assigned; don't include it when authoring new workflow JSON or update payloads (n8n preserves the existing one).
- For workflows with sticky notes / colour annotations, the `nodeGroups` field is server-managed — don't try to roundtrip it.

## Related

- `docs/plans/2026-06-22-001-feat-source-date-and-custom-site-intake-plan.md` (the plan that uncovered the CLI gap during U5 + U6 execution)
- `AGENTS.md` § "n8n-as-code" — canonical CLI reference (assumes CLI is configured)
