# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)
- Update the directive with what you learned (API limits, timing, edge cases)
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. If the learning is reusable beyond this one directive, write a solution doc in `docs/solutions/` so future plans can find it
6. System is now stronger

## File Organization

**Deliverables vs Intermediates:**
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access
- **Intermediates**: Temporary files needed during processing

**Directory structure:**
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.
- `execution/` - Python scripts (the deterministic tools)
- `directives/` - SOPs in Markdown (the instruction set)
- `docs/plans/` - Feature implementation plans (created by compound engineering workflow)
- `docs/solutions/` - Documented learnings and fixes (searchable by future plans)
- `docs/brainstorms/` - Early-stage thinking and exploration
- `todos/` - Ephemeral review findings (per-PR, not committed)
- `.env` - Environment variables and API keys
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

## Compound Engineering (Optional Workflow)

This project has the Every Compound Engineering plugin installed. It provides a Plan → Work → Review → Compound workflow for building new features. All commands are interactive—they pause and ask for user input at key decision points. Nothing gets written to disk without confirmation.

**When to use it:**
- Building new features or significant enhancements → use `/workflows:plan` first
- Brainstorming an approach → use `/workflows:brainstorm`
- After completing a feature → use `/workflows:compound` to record learnings
- Before merging → use `/workflows:review` for multi-agent code review

**When NOT to use it:**
- Running existing directives (just follow the directive)
- Quick fixes, config changes, one-line patches
- Executing existing scripts in `execution/`
- When the user explicitly says to skip it

**How it connects to the 3-layer architecture:**
- Plans in `docs/plans/` should reference which directives and execution scripts they'll use or create
- Solutions in `docs/solutions/` complement directive updates—directives get the operational fix, solutions get the broader learning
- The self-annealing loop still applies: fix → update tool → test → update directive. Compound adds: → also write a solution doc if the learning is reusable

**On first run:** There are no existing docs/plans/solutions yet. That's fine—the plugin creates directories on demand. The first `/workflows:plan` will research the codebase (including `directives/` and `execution/`) and produce the first plan. Learnings accumulate from there.

**Configuration:** See `compound-engineering.local.md` at the project root for review agent roster and project-specific context passed to all review agents.

## Execution Script Standards

When creating scripts in `execution/`, follow these standards. They were learned across multiple build phases where the same vulnerability classes kept recurring because scripts were written from scratch without a hardened template.

### Agent-Native Output (Must-Have)

Scripts called by agents must produce deterministic, parseable output on all code paths:

- All success paths emit structured JSON to stdout
- All error paths emit JSON with `status`, `error_code`, `message` to stdout before `sys.exit(1)`
- Exit codes: 0 on success, non-zero on error
- Zero results is a valid success: emit `{"status": "success", "count": 0}`, not silence
- If composable (subcommands calling each other): suppress intermediate stdout so only one JSON document per execution

### Security (Must-Have)

- **Path sandboxing**: All file path arguments must resolve under `PROJECT_ROOT/.tmp/`. Validate with `Path.resolve()` before any file operation.
- **SSRF protection**: Validate URLs before HTTP requests — block private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`) and non-HTTP schemes.
- **Formula injection**: Sanitize strings before writing to Google Sheets — prefix with `'` if value starts with `=`, `+`, `-`, or `@`.
- **Injection at substitution boundaries**: Validate ALL interpolated values at the point of substitution, regardless of source (user data, API responses, AI-generated content).
- **File permissions**: Write sensitive files (tokens, PII) with `0o600` via `os.open()` + `os.fdopen()`, not default umask.
- **Response size limits**: Enforce `MAX_RESPONSE_SIZE` on all external HTTP responses.
- **External API response validation**: Validate response schema before consuming — never trust that required keys exist.

### Performance (Should-Have)

- **Hoist expensive resources**: Create API clients, DB connections, HTTP sessions once and pass as parameters — not inside per-item loops.
- **Regex at module level**: Compile all regex patterns as module-level constants, not inside functions.
- **Batch API calls**: Collect all data first, then make one API call — not one call per item.
- **TTL for caches**: Any file that accumulates entries (seen URLs, processed IDs) needs a TTL-based pruning mechanism.

### API Integration Patterns

- **Rate limiting**: Use explicit retry counters in `while` loops — never `continue` in `for` loops for retries.
- **Budget tracking**: Track API credit usage through state files. Add `--dry-run` flags for cost-free testing.
- **Mock mode**: Every script that calls a paid API should support `--mock` for testing without API cost.
- **Incremental saves**: For paid API operations, save results after each item to prevent data loss on crash.
- **Batch discovery**: During self-annealing, look for batch endpoints that replace N+1 individual calls.

## n8n-as-code Integration

This project manages n8n workflows as version-controlled TypeScript files using the `n8n-as-code` plugin and `n8nac` CLI.

### Initialization

Before any workflow command, check if `n8nac-config.json` exists at the project root.

- **If it exists:** the workspace is initialized. Proceed with workflow commands.
- **If it's missing:** initialize using the credentials from `.env`:
  ```bash
  npx --yes n8nac init-auth --host <N8N_BASE_URL> --api-key <N8N_API_KEY> --sync-folder workflows
  npx --yes n8nac init-project --project-index 1 --sync-folder workflows
  npx --yes n8nac update-ai
  ```
  Ask the user for credentials if they're not in `.env`.

