# Claude Instructions

Project agent instructions live in **[AGENTS.md](AGENTS.md)**. Read that file — it is the canonical source.

AGENTS.md is chosen because `npx n8nac update-ai` maintains an auto-generated n8n-as-code section there; keeping a separate hand-maintained copy here leads to drift.

This file exists only so harnesses that specifically look for `CLAUDE.md` find a pointer to the real instructions.
