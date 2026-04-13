#!/usr/bin/env python3
"""sync_prompts.py — sync n8n workflow LLM prompts ↔ markdown files.

Markdown is the canonical source for prompt CONTENT.
The workflow .ts file is the canonical source for which nodes EXIST.

Subcommands
-----------
  pull  <workflow.ts>   Extract every Basic LLM Chain node's system + user
                        message from the workflow and write/update a markdown
                        file under prompts/<workflow-slug>/. Existing files
                        with matching node_id frontmatter are updated in place;
                        new files are created with derived names.

  check <workflow.ts>   Read-only. For every prompt markdown file whose
                        frontmatter points at this workflow, compare the .md
                        content against what is embedded in the .ts file and
                        report drift as a unified diff. Exits non-zero if any
                        drift is found.

Output
------
Both subcommands emit a JSON summary on stdout per the project's agent-native
output convention:

  {"status": "success", "command": "...", "workflow": "...", "results": [...]}

`check` adds `"drift_count": N` and exits 1 if N > 0.
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

# --- Project layout ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]
PROMPTS_ROOT = PROJECT_ROOT / "prompts"

# --- Patterns ---------------------------------------------------------------

# Match a single @node({...}) decorator block plus the property assignment
# that immediately follows it. We only pluck out the fields we need.
NODE_BLOCK_RE = re.compile(
    r"@node\(\{(?P<decorator>.*?)\}\)\s*"
    r"(?P<property>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{(?P<body>.*?)\n    \};",
    re.DOTALL,
)

# Inside a decorator block: id, name, type
ID_RE = re.compile(r"id:\s*'([^']+)'")
NAME_RE = re.compile(r"name:\s*'((?:[^'\\]|\\.)*)'")
TYPE_RE = re.compile(r"type:\s*'([^']+)'")

CHAIN_LLM_TYPE = "@n8n/n8n-nodes-langchain.chainLlm"

# --- Frontmatter parsing (no PyYAML dependency) -----------------------------

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
FRONTMATTER_LINE_RE = re.compile(r'^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$')


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body) — empty dict if no frontmatter."""
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    block = m.group(1)
    body = text[m.end():]
    fm: dict[str, str] = {}
    for line in block.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        match = FRONTMATTER_LINE_RE.match(line)
        if not match:
            continue
        key, value = match.group(1), match.group(2).strip()
        # Strip surrounding quotes if present
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        fm[key] = value
    return fm, body


def render_frontmatter(fm: dict) -> str:
    """Render frontmatter dict back into YAML-ish header."""
    lines = ["---"]
    # Stable key ordering for diffability
    for key in (
        "workflow_id",
        "workflow_path",
        "node_id",
        "node_name",
        "node_property",
        "last_synced",
    ):
        if key in fm:
            value = fm[key]
            # Quote values containing colons or unicode (emoji)
            if ":" in value or any(ord(c) > 127 for c in value):
                value = f'"{value}"'
            lines.append(f"{key}: {value}")
    # Any extra keys we don't know about, preserve at end
    for key, value in fm.items():
        if key in {"workflow_id", "workflow_path", "node_id", "node_name", "node_property", "last_synced"}:
            continue
        if ":" in value or any(ord(c) > 127 for c in value):
            value = f'"{value}"'
        lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines) + "\n"


# --- TS template literal handling -------------------------------------------

def extract_template_literal(text: str, key: str) -> Optional[tuple[str, int, int]]:
    """Find `<key>: \`...\`` in text. Return (content, start, end) where
    start/end span the entire template literal including backticks. The
    content is unescaped (\\` → `) and the leading `=` stripped.

    Returns None if not found.
    """
    # Find `<key>:` followed by optional whitespace then a backtick.
    pattern = re.compile(rf"\b{re.escape(key)}:\s*`")
    m = pattern.search(text)
    if not m:
        return None
    body_start = m.end()  # position right after opening backtick
    i = body_start
    while i < len(text):
        c = text[i]
        if c == "\\" and i + 1 < len(text):
            i += 2
            continue
        if c == "`":
            content = text[body_start:i]
            # Unescape backslash-escaped backticks and dollar signs
            content = content.replace("\\`", "`").replace("\\$", "$")
            # Strip leading `=` (n8n expression marker) if present
            if content.startswith("="):
                content = content[1:]
            return content, m.start(), i + 1  # end is after closing backtick
        i += 1
    return None


def escape_for_template_literal(text: str) -> str:
    """Inverse of extract: escape backslashes, backticks, ${} for embedding
    into a TS template literal. Order matters: backslash first."""
    text = text.replace("\\", "\\\\")
    text = text.replace("`", "\\`")
    text = text.replace("${", "\\${")
    return text


# --- Slugging ---------------------------------------------------------------

EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001F9FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U00002600-\U000027BF"
    "\U0001FA70-\U0001FAFF"
    "]+",
    flags=re.UNICODE,
)