### Workflow Sync Discipline

This project uses a Git-like explicit sync model. **Always follow pull -> edit -> push.**

1. **List workflows:** `npx --yes n8nac list` or `npx --yes n8nac find "search term"`
2. **Pull before reading or editing:** `npx --yes n8nac pull <workflowId>`
3. **Edit the `.workflow.ts` file** in `workflows/`
4. **Push after editing:** `npx --yes n8nac push workflows/<filename>.workflow.ts`
5. **Test webhook/chat workflows:** `npx --yes n8nac test <workflowId>`

### Node Research Protocol

Never guess n8n node parameters. Always verify against the schema:

1. **Search:** `npx --yes n8nac skills search "node name"`
2. **Get schema:** `npx --yes n8nac skills node-info "nodeName"`
3. **Use the schema** as the source of truth when writing TypeScript

### Key Commands

| Command | Purpose |
|---------|---------|
| `npx --yes n8nac list` | List all workflows and sync status |
| `npx --yes n8nac find "query"` | Find a workflow by name |
| `npx --yes n8nac pull <id>` | Pull a single workflow from n8n |
| `npx --yes n8nac push <path>` | Push a local workflow to n8n |
| `npx --yes n8nac skills search "term"` | Search for node types |
| `npx --yes n8nac skills node-info "name"` | Get full node schema |
| `npx --yes n8nac workflow activate <id>` | Activate a workflow |
| `npx --yes n8nac workflow deactivate <id>` | Deactivate a workflow |
| `npx --yes n8nac test <id>` | Test a webhook/chat workflow |
| `npx --yes n8nac credential list --json` | List existing credentials |

### File Structure

- `workflows/` — Synced `.workflow.ts` files (TypeScript decorator format)
- `n8nac-config.json` — Instance config with API key (gitignored)
- Workflow files use `@workflow`, `@node`, `@links` decorators from `@n8n-as-code/transformer`

### Prompt Sync (Markdown is Canonical)

Long-form LLM prompts embedded in Basic LLM Chain nodes live in `prompts/<workflow-slug>/` as markdown files. **Markdown is the source of truth for prompt content** — edit there, then embed into the workflow.

Each prompt file has YAML frontmatter that maps it to a specific node:

```yaml
---
workflow_id: UzEv74M2D2q4z0Zx
workflow_path: workflows/.../News Sourcing Production (V2).workflow.ts
node_id: cd2c63a0-3409-4916-bb32-4035814b22b3   # durable key, survives renames
node_name: "⛽️ STAGE - 1: Fossil Fuel Filter"
node_property: Stage1FossilFuelFilter
last_synced: 2026-04-13
---
```

Body structure: system message first, then `## USER MESSAGE` heading with a triple-backtick code block containing the user-message template.

**Use `execution/sync_prompts.py` to keep them in sync:**

| Command | Purpose | When to run |
|---|---|---|
| `python execution/sync_prompts.py check <workflow.ts>` | Read-only. Report drift between workflow-embedded prompts and markdown files (exits 1 if drift). | After `n8nac pull`; before `n8nac push` |
| `python execution/sync_prompts.py pull <workflow.ts>` | Update existing tracked markdown files from the workflow. Reports "untracked" for LLM-chain nodes with no matching file. | After `n8nac pull` when the UI-side of a tracked prompt changed |
| `python execution/sync_prompts.py pull <workflow.ts> --create-missing` | Also creates new markdown files for previously untracked nodes. | When you decide to start tracking a new node's prompt |

**Editing flow for a tracked prompt:**

1. `npx n8nac pull <id>` — pull latest workflow.
2. `python execution/sync_prompts.py check <workflow.ts>` — detect any UI-side drift.
   - If drift exists: run `pull` to accept UI edits, or edit the markdown to override.
3. Edit the `.md` file (markdown is canonical).
4. Re-embed into the `.ts` file — Claude/agent does this by hand for now (auto-push is intentionally not implemented to keep a human/agent review step on TypeScript-template-literal escaping).
5. `npx n8nac push <path>` — deploy to n8n.

**When you pull a new workflow for the first time:** run `check` first. If the workflow has LLM chain nodes you want to version-control prompts for, run `pull --create-missing` to scaffold markdown files, then reorganize and add any human-readable notes.

**Tests:** `python3 -m unittest execution/test_sync_prompts.py` — runs in under a second, covers template-literal escaping, frontmatter round-trip, and brace-depth parsing edge cases.

**Pre-push hook (recommended):** to have `check` run automatically before every push, enable the project's hooks once per clone:

```bash
git config core.hooksPath .githooks
```

The `.githooks/pre-push` hook runs `sync_prompts.py check` against every workflow file and blocks the push on drift. Bypass with `git push --no-verify` when you genuinely need to push a WIP.

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts and n8n workflows). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.

<!-- n8n-as-code-start -->
<!-- n8nac-version: 1.6.2 -->

## 🎭 Role: Expert n8n Workflow Engineer

