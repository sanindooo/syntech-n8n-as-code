"""Unit tests for sync_prompts.py.

Run:
    python3 -m unittest execution/test_sync_prompts.py

These tests don't import pytest so they work with the stdlib only.
"""

from __future__ import annotations

import unittest
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).parent))

from sync_prompts import (  # noqa: E402
    FRONTMATTER_KEYS,
    assemble_md_body,
    escape_for_template_literal,
    extract_template_literal,
    find_matching_brace,
    parse_frontmatter,
    parse_workflow,
    render_frontmatter,
    slugify,
    split_md_body,
    workflow_slug,
)


class FindMatchingBraceTests(unittest.TestCase):
    def test_simple(self):
        self.assertEqual(find_matching_brace("{}", 0), 1)

    def test_nested(self):
        self.assertEqual(find_matching_brace("{a:{b:{}}}", 0), 9)

    def test_quoted_brace_ignored(self):
        self.assertEqual(find_matching_brace("{'}'}", 0), 4)

    def test_template_literal_brace_ignored(self):
        # `}` inside backtick template must not decrement depth
        self.assertEqual(find_matching_brace("{`}`}", 0), 4)

    def test_template_literal_with_expression(self):
        # `${...}` inside a template literal: inner braces should be balanced
        s = "{`hello ${world}`}"
        self.assertEqual(find_matching_brace(s, 0), len(s) - 1)

    def test_line_comment_ignored(self):
        self.assertEqual(find_matching_brace("{ // }\n}", 0), 7)

    def test_block_comment_ignored(self):
        self.assertEqual(find_matching_brace("{ /* } */ }", 0), 10)

    def test_no_match_returns_minus_one(self):
        self.assertEqual(find_matching_brace("{abc", 0), -1)

    def test_rejects_non_brace_start(self):
        self.assertEqual(find_matching_brace("abc", 0), -1)


class TemplateLiteralTests(unittest.TestCase):
    def test_extract_basic(self):
        text = "obj = { text: `hello`, };"
        got = extract_template_literal(text, "text")
        self.assertIsNotNone(got)
        content, _, _ = got
        self.assertEqual(content, "hello")

    def test_strips_leading_equals(self):
        text = "obj = { text: `=n8n expression`, };"
        content, _, _ = extract_template_literal(text, "text")
        self.assertEqual(content, "n8n expression")

    def test_unescapes_backtick(self):
        text = r"obj = { text: `code: \`x\``, };"
        content, _, _ = extract_template_literal(text, "text")
        self.assertEqual(content, "code: `x`")

    def test_unescapes_dollar_brace(self):
        text = r"obj = { text: `price \${x}`, };"
        content, _, _ = extract_template_literal(text, "text")
        self.assertEqual(content, "price ${x}")

    def test_missing_key_returns_none(self):
        self.assertIsNone(extract_template_literal("obj = {};", "text"))

    def test_escape_round_trip(self):
        original = "```\ncode with `backticks` and ${expr}\n```"
        escaped = escape_for_template_literal(original)
        # Simulate embedding + re-extracting
        fake = f"obj = {{ text: `{escaped}`, }};"
        extracted, _, _ = extract_template_literal(fake, "text")
        self.assertEqual(extracted, original)


