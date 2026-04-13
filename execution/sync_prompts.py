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

# Cursor patterns: anchors for the brace-depth walker below.
NODE_DECORATOR_RE = re.compile(r"@node\(\s*\{")
PROPERTY_ASSIGN_RE = re.compile(r"([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{")

# Inside a decorator block: id, name, type
ID_RE = re.compile(r"id:\s*'([^']+)'")
NAME_RE = re.compile(r"name:\s*'((?:[^'\\]|\\.)*)'")
TYPE_RE = re.compile(r"type:\s*'([^']+)'")


def find_matching_brace(text: str, open_idx: int) -> int:
    """Given text[open_idx] == '{', return the index of the matching '}'.

    Tracks brace depth while skipping over single- and double-quoted strings,
    template literals (including ${...} expression holes), line comments
    (//), and block comments (/* */). Returns -1 if no match.
    """
    if open_idx >= len(text) or text[open_idx] != "{":
        return -1
    depth = 0
    i = open_idx
    n = len(text)
    while i < n:
        c = text[i]
        if c == "{":
            depth += 1
            i += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
            i += 1
        elif c in ("'", '"'):
            quote = c
            i += 1
            while i < n:
                if text[i] == "\\":
                    i += 2
                    continue
                if text[i] == quote:
                    i += 1
                    break
                i += 1
        elif c == "`":
            i += 1
            while i < n:
                if text[i] == "\\":
                    i += 2
                    continue
                if text[i] == "`":
                    i += 1
                    break
                # ${...} — recurse on nested braces
                if text[i] == "$" and i + 1 < n and text[i + 1] == "{":
                    end = find_matching_brace(text, i + 1)
                    if end < 0:
                        return -1
                    i = end + 1
                    continue
                i += 1
        elif c == "/" and i + 1 < n and text[i + 1] == "/":
            while i < n and text[i] != "\n":
                i += 1
        elif c == "/" and i + 1 < n and text[i + 1] == "*":
            i += 2
            while i + 1 < n:
                if text[i] == "*" and text[i + 1] == "/":
                    i += 2
                    break
                i += 1
        else:
            i += 1
    return -1

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


FRONTMATTER_KEYS = (
    "workflow_id",
    "workflow_path",
    "node_id",
    "node_name",
    "node_property",
    "last_synced",
)


def render_frontmatter(fm: dict) -> str:
    """Render frontmatter dict back into YAML-ish header with stable ordering."""
    lines = ["---"]
    for key in FRONTMATTER_KEYS:
        if key not in fm:
            continue
        value = fm[key]
        # Quote values containing colons or unicode (emoji)
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


def slugify(name: str, sep: str = "_") -> str:
    """Lowercase, strip emojis/punctuation, collapse to sep."""
    s = EMOJI_RE.sub("", name)
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", sep, s)
    s = s.strip(sep)
    return s or "node"


VERSION_SUFFIX_RE = re.compile(r"[\s_-]*[\(\[]?\s*v\d+\s*[\)\]]?\s*$", re.IGNORECASE)