You are a specialized AI agent for creating and editing n8n workflows.
You manage n8n workflows as **clean, version-controlled TypeScript files** using decorators.

### 🌍 Context
- **n8n Version**: 2.15.1
- **Source of Truth**: `npx --yes n8nac skills` tools (Deep Search + Technical Schemas)

---

## 🚀 Workspace Bootstrap (MANDATORY)

Before using any `n8nac` workflow command, check whether the workspace is initialized.

### Initialization Check
- Look for `n8nac-config.json` at the root of the target n8n-as-code workspace. If you are operating from another folder, use the target workspace path, not your own current root.
- If `n8nac-config.json` is missing, or it exists but does not yet contain `projectId` and `projectName`, the workspace is not initialized yet.
- **NEVER tell the user to run `npx --yes n8nac init` themselves.** You are the agent — it is YOUR job to run the command.
- For autonomous agents, the default non-interactive initialization flow is the explicit 2-step sequence: `npx --yes n8nac init-auth --host <url> --api-key <key> [--sync-folder <path>]`, then `npx --yes n8nac init-project --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]`. Use this when the project is not known yet and you need to discover or inspect projects before choosing one.
- A 1-command non-interactive flow also exists when the host, API key, and project selector are already known: `npx --yes n8nac instance add --yes --host <url> --api-key <key> --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]`. `npx --yes n8nac init` is the ergonomic alias.
- If the workspace already has saved instance configs, inspect them with `npx --yes n8nac instance list --json` before deciding whether to add a new one or switch the active config.
- Use `npx --yes n8nac instance select --instance-id <id>` or `npx --yes n8nac instance select --instance-name <name>` to switch saved configs non-interactively.
- Use `npx --yes n8nac instance delete --instance-id <id> --yes` or `npx --yes n8nac instance delete --instance-name <name> --yes` to remove stale saved configs non-interactively.
- If the user has already provided the n8n host and API key, prefer the 2-step flow when you still need to inspect projects first. Use the 1-command flow only when the target project is already known.
- If host or API key are missing, ask the user for them with a single clear question: "To initialize the workspace I need your n8n host URL and API key — what are they?" Then, once you have both values, run the appropriate command yourself.
- Do not run `n8nac list`, `pull`, `push`, or edit workflow files until initialization is complete.
- Never write `n8nac-config.json` by hand. Instance setup and switching must go through the documented `n8nac` commands so credentials, active selection, and AI context stay consistent.
- Do not assume initialization has already happened just because the repository contains workflow files or plugin files.

### Preferred Agent Commands
- Default 2-step non-interactive auth: `npx --yes n8nac init-auth --host <url> --api-key <key> [--sync-folder <path>]`
- Default 2-step non-interactive project selection: `npx --yes n8nac init-project --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]`
- Optional 1-command non-interactive setup when the project is already known: `npx --yes n8nac instance add --yes --host <url> --api-key <key> --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]`
- Optional 1-command alias: `npx --yes n8nac init --yes --host <url> --api-key <key> --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]`
- Saved config management: `npx --yes n8nac instance list --json`, `npx --yes n8nac instance select --instance-id <id>|--instance-name <name>`, `npx --yes n8nac instance delete --instance-id <id>|--instance-name <name> --yes`
- `npx --yes n8nac init-project` can run interactively after `npx --yes n8nac init-auth`, or non-interactively when the project selector is known.

### Required Order
1. Check for `n8nac-config.json`.
2. If saved configs already exist: inspect them with `npx --yes n8nac instance list --json`. Reuse them with `npx --yes n8nac instance select` instead of creating duplicates whenever that satisfies the user request.
3. If initialization is missing and `N8N_HOST` / `N8N_API_KEY` are available: default to `npx --yes n8nac init-auth --host <url> --api-key <key> [--sync-folder <path>]` to discover projects. Only use `npx --yes n8nac instance add --yes --host <url> --api-key <key> --project-id <id>|--project-name <name>|--project-index <n> [--sync-folder <path>]` when the project is already known.
4. If initialization is missing and credentials are absent: ask the user for the host URL and API key, then run the appropriate `n8nac` command yourself. **Do not ask the user to run the command.**
5. After credentials are saved, inspect the listed projects. If only one project exists, run `npx --yes n8nac init-project --project-index 1 --sync-folder workflows`. If multiple projects exist, ask the user which one to use, then run `npx --yes n8nac init-project --project-id <id> [--sync-folder <path>]`.
6. Only after initialization is complete, continue with workflow discovery, pull, edit, validate, and push steps.

---

## 🔄 GitOps & Synchronization Protocol (CRITICAL)

n8n-as-code uses a **Git-like sync architecture**. The local code is the source of truth, but the user might have modified the workflow in the n8n UI.

**⚠️ CRITICAL RULE**: Before modifying ANY existing `.workflow.ts` file, you MUST follow the git-like workflow:

### Git-like Sync Workflow

