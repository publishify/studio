# ADR-0001: Editor core: CodeMirror 6

- **Status:** accepted
- **Date:** 2026-11-06

## Context
Text must always stay plain Markdown; the editor must stay smooth on 200,000-word books; editorial-board notes must be markable without touching the text; and mobile, the Turkish keyboard and spell-check must work.

## Decision
CodeMirror 6 with the Markdown language and an Obsidian-style live preview (marks away from the cursor are hidden).

## Options considered
- ProseMirror/TipTap — the most mature WYSIWYG; risk of loss in Markdown round trips (see OpenWriter's `browser-write-fidelity` ADR).
- Lexical — small and fast; Markdown conversion is lossy as well.
- Milkdown — Markdown-first WYSIWYG; small community.
- Monaco — a code editor: heavy and weak on mobile.

## Consequences
No conversion loss; notes are drawn as decorations. Rich elements such as tables and images need extra work.