def slugify(name: str) -> str:
    """Lowercase, strip emojis/punctuation, collapse to underscores."""
    s = EMOJI_RE.sub("", name)
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = s.strip("_")
    return s or "node"


def workflow_slug(workflow_path: Path) -> str:
    """Derive a slug for the prompts subfolder from the workflow filename."""
    stem = workflow_path.stem  # 'News Sourcing Production (V2).workflow'
    if stem.endswith(".workflow"):
        stem = stem[: -len(".workflow")]
    return slugify(stem)


# --- Workflow parsing -------------------------------------------------------

@dataclass
class WorkflowNode:
    node_id: str
    node_name: str
    node_property: str
    system_message: Optional[str]
    user_message: Optional[str]
    # Span info for embedding (only for known prompts)
    body_start: int
    body_end: int


def parse_workflow(workflow_text: str) -> list[WorkflowNode]:
    """Find every chainLlm node and pull out its system + user messages."""
    nodes: list[WorkflowNode] = []
    for match in NODE_BLOCK_RE.finditer(workflow_text):
        decorator = match.group("decorator")
        prop = match.group("property")
        body = match.group("body")
        type_match = TYPE_RE.search(decorator)
        if not type_match or type_match.group(1) != CHAIN_LLM_TYPE:
            continue
        id_match = ID_RE.search(decorator)
        name_match = NAME_RE.search(decorator)
        if not id_match or not name_match:
            continue
        # Extract `text:` (user message) and `message:` (system message inside messageValues)
        text_extract = extract_template_literal(body, "text")
        message_extract = extract_template_literal(body, "message")
        nodes.append(
            WorkflowNode(
                node_id=id_match.group(1),
                node_name=name_match.group(1),
                node_property=prop,
                system_message=message_extract[0] if message_extract else None,
                user_message=text_extract[0] if text_extract else None,
                body_start=match.start("body"),
                body_end=match.end("body"),
            )
        )
    return nodes


# --- Markdown <-> prompt conversion -----------------------------------------

USER_MESSAGE_HEADER_RE = re.compile(r"^## USER MESSAGE\s*$", re.MULTILINE)
USER_MESSAGE_BLOCK_RE = re.compile(r"```\n(.*?)\n```", re.DOTALL)


def split_md_body(body: str) -> tuple[str, Optional[str]]:
    """Split markdown body into (system_message_md, user_message_text).

    System message = everything before the `## USER MESSAGE` header (trimmed).
    User message text = the contents of the first triple-backtick code block
    after that header. Returns (system_md, None) if no user-message section.
    """
    m = USER_MESSAGE_HEADER_RE.search(body)
    if not m:
        return body.strip(), None
    system_part = body[: m.start()]
    after = body[m.end():]
    code = USER_MESSAGE_BLOCK_RE.search(after)
    user_text = code.group(1) if code else None
    # Trim any trailing '---' separator (used visually before USER MESSAGE)
    system_part = re.sub(r"\n+---\s*$", "", system_part)
    return system_part.strip(), user_text


def md_to_prompt(md_body: str) -> tuple[str, Optional[str]]:
    """Adapter — same as split_md_body, named for clarity at call sites."""
    return split_md_body(md_body)


def assemble_md_body(system_message: str, user_message: Optional[str]) -> str:
    """Build the markdown body from extracted prompts (used by `pull`)."""
    parts = [system_message.rstrip(), ""]
    if user_message is not None:
        parts.extend(
            [
                "---",
                "",
                "## USER MESSAGE",
                "",
                "```",
                user_message.rstrip("\n"),
                "```",
                "",
            ]
        )
    return "\n".join(parts)


# --- Operations -------------------------------------------------------------

def cmd_pull(workflow_path: Path, create_missing: bool = False) -> dict:
    workflow_text = workflow_path.read_text(encoding="utf-8")
    nodes = parse_workflow(workflow_text)
    rel_workflow = workflow_path.relative_to(PROJECT_ROOT).as_posix()
    workflow_id = derive_workflow_id(workflow_text)

    # Build a node_id -> existing_md_path index across ALL prompts subdirs,
    # so files can live wherever the user filed them.
    existing_by_id: dict[str, Path] = {}
    if PROMPTS_ROOT.exists():
        for md_file in PROMPTS_ROOT.rglob("*.md"):
            fm, _body = parse_frontmatter(md_file.read_text(encoding="utf-8"))
            if fm.get("node_id"):
                existing_by_id[fm["node_id"]] = md_file

    today = _today_iso()
    results = []
    for node in nodes:
        if node.system_message is None and node.user_message is None:
            continue
        target = existing_by_id.get(node.node_id)
        if target is None:
            if not create_missing:
                results.append(
                    {
                        "node_id": node.node_id,
                        "node_name": node.node_name,
                        "path": None,
                        "status": "untracked",
                    }
                )
                continue
            out_dir = PROMPTS_ROOT / workflow_slug(workflow_path)
            out_dir.mkdir(parents=True, exist_ok=True)
            target = out_dir / f"{slugify(node.node_property)}.md"
        fm = {
            "workflow_id": workflow_id or "",
            "workflow_path": rel_workflow,
            "node_id": node.node_id,
            "node_name": node.node_name,
            "node_property": node.node_property,
            "last_synced": today,
        }
        body = assemble_md_body(node.system_message or "", node.user_message)
        new_text = render_frontmatter(fm) + "\n" + body
        was_new = not target.exists()
        unchanged = (not was_new) and target.read_text(encoding="utf-8") == new_text
        if not unchanged:
            target.write_text(new_text, encoding="utf-8")
        results.append(
            {
                "node_id": node.node_id,
                "node_name": node.node_name,
                "path": target.relative_to(PROJECT_ROOT).as_posix(),
                "status": "created" if was_new else ("unchanged" if unchanged else "updated"),
            }
        )
    return {
        "status": "success",
        "command": "pull",
        "workflow": rel_workflow,
        "count": len(results),
        "untracked": sum(1 for r in results if r["status"] == "untracked"),
        "results": results,
    }