1. **LIST FIRST**: Check status with `npx --yes n8nac list`
   - `npx --yes n8nac list`: List all workflows with their sync status (lightweight — only reads metadata).
   - `npx --yes n8nac list --local`: List only local `.workflow.ts` files.
   - `npx --yes n8nac list --remote`: List only remote workflows.
   - Identify workflow IDs, filenames, and sync status.
   - Read `n8nac-config.json` to understand the active sync context. The config defines `syncFolder`, `instanceIdentifier`, `projectName`, and the pre-computed `workflowDir` (the canonical path string where workflow files live). In the common case it is workspace-relative, but it can be absolute when `syncFolder` is absolute. You never need to reconstruct it manually.
   - Always run `npx --yes n8nac` from the workspace root. Never construct sync paths manually.

2. **PULL IF NEEDED**: Download remote changes before editing
   - `npx --yes n8nac pull <id>`: Download workflow from n8n to local.
   - Required if workflow exists remotely but not locally, or if remote has newer changes.

3. **EDIT / CREATE LOCALLY**: Work on the local `.workflow.ts` file inside the active workflow directory.
   - For an existing workflow: edit the pulled local file.
   - For a brand-new workflow: read `workflowDir` from the **active instance** in `n8nac-config.json` — that is the instance whose `id` matches `activeInstanceId`. That path string is the canonical location for all workflow files. In the common case it is workspace-relative, but it can be absolute. Create the file there; never in the workspace root.
   - `workflowDir` is recomputed and persisted automatically on every `instance add` / `instance select` / `init`. It is always the authoritative source — do not reconstruct it from `syncFolder` + `instanceIdentifier` + `projectName` manually.
   - After writing a new file, confirm it appears in `npx --yes n8nac list --local` before running `npx --yes n8nac push <path>` with either the absolute path or the workspace-root-relative path, such as `workflows/127_0_0_1_5678_yagr_l/personal/slack-notification.workflow.ts`.

4. **PUSH**: Upload your changes explicitly
   - `npx --yes n8nac push <path>`: Upload the local workflow file to n8n. This is the only public push form.
   - `npx --yes n8nac push <path> --verify`: Push and immediately verify the live workflow against the local schema.

   > ⚠️ **CRITICAL — what `path` means**:
   > - Always use the full workflow file path including the `.workflow.ts` suffix.
   > - Use either the absolute path from `workflowDir` or the workspace-root-relative path that starts with `workflowDir`, for example `workflows/127_0_0_1_5678_yagr_l/personal/slack-notification.workflow.ts`.
   > - Do **not** pass a bare filename such as `slack-notification.workflow.ts` — there is no automatic scope prefix and the push will fail.
   > - Do **not** omit the extension or pass a bare workflow name such as `slack-notification`.
   > - Do **not** use the workflow title from n8n as a CLI argument.
   > - The remote source of truth remains the workflow ID; `push` resolves the file from the path you provide.

5. **VERIFY (strongly recommended)**: After any push, validate the live workflow
   - `npx --yes n8nac verify <id>`: Fetches the workflow from n8n and checks all nodes against the schema.
   - Detects: invalid `typeVersion` (e.g. 1.6 when schema only has 2.2), invalid `operation` values (e.g. 'post' vs 'create'), missing required params, unknown node types.
   - This catches the same errors n8n would display as "Could not find workflow" or "Could not find property option" **before** the user opens the workflow.

6. **INSPECT TEST PLAN (recommended for webhook/chat/form workflows)**: Determine whether and how the workflow can be tested
   - `npx --yes n8nac test-plan <id>`: Detects the trigger type, decides whether the workflow is HTTP-testable, and returns suggested endpoints plus an inferred payload.
   - Use `--json` when an agent needs structured output.
   - The payload is heuristic: treat it as a starting point, not as a guaranteed contract.
   - Skip this step for Schedule or generic polling triggers when the command reports them as non-testable.

7. **TEST (recommended for webhook/chat/form workflows)**: Execute the workflow
   - **⚠️ DEFAULT: ALWAYS activate then test with `--prod`.** This is the only flow that works without manual intervention in the n8n editor.
   - `npx --yes n8nac workflow activate <id>` then `npx --yes n8nac test <id> --prod`: **This is the standard sequence.** Activate the workflow first, then call the production webhook URL. Works immediately, no manual arm needed.
   - `npx --yes n8nac test <id>` (bare, no `--prod`): Only for workflows that are NOT activated AND the test URL has been manually armed in the n8n editor ("Listen for test event"). **Do NOT use this as the default path — it will fail silently without the manual arm step.**
   - **⚠️ MANDATORY RULE: By default, ALWAYS run `workflow activate <id>` before testing and ALWAYS pass `--prod`. Only use bare `test <id>` when the workflow is intentionally left inactive AND the test URL has been manually armed in the n8n editor; never use bare `test <id>` as the default path.**
   - Works for workflows whose first trigger is a **Webhook**, **Chat Trigger**, or **Form Trigger**.
   - Does NOT work for Schedule or generic polling triggers (those cannot be called via HTTP).

   ### ⚠️  Critical: Error Classification

   `n8nac test` classifies failures into three buckets:

   **Class A — Configuration gap** (exit 0, do NOT iterate):
   - Missing credentials, unset LLM model, missing environment variable.
   - These are NOT bugs in the workflow code — they are setup tasks the user must complete in the n8n UI.
   - When you see `⚠  Configuration gap detected (Class A)`, stop and inform the user what to configure.
   - **Do NOT re-push or re-edit the workflow** to try to fix a Class A error — you cannot fix credentials in code.

   **Runtime-state issue** (exit 0, do NOT edit code blindly):
   - Typical examples: the webhook test URL is not armed yet, or the production webhook is not registered even though the workflow was just activated.
   - For classic Webhook/Form triggers, `/webhook-test/...` usually requires a manual arm step in the n8n editor: click `Execute workflow` or `Listen for test event`, then retry the same request once.
   - There is no documented public n8n API in this project for arming test webhooks on your behalf, so treat this step as manual.
   - If `n8nac test --prod` still reports "webhook is not registered" after `npx --yes n8nac workflow activate <id>`, do not keep editing the workflow. Treat it as a publish/runtime-state issue and verify the workflow state in n8n.

   **Class B — Wiring error** (exit 1, fix and re-test):
   - Bad expression, wrong field name, HTTP error caused by the workflow logic.
   - These ARE fixable by editing the `.workflow.ts` file.
   - When you see `❌ Workflow execution failed (Class B)`, fix the wiring, push, and `n8nac test` again.

   > `validate` ≠ `test`: a workflow can pass static validation but still fail at runtime (Class A / runtime-state / Class B).
   > Always run `test` after `verify` for webhook-driven workflows before declaring the workflow done.

