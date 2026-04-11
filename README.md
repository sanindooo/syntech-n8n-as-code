# Syntech n8n-as-code

Manage Syntech Biofuels' n8n workflows as version-controlled TypeScript files. Built on **CEDOE** ([Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) + [DOE](https://every.to/p/how-to-build-ai-agents-that-actually-work)) with the [n8n-as-code](https://github.com/EtienneLescot/n8n-as-code) plugin for direct IDE-to-n8n sync.

## Prerequisites

- Node.js 18+
- Python 3.10+
- An AI coding tool (Claude Code, Cursor, Windsurf, etc.)
- Access to the Syntech n8n instance with an API key

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd syntech-n8n-as-code

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Fill in N8N_BASE_URL and N8N_API_KEY (see below)

# 4. Initialize n8n-as-code workspace
npx --yes n8nac init-auth --host <your-n8n-url> --api-key <your-api-key> --sync-folder workflows
npx --yes n8nac init-project --project-index 1 --sync-folder workflows
npx --yes n8nac update-ai
```

### Getting your n8n API key

1. Log into your n8n instance
2. Go to **Settings > API**
3. Click **Create API Key**
4. Copy the key into your `.env` file as `N8N_API_KEY`

## Working with Workflows

### List available workflows

```bash
npx --yes n8nac list              # Table of all workflows with sync status
npx --yes n8nac find "search"     # Find by name
```

### Pull a workflow

```bash
npx --yes n8nac pull <workflowId>
```

This downloads the workflow as a `.workflow.ts` file into `workflows/`. Always pull before editing.

### Edit and push

Edit the TypeScript file in `workflows/`, then push it back:

```bash
npx --yes n8nac push workflows/<filename>.workflow.ts
```

### Using your AI tool

Open this project in Claude Code (or another AI tool) and ask it to work with workflows directly:

```
> Pull the "Image Generation" workflow
> Add a new Slack notification node after the HTTP request
> Push the changes
```

The agent knows the n8n-as-code protocol — it will pull, look up node schemas, edit the TypeScript, and push automatically.

## Project Structure

```
.
├── workflows/           # Synced n8n workflow files (.workflow.ts)
├── directives/          # SOPs in Markdown (the instruction set)
├── execution/           # Deterministic Python scripts (the tools)
├── docs/
│   ├── plans/           # Feature implementation plans
│   ├── solutions/       # Documented learnings and fixes
│   └── brainstorms/     # Early-stage thinking
├── templates/           # Data files used by execution scripts
├── .tmp/                # Intermediate files (never committed)
├── .env.example         # Environment variable template
├── CLAUDE.md            # Agent instructions (mirrored across AI tools)
├── AGENTS.md            # Mirror for Codex/other agents (auto-updated by n8nac)
├── GEMINI.md            # Mirror for Gemini
├── n8nac-config.json    # n8n instance config (gitignored, contains API key)
└── compound-engineering.local.md
```

## Architecture

This project uses a 3-layer architecture:

| Layer | Role | Lives in |
|-------|------|----------|
| **Directive** | SOPs defining what to do | `directives/` |
| **Orchestration** | AI agent reads directives and makes decisions | Your AI tool |
| **Execution** | Deterministic scripts + n8n workflows | `execution/` and `workflows/` |

n8n workflows are the primary execution layer for automation. Python scripts in `execution/` handle supporting tasks (data processing, API integrations, etc.).

## Compound Engineering (Optional)

For complex features, use the Compound Engineering workflow:

| Command | When to use |
|---------|-------------|
| `/ce:brainstorm` | Exploring an approach |
| `/ce:plan` | Before building new features |
| `/ce:work` | Executing an implementation plan |
| `/ce:review` | Before merging |
| `/ce:compound` | After finishing a feature (capture learnings) |

## Contributing

- **Pull before you edit, push after you edit** — treat n8n workflows like git branches
- **Mirror agent instructions** — changes to `CLAUDE.md` must be mirrored to `GEMINI.md`. `AGENTS.md` is auto-managed by `npx n8nac update-ai`.
- **Never hardcode secrets** — use `.env` for API keys, n8n credentials for workflow secrets
- **Update directives as you learn** — they're living documents