class FrontmatterTests(unittest.TestCase):
    def test_round_trip_plain(self):
        fm_in = {
            "workflow_id": "abc",
            "workflow_path": "path/to/file.ts",
            "node_id": "uuid-1",
            "node_name": "Regular Name",
            "node_property": "MyProp",
            "last_synced": "2026-04-13",
        }
        rendered = render_frontmatter(fm_in)
        self.assertTrue(rendered.startswith("---\n"))
        fm_out, body = parse_frontmatter(rendered)
        self.assertEqual(fm_out, fm_in)
        self.assertEqual(body, "")

    def test_unicode_and_colon_quoted(self):
        fm_in = {
            "node_name": "⛽️ STAGE - 1: Filter",
            "workflow_path": "x.ts",
            "node_id": "u1",
            "node_property": "P",
            "last_synced": "2026-04-13",
            "workflow_id": "",
        }
        rendered = render_frontmatter(fm_in)
        # Values with colons or unicode should be double-quoted
        self.assertIn('node_name: "⛽️ STAGE - 1: Filter"', rendered)
        fm_out, _ = parse_frontmatter(rendered)
        self.assertEqual(fm_out["node_name"], fm_in["node_name"])

    def test_missing_frontmatter(self):
        fm, body = parse_frontmatter("no frontmatter here")
        self.assertEqual(fm, {})
        self.assertEqual(body, "no frontmatter here")

    def test_stable_key_order(self):
        # render_frontmatter emits keys in a fixed order regardless of input order
        reversed_order = {k: "v" for k in reversed(FRONTMATTER_KEYS)}
        rendered = render_frontmatter(reversed_order)
        lines = [l for l in rendered.splitlines() if ":" in l]
        keys_in_output = [l.split(":", 1)[0] for l in lines]
        self.assertEqual(keys_in_output, list(FRONTMATTER_KEYS))


class SplitMdBodyTests(unittest.TestCase):
    def test_with_user_message(self):
        body = """System content here.

---

## USER MESSAGE

```
User template
```
"""
        sys_part, user_part = split_md_body(body)
        self.assertEqual(sys_part, "System content here.")
        self.assertEqual(user_part, "User template")

    def test_without_user_message(self):
        sys_part, user_part = split_md_body("Just system content.")
        self.assertEqual(sys_part, "Just system content.")
        self.assertIsNone(user_part)

    def test_round_trip_via_assemble(self):
        sys_in = "# Title\n\nSome system instructions"
        user_in = "ARTICLE: {{ $json.title }}"
        body = assemble_md_body(sys_in, user_in)
        sys_out, user_out = split_md_body(body)
        self.assertEqual(sys_out, sys_in)
        self.assertEqual(user_out, user_in)


class SlugTests(unittest.TestCase):
    def test_slugify_default_underscore(self):
        self.assertEqual(slugify("Stage 4A"), "stage_4a")

    def test_slugify_strips_emoji(self):
        self.assertEqual(slugify("⛽️ Stage 1"), "stage_1")

    def test_workflow_slug_hyphenated(self):
        self.assertEqual(workflow_slug(Path("My New Workflow.workflow.ts")), "my-new-workflow")

    def test_workflow_slug_strips_version_suffix(self):
        self.assertEqual(
            workflow_slug(Path("News Sourcing Production (V2).workflow.ts")),
            "news-sourcing-production",
        )
        self.assertEqual(workflow_slug(Path("Foo_v3.workflow.ts")), "foo")
        self.assertEqual(workflow_slug(Path("Foo-V10.workflow.ts")), "foo")


class ParseWorkflowSentinelTests(unittest.TestCase):
    """Smoke test: parser reports the same count the source declares."""

    def test_real_workflow_parses_fully(self):
        project_root = Path(__file__).resolve().parents[1]
        workflow = (
            project_root
            / "workflows"
            / "syntech_biofuels_granite_automations_app_stephen_a"
            / "personal"
            / "News Sourcing Production (V2).workflow.ts"
        )
        if not workflow.exists():
            self.skipTest("Reference workflow not present")
        text = workflow.read_text(encoding="utf-8")
        # Should not raise ParseMismatchError
        nodes = parse_workflow(text)
        # At least the 5 Stage chainLlm nodes we know about
        stage_ids = {
            "cd2c63a0-3409-4916-bb32-4035814b22b3",
            "204327f7-0381-48cf-b4d5-64bb70c0cf50",
            "b16581b0-9b74-4401-8db0-9ca3a3c88e7b",
            "7a8e8544-04cc-40cf-8f76-39f5895e325c",
            "e8a4c711-1d3f-4e72-b7a1-9c2b5e18a4d2",
        }
        found = {n.node_id for n in nodes}
        self.assertTrue(stage_ids.issubset(found))


if __name__ == "__main__":
    unittest.main()