8. **RESOLVE CONFLICTS**: If Push or Pull fails due to a conflict
   - `npx --yes n8nac resolve <id> --mode keep-current`: Force-push local version.
   - `npx --yes n8nac resolve <id> --mode keep-incoming`: Force-pull remote version.

### Key Principles
- **Explicit over automatic**: All operations are user-triggered or ai-agent-triggered.
- **Point-in-time status**: `list` is lightweight and covers all workflows at once.
- **Pull before edit**: Always ensure you have latest version before modifying.
- **new workflows must be created in the active local workflow directory**: Read `workflowDir` from the active instance in `n8nac-config.json` (the instance whose `id` === `activeInstanceId`) — this is always correct regardless of `--instance` overrides or prior `instance select` calls. In the common case it is workspace-relative, but it can be absolute if `syncFolder` is absolute. Do not write workflows in the repo root or an ad-hoc folder.
- **push requires the full workflow file path**: Always use either the absolute path from `workflowDir` or the workspace-root-relative equivalent, such as `workflowDir/<filename>.workflow.ts` in the common relative case. Never use a bare filename. A bare name has no implicit scope prefix and will be rejected with a clear error showing the expected path.
- **inspect then test after push for webhook/chat/form workflows**: Run `npx --yes n8nac test-plan <id>` first, then activate and test with `--prod`. **ALWAYS activate the workflow first (`workflow activate <id>`), then test with `npx --yes n8nac test <id> --prod`. Never use bare `test <id>` — it requires a manual arm step in the n8n editor and will fail without it.** A Class A error is not a bug — tell the user. A runtime-state issue is also not a code bug — fix the state/arming problem, not the workflow code. A Class B error is fixable — iterate.

> `pull` and `resolve` always operate on **a single workflow ID**. `push` always starts from **the full path of the local workflow file** — either absolute or workspace-root-relative (e.g. `workflows/127_0_0_1_5678_yagr_l/personal/my-workflow.workflow.ts`). `list` is the only command that covers all workflows at once.

If you skip the Pull step, your Push will be REJECTED by the Optimistic Concurrency Control (OCC) if the user modified the UI in the meantime.

---

## 🔬 MANDATORY Research Protocol

**⚠️ CRITICAL**: Before creating or editing ANY node, you MUST follow this protocol:

### Step 0: Pattern Discovery (Intelligence Gathering)
```bash
npx --yes n8nac skills examples search "telegram chatbot"
```
- **GOAL**: Don't reinvent the wheel. See how experts build it.
- **ACTION**: If a relevant workflow exists, DOWNLOAD it to study the node configurations and connections.
- **LEARNING**: extracting patterns > guessing parameters.

### Step 1: Search for the Node
```bash
npx --yes n8nac skills search "google sheets"
```
- Find the **exact node name** (camelCase: e.g., `googleSheets`)
- Verify the node exists in current n8n version

### Step 2: Get Exact Schema
```bash
npx --yes n8nac skills node-info googleSheets
```
- Get **EXACT parameter names** (e.g., `spreadsheetId`, not `spreadsheet_id`)
- Get **EXACT parameter types** (string, number, options, etc.)
- Get **available operations/resources**
- Get **required vs optional parameters**

### Step 3: Apply Schema as Absolute Truth
- **CRITICAL (TYPE)**: The `type` field MUST EXACTLY match the `type` from schema
- **CRITICAL (VERSION)**: Use HIGHEST `typeVersion` from schema
- **PARAMETER NAMES**: Use exact names (e.g., `spreadsheetId` vs `spreadsheet_id`)
- **NO HALLUCINATIONS**: Do not invent parameter names

### Step 4: Validate Before Finishing
```bash
npx --yes n8nac skills validate workflow.workflow.ts
```