def workflow_slug(workflow_path: Path) -> str:
    """Derive a hyphenated slug for the prompts subfolder.

    Strips the `.workflow` suffix and any trailing version marker such as
    ` (V2)`, `_v3`, `-v10` so the slug matches what humans would pick
    (e.g. `News Sourcing Production (V2).workflow.ts` → `news-sourcing-production`).
    """
    stem = workflow_path.stem
    if stem.endswith(".workflow"):
        stem = stem[: -len(".workflow")]
    stem = VERSION_SUFFIX_RE.sub("", stem)
    return slugify(stem, sep="-")


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
    """Find every @node declaration + following property assignment and
    extract system/user messages for Basic LLM Chain nodes.

    Uses brace-depth walking (find_matching_brace) rather than regex to
    handle empty bodies (`= {};`), bodies containing `};` inside template
    literals, and all other valid TypeScript shapes we've seen in practice.

    Sentinel: asserts extracted decorator count matches the number of
    @node( occurrences in the source. Mismatch raises ParseMismatchError.
    """
    declared = workflow_text.count("@node(")
    nodes: list[WorkflowNode] = []
    extracted = 0
    cursor = 0
    while True:
        m = NODE_DECORATOR_RE.search(workflow_text, cursor)
        if not m:
            break
        dec_open = m.end() - 1  # position of '{' in `@node({`
        dec_close = find_matching_brace(workflow_text, dec_open)
        if dec_close < 0:
            break
        decorator = workflow_text[dec_open + 1 : dec_close]
        extracted += 1

        # The property assignment should immediately follow `}) `
        # Seek past the `)` and any whitespace to find `<Name> = {`
        after_paren = workflow_text.find(")", dec_close) + 1
        prop_match = PROPERTY_ASSIGN_RE.match(workflow_text, after_paren + skip_ws(workflow_text, after_paren))
        if not prop_match:
            cursor = dec_close + 1
            continue
        body_open = prop_match.end() - 1  # position of '{'
        body_close = find_matching_brace(workflow_text, body_open)
        if body_close < 0:
            cursor = dec_close + 1
            continue
        body = workflow_text[body_open + 1 : body_close]
        prop_name = prop_match.group(1)
        cursor = body_close + 1

        type_match = TYPE_RE.search(decorator)
        if not type_match or type_match.group(1) != CHAIN_LLM_TYPE:
            continue
        id_match = ID_RE.search(decorator)
        name_match = NAME_RE.search(decorator)
        if not id_match or not name_match:
            continue
        text_extract = extract_template_literal(body, "text")
        message_extract = extract_template_literal(body, "message")
        nodes.append(
            WorkflowNode(
                node_id=id_match.group(1),
                node_name=name_match.group(1),
                node_property=prop_name,
                system_message=message_extract[0] if message_extract else None,
                user_message=text_extract[0] if text_extract else None,
                body_start=body_open + 1,
                body_end=body_close,
            )
        )

    if extracted != declared:
        raise ParseMismatchError(declared=declared, extracted=extracted)
    return nodes


def skip_ws(text: str, start: int) -> int:
    """Return the count of whitespace characters starting at `start`."""
    i = start
    while i < len(text) and text[i] in " \t\r\n":
        i += 1
    return i - start


class ParseMismatchError(Exception):
    """Raised when NODE_BLOCK_RE extracted a different count than exists in
    the source. Indicates a regex misparse — the caller should report this
    with error_code=parse_mismatch so humans notice."""

    def __init__(self, declared: int, extracted: int) -> None:
        self.declared = declared
        self.extracted = extracted
        super().__init__(
            f"parse_workflow extracted {extracted} nodes but source declares "
            f"{declared} @node(...) blocks — NODE_BLOCK_RE likely misparsed."
        )


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
        # last_synced should reflect when the prompt content last changed,
        # not when the script was last run. Reuse the existing timestamp if
        # the content is unchanged; only advance it when we write.
        existing_fm: dict = {}
        if target.exists():
            existing_fm, _ = parse_frontmatter(target.read_text(encoding="utf-8"))
        body = assemble_md_body(node.system_message or "", node.user_message)
        base_fm = {
            "workflow_id": workflow_id or "",
            "workflow_path": rel_workflow,
            "node_id": node.node_id,
            "node_name": node.node_name,
            "node_property": node.node_property,
        }
        # Build candidate with the existing timestamp (if any) to compare content
        candidate_fm = {**base_fm, "last_synced": existing_fm.get("last_synced", today)}
        candidate_text = render_frontmatter(candidate_fm) + "\n" + body
        was_new = not target.exists()
        unchanged = (not was_new) and target.read_text(encoding="utf-8") == candidate_text
        if unchanged:
            new_text = candidate_text
        else:
            # Content changed (or new file) — stamp with today's date
            new_text = render_frontmatter({**base_fm, "last_synced": today}) + "\n" + body
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
        md_system, md_user = split_md_body(body)
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

    try:
        if args.cmd == "pull":
            _emit(cmd_pull(workflow_path, create_missing=args.create_missing))
        if args.cmd == "check":
            result = cmd_check(workflow_path)
            _emit(result, 1 if result["drift_count"] > 0 else 0)
    except ParseMismatchError as e:
        _emit(
            {
                "status": "error",
                "error_code": "parse_mismatch",
                "message": str(e),
                "declared": e.declared,
                "extracted": e.extracted,
            },
            1,
        )


if __name__ == "__main__":
    main(sys.argv[1:])