def cmd_check(workflow_path: Path) -> dict:
    workflow_text = workflow_path.read_text(encoding="utf-8")
    nodes_by_id = {n.node_id: n for n in parse_workflow(workflow_text)}
    rel_workflow = workflow_path.relative_to(PROJECT_ROOT).as_posix()

    results = []
    drift_count = 0

    for md_file in sorted(PROMPTS_ROOT.rglob("*.md")):
        fm, body = parse_frontmatter(md_file.read_text(encoding="utf-8"))
        if fm.get("workflow_path") != rel_workflow:
            continue
        node_id = fm.get("node_id")
        node = nodes_by_id.get(node_id) if node_id else None
        if node is None:
            results.append(
                {
                    "path": md_file.relative_to(PROJECT_ROOT).as_posix(),
                    "node_id": node_id,
                    "status": "missing_in_workflow",
                    "diff": "",
                }
            )
            drift_count += 1
            continue
        md_system, md_user = md_to_prompt(body)
        ts_system = (node.system_message or "").rstrip()
        ts_user = node.user_message
        sys_diff = _unified(ts_system, md_system.rstrip(), f"{md_file.name} (workflow)", f"{md_file.name} (markdown)")
        user_diff = _unified(
            (ts_user or "").rstrip(),
            (md_user or "").rstrip(),
            f"{md_file.name} text (workflow)",
            f"{md_file.name} text (markdown)",
        )
        in_sync = not sys_diff and not user_diff
        if not in_sync:
            drift_count += 1
        results.append(
            {
                "path": md_file.relative_to(PROJECT_ROOT).as_posix(),
                "node_id": node.node_id,
                "node_name": node.node_name,
                "status": "in_sync" if in_sync else "drift",
                "system_diff": sys_diff,
                "user_diff": user_diff,
            }
        )
    return {
        "status": "success",
        "command": "check",
        "workflow": rel_workflow,
        "checked": len(results),
        "drift_count": drift_count,
        "results": results,
    }


# --- Helpers ----------------------------------------------------------------

def _unified(a: str, b: str, name_a: str, name_b: str) -> str:
    if a == b:
        return ""
    diff = difflib.unified_diff(
        a.splitlines(keepends=True),
        b.splitlines(keepends=True),
        fromfile=name_a,
        tofile=name_b,
        n=2,
    )
    return "".join(diff)


def _today_iso() -> str:
    import datetime
    return datetime.date.today().isoformat()


def derive_workflow_id(workflow_text: str) -> Optional[str]:
    """Pull the workflow id from `@workflow({ id: '...' })` if present."""
    m = re.search(r"@workflow\(\{[^}]*?id:\s*'([^']+)'", workflow_text, re.DOTALL)
    return m.group(1) if m else None


# --- CLI --------------------------------------------------------------------

def _emit(result: dict, exit_code: int = 0) -> None:
    json.dump(result, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")
    sys.exit(exit_code)


def main(argv: list[str]) -> None:
    parser = argparse.ArgumentParser(prog="sync_prompts.py", description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("pull", "check"):
        p = sub.add_parser(name, help=f"{name} prompts")
        p.add_argument("workflow", help="Path to workflow .ts file")
        if name == "pull":
            p.add_argument(
                "--create-missing",
                action="store_true",
                help="Create .md files for LLM chain nodes that have no matching "
                "prompt file (default: only update existing files).",
            )
    args = parser.parse_args(argv)

    workflow_path = Path(args.workflow).resolve()
    if not workflow_path.exists():
        _emit({"status": "error", "error_code": "workflow_not_found", "message": str(workflow_path)}, 1)
    try:
        workflow_path.relative_to(PROJECT_ROOT)
    except ValueError:
        _emit({"status": "error", "error_code": "outside_project_root", "message": str(workflow_path)}, 1)

    if args.cmd == "pull":
        _emit(cmd_pull(workflow_path, create_missing=args.create_missing))
    if args.cmd == "check":
        result = cmd_check(workflow_path)
        _emit(result, 1 if result["drift_count"] > 0 else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