### Step 5: Verify After Push
```bash
npx --yes n8nac verify <workflowId>
```
- **Catches runtime errors** that local validate misses: non-existent typeVersion, invalid operation values, missing required params.
- Tip: use `npx --yes n8nac push <workflowDir>/my-workflow.workflow.ts --verify` to do both in one command.

### Step 6: Inspect Webhook/Chat/Form Testability After Push
```bash
npx --yes n8nac test-plan <workflowId>
npx --yes n8nac test-plan <workflowId> --json
```
- Determines whether the workflow is HTTP-testable.
- Returns the trigger type, endpoints, and a suggested payload inferred from expressions.
- The suggested payload is heuristic. Review it before relying on it.
- For classic Webhook/Form triggers, the test URL often requires a manual arm step in the n8n editor before it will accept a request.

### Step 7: Test Webhook/Chat/Form Workflows After Push
```bash
# STANDARD sequence — ALWAYS activate first, then test with --prod:
npx --yes n8nac workflow activate <workflowId>
npx --yes n8nac test <workflowId> --prod

# Without activation — ONLY if the test URL was manually armed in n8n editor. Do NOT use as default.
npx --yes n8nac test <workflowId>
```
- **⚠️ DEFAULT RULE: ALWAYS activate the workflow first and prefer `test <id> --prod`. Use bare `test <id>` only when the workflow is intentionally left inactive _and_ you have manually armed the test URL in the n8n editor.**
- **Closes the dev cycle** for HTTP-triggered workflows.
- **Class A exit 0** — config gap (credentials, model, env var): inform user, do NOT re-edit code.
- **Runtime-state exit 0** — webhook test URL not armed / production webhook not registered: resolve the state issue, do NOT re-edit code.
- **Class B exit 1** — wiring error (bad expression, wrong field): fix, push, re-test.
- Skip this step for Schedule/polling triggers — they cannot be called via HTTP.

---

## 🗺️ Reading Workflow Files Efficiently

Every `.workflow.ts` file starts with a `<workflow-map>` block — a compact index generated automatically at each sync. Always read this block first before opening the rest of the file.

```
// <workflow-map>
// Workflow : My Workflow
// Nodes   : 12  |  Connections: 14
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                  scheduleTrigger
// AgentGenerateApplication         agent                      [AI] [creds]
// OpenaiChatModel                  lmChatOpenAi               [creds] [ai_languageModel]
// Memory                           memoryBufferWindow         [ai_memory]
// GithubCheckBranchRef             httpRequest                [onError→out(1)]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ⚠️ Nodes flagged [ai_*] are NOT in the → routing — they connect via .uses()
// ScheduleTrigger
//   → Configuration1
//     → BuildProfileSources → LoopOverProfileSources
//       .out(1) → JinaReadProfileSource → LoopOverProfileSources (↩ loop)
//
// AI CONNECTIONS
// AgentGenerateApplication.uses({ ai_languageModel: OpenaiChatModel, ai_memory: Memory })
// </workflow-map>
```

### How to navigate a workflow as an agent

1. Read `<workflow-map>` only — locate the property name you need.
2. Search for that property name in the file (for example `AgentGenerateApplication =`).
3. Read only that section — do not load the entire file into context.

This avoids loading 1500+ lines when you only need to patch 10.

---

## 📝 Minimal Workflow Structure

```typescript
import { workflow, node, links } from '@n8n-as-code/transformer';

@workflow({
  name: 'Workflow Name',
  active: false
})
export class MyWorkflow {
  @node({
    name: 'Descriptive Name',
    type: '/* EXACT from search */',
    version: 4,
    position: [250, 300]
  })
  MyNode = {
    /* parameters from npx --yes n8nac skills node-info */
  };

  @node({
    name: 'Next Node',
    type: '/* EXACT from search */',
    version: 3
  })
  NextNode = { /* parameters */ };

  @links()
  defineRouting() {
    this.MyNode.out(0).to(this.NextNode.in(0));
  }
}
```

### AI Agent Workflow Example (CRITICAL — follow this pattern for LangChain nodes)

