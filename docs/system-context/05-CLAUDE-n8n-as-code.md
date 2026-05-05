# Claude Instructions — syntech-n8n-as-code

## System Context

This repository is the orchestration layer for the Syntech biofuel news intelligence pipeline. It contains n8n workflows managed as TypeScript code.

```
┌─────────────────────────────────────────────────────────┐
│           syntech-n8n-as-code  ← YOU ARE HERE          │
│                                                         │
│  n8n workflows as version-controlled TypeScript        │
│  - Cron/webhook triggers                                │
│  - Calls content-sourcing for discovery                 │
│  - Receives flush webhooks from drainer                 │
│  - Calls classifier per article                         │
│  - Posts to Slack on completion                         │
└────────────────────────────┬────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                        │
         ▼                                        ▼
syntech-content-sourcing              syntech-biofuel-relevance-classifier
    │                                        │
    │                                        ▼
    ▼                              article-db + Notion
url_work_queue + drainer
```

## This Repository's Role

1. **Orchestration** — coordinates the entire pipeline via n8n workflows
2. **Trigger management** — cron schedules, webhook receivers
3. **Error handling** — retry logic, error notifications
4. **Workflow versioning** — workflows are TypeScript, tracked in git

## Key Workflows

- **Source Discovery** — loops through configured sources, calls `/search` on content-sourcing
- **Drainer Receiver** — webhook that receives flushed article batches
- **Classification Loop** — iterates through articles, calls `/classify` on each
- **Notification** — posts summaries to Slack

## Key Invariants

1. **Bearer auth pattern** — use `httpBearerAuth` credential type, not `httpHeaderAuth`, for Authorization headers

2. **`source_category` passthrough** — must be preserved from source config → content-sourcing → classifier. Never drop or modify in n8n expressions.

3. **Batch handling** — content-sourcing flushes batches; n8n loops through them. Don't assume single-item responses.

4. **Error classification** — distinguish between Class A (config gap, user must fix) and Class B (wiring error, fix the workflow)

## Important Files

- `workflows/` — n8n workflow TypeScript files
- `prompts/` — LLM prompts for Basic LLM Chain nodes (markdown is canonical)
- `execution/` — Python scripts for deterministic operations
- `directives/` — SOPs for the 3-layer architecture
- `docs/plans/` — feature implementation plans

## Related Repositories

| Repository | Relationship |
|------------|--------------|
| [syntech-content-sourcing](https://github.com/sanindooo/syntech-content-sourcing) | Called via `/search`, receives flush webhook from drainer |
| [syntech-biofuel-relevance-classifier](https://github.com/Granite-Marketing/syntech-biofuel-relevance-classifier) | Called via `/classify` for each article |
| [syntech-intelligence-dashboard](https://github.com/sanindooo/syntech-intelligence-dashboard) | Downstream — displays the classified articles |

## n8n-as-code CLI

This repo uses `n8nac` CLI for workflow management:

```bash
npx n8nac list              # List workflows and sync status
npx n8nac pull <id>         # Pull workflow from n8n
npx n8nac push <path>       # Push workflow to n8n
npx n8nac test <id> --prod  # Test webhook workflow
npx n8nac verify <id>       # Validate against schema
```

See `AGENTS.md` for full n8n-as-code protocol.

## Environment

- **n8n instance**: syntech-biofuels.granite-automations.app
- **Sync folder**: `workflows/`
- **Config**: `n8nac-config.json` (gitignored)