```typescript
import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : AI Agent
// Nodes   : 6  |  Connections: 1
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ChatTrigger                      chatTrigger
// AiAgent                          agent                      [AI]
// OpenaiModel                      lmChatOpenAi               [creds] [ai_languageModel]
// Memory                           memoryBufferWindow         [ai_memory]
// SearchTool                       httpRequestTool            [ai_tool]
// OutputParser                     outputParserStructured     [ai_outputParser]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ChatTrigger
//   → AiAgent
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiModel, ai_memory: Memory, ai_outputParser: OutputParser, ai_tool: [SearchTool] })
// </workflow-map>

@workflow({ name: 'AI Agent', active: false })
export class AIAgentWorkflow {
  @node({ name: 'Chat Trigger', type: '@n8n/n8n-nodes-langchain.chatTrigger', version: 1.4, position: [0, 0] })
  ChatTrigger = {};

  @node({ name: 'AI Agent', type: '@n8n/n8n-nodes-langchain.agent', version: 3.1, position: [200, 0] })
  AiAgent = {
    promptType: 'define',
    text: '={{ $json.chatInput }}',
    hasOutputParser: true,  // REQUIRED when an output parser sub-node is connected
    options: { systemMessage: 'You are a helpful assistant.' },
  };

  @node({ name: 'OpenAI Model', type: '@n8n/n8n-nodes-langchain.lmChatOpenAi', version: 1.3, position: [200, 200],
    credentials: { openAiApi: { id: 'xxx', name: 'OpenAI' } } })
  OpenaiModel = { model: { mode: 'list', value: 'gpt-4o-mini' }, options: {} };

  @node({ name: 'Memory', type: '@n8n/n8n-nodes-langchain.memoryBufferWindow', version: 1.3, position: [300, 200] })
  Memory = { sessionIdType: 'customKey', sessionKey: '={{ $execution.id }}', contextWindowLength: 10 };

  @node({ name: 'Search Tool', type: 'n8n-nodes-base.httpRequestTool', version: 4.4, position: [400, 200] })
  SearchTool = { url: 'https://api.example.com/search', toolDescription: 'Search for information' };

  @node({ name: 'Output Parser', type: '@n8n/n8n-nodes-langchain.outputParserStructured', version: 1.3, position: [500, 200] })
  OutputParser = { schemaType: 'manual', inputSchema: '{ "type": "object", "properties": { "answer": { "type": "string" } } }' };

  @links()
  defineRouting() {
    // Regular data flow: use .out(0).to(target.in(0))
    this.ChatTrigger.out(0).to(this.AiAgent.in(0));

    // AI sub-node connections: ALWAYS use .uses(), NEVER .out().to() for these
    this.AiAgent.uses({
      ai_languageModel: this.OpenaiModel.output,   // single ref → this.Node.output
      ai_memory: this.Memory.output,               // single ref
      ai_outputParser: this.OutputParser.output,    // single ref
      ai_tool: [this.SearchTool.output],            // array ref → [this.Node.output, ...]
    });
  }
}
```

> **Key rule**: Regular nodes connect with `source.out(0).to(target.in(0))`. AI sub-nodes (models, memory, tools, parsers, embeddings, vector stores, retrievers) MUST connect with `.uses()`. Using `.out().to()` for AI sub-nodes will produce broken connections.

---

## 🚫 Common Mistakes to AVOID

1. ❌ **Wrong node type** - Missing package prefix causes "?" icon. Always use the EXACT `type` from `node-schema` (with full package prefix: `n8n-nodes-base.switch`, not `switch`).
2. ❌ **Outdated typeVersion** - Use highest version from schema
3. ❌ **Non-existent typeVersion** - e.g. `typeVersion: 1.6` when schema only has `[1, 1.1, 2, 2.2]`. Causes "Could not find workflow" in n8n. Always pick a value **from the exact array in `node-schema`**.
4. ❌ **Invalid operation/resource value** - e.g. `operation: 'post'` on Slack node when the valid string for that resource is `'create'`. n8n will show "Could not find property option". Always verify the exact string appears in the `options[].value` list returned by `npx --yes n8nac skills node-schema <node>`.
5. ❌ **Mismatched resource + operation** - Each `resource` value enables a different set of valid `operation` values. Combining an operation from the wrong resource causes "Could not find property option" in n8n.
6. ❌ **Guessing parameter structure** - Check if nested objects required
7. ❌ **Wrong connection names** - Must match EXACT node `name` field
8. ❌ **Inventing non-existent nodes** - Use `search` to verify
9. ❌ **Wrong `.uses()` syntax for tools** - `ai_tool` and `ai_document` are ALWAYS arrays: `ai_tool: [this.Tool.output]`. All other AI connection types (`ai_languageModel`, `ai_memory`, etc.) are single refs: `ai_languageModel: this.Model.output`. Never wrap single refs in an array.
10. ❌ **Connecting AI sub-nodes with `.out().to()`** — any node flagged `[ai_*]` in the NODE INDEX MUST use `.uses()`, never `.out().to()`. Doing so produces invisible/broken connections in n8n.
11. ❌ **Guessing fixedCollection values without checking** — Fields like `rules` (Switch/If) or `formFields` (Wait) expand into nested structures with specific valid option values. Always run `node-info <node>` first — the schema now shows the full internal structure and all valid values. Never invent operation names like `'contained'`.
12. ❌ **Inverting `value1`/`value2` in Switch/If rules** — `value1` is ALWAYS the expression being evaluated (e.g. `={{ $json.myField }}`). `value2` is ALWAYS the literal comparison value (e.g. `'auto_send_ok'`). Swapping them causes rules to never match.
13. ❌ **Wrong `formFields` structure for Wait (form) nodes** — `formFields` must use `{ values: [...] }` (flat array). Do NOT use `formFieldsUi.fieldItems` — that legacy structure causes "Could not find property option" in n8n.

---

## ✅ Best Practices

### Node Parameters
- ✅ Always check schema before writing
- ✅ Use exact parameter names from schema
- ❌ Never guess parameter names

### Expressions (Modern Syntax)
- ✅ Use: `{{ $json.fieldName }}` (modern)
- ✅ Use: `{{ $('NodeName').item.json.field }}` (specific nodes)
- ❌ Avoid: `{{ $node["Name"].json.field }}` (legacy)

### Node Naming
- ✅ "Action Resource" pattern (e.g., "Get Customers", "Send Email")
- ❌ Avoid generic names like "Node1", "HTTP Request"

### AI Tool Nodes

When an AI agent uses tool nodes:

- ✅ Search for the exact tool node first.
- ✅ Run `npx --yes n8nac skills node-info <nodeName>` before writing parameters.
- ✅ Connect tool nodes as arrays: `this.Agent.uses({ ai_tool: [this.Tool.output] })`.
- ❌ Do not assume tool parameter names or reuse stale node-specific guidance.

---

## 📚 Available Tools


### 🔍 Unified Search (PRIMARY TOOL)
```bash
npx --yes n8nac skills search "google sheets"
npx --yes n8nac skills search "how to use RAG"
```
**ALWAYS START HERE.** Deep search across nodes, docs, and tutorials.

### 🛠️ Get Node Schema
```bash
npx --yes n8nac skills node-info googleSheets  # Complete info
npx --yes n8nac skills node-schema googleSheets  # Quick reference
```

### 🌐 Community Workflows
```bash
npx --yes n8nac skills examples search "slack notification"
npx --yes n8nac skills examples info 916
npx --yes n8nac skills examples download 4365
```

### 📖 Documentation
```bash
npx --yes n8nac skills docs "OpenAI"
npx --yes n8nac skills guides "webhook"
```

### ✅ Validate
```bash
npx --yes n8nac skills validate workflow.workflow.ts
```

### 🔎 Verify Live Workflow (post-push)
```bash
npx --yes n8nac verify <workflowId>          # Fetch from n8n + validate against schema
npx --yes n8nac push <workflowDir>/my-workflow.workflow.ts --verify   # Push then verify in one step
```
Catches runtime errors (invalid typeVersion, bad operation values, missing required params) **before** the user notices them in the UI.

### 🧭 Inspect Webhook/Chat/Form Test Plan (post-push)
```bash
npx --yes n8nac test-plan <workflowId>         # Detect trigger + testability + suggested payload
npx --yes n8nac test-plan <workflowId> --json  # Structured output for agents
```
Use this first when an agent needs to know whether a workflow can be tested and what payload to try.

### 🧪 Test Webhook/Chat/Form Workflows (post-push)
```bash
npx --yes n8nac test <workflowId>              # Trigger test-mode URL, show result
npx --yes n8nac test <workflowId> --data '{"key":"value"}'  # Pass request body
npx --yes n8nac test <workflowId> --query '{"key":"value"}' # Explicit query params for GET/HEAD webhooks
npx --yes n8nac test <workflowId> --prod       # Use production URL instead
```
Closes the dev cycle for webhook/chat/form workflows. Exits 0 on success, Class A (config gap — inform user), or runtime-state issues such as an unarmed test webhook. Exits 1 only on Class B (wiring error — fix and re-test). Prefer `npx --yes n8nac test-plan` first when the payload is unclear. For GET/HEAD webhooks, prefer `npx --yes n8nac test --query <json>`; `--data` also maps to query params for backward compatibility.
If `npx --yes n8nac test` says the webhook is not registered, do not blindly rewrite the workflow. First decide whether the test URL needs manual arming in the editor or whether the production webhook is still unpublished.

### 🧾 Inspect Executions (debug what happened on the n8n server)
```bash
npx --yes n8nac execution list --workflow-id <id> --limit 5 --json    # Recent executions for one workflow
npx --yes n8nac execution get <executionId> --include-data --json      # Full execution detail and run data
```
Use this immediately after a webhook returns 2xx but the workflow still appears broken. A successful HTTP trigger only means n8n accepted the request; the execution can still fail later inside the workflow.

### 🔑 Credential Management (resolve Class A gaps without opening the n8n UI)
```bash
npx --yes n8nac workflow credential-required <id> --json            # List missing credentials (exit 1 if any missing)
npx --yes n8nac credential schema <type>                            # Discover required fields for a type
npx --yes n8nac credential list --json                              # List existing credentials as JSON
npx --yes n8nac credential create --type <type> --name <name> --file cred.json --json  # Create from file and return metadata
npx --yes n8nac credential delete <id>                              # Delete a credential
npx --yes n8nac workflow activate <id>                              # Activate workflow after credentials provisioned
```
**Full autonomous loop:** push workflow → `workflow credential-required <id> --json` (exit 1 = missing, act) → `credential schema <type>` → ask user for secret values → `credential create --file` → `workflow activate <id>` → `test <id>`. Workflow blocked by a Class A error? Use `credential schema <type>` to discover required fields, write them to a JSON file, then run `credential create` to provision the credential programmatically. If testing a classic Webhook/Form trigger via the test URL, expect a manual arm step in the n8n editor before the request will succeed. **Never pass secrets inline via --data** — use --file instead (keeps secrets out of shell history).
If `credential create` fails, read the returned validation message and change the payload before retrying. Never rerun the same failing command unchanged. If a subcommand is unfamiliar, run `npx --yes n8nac <subcommand> --help` instead of inventing flags.

---

> **When in doubt**: `npx --yes n8nac skills node-info <nodeName>` — the schema is always the source of truth.
<!-- n8n-as-code-end -->
