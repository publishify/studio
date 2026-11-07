# ADR-0008: Editor first, as Cloudflare Workers static assets

- **Status:** accepted
- **Date:** 2026-11-06

## Context
CLAUDE.md said "validation prototype (the board) first". The founder changed the priority: the writing editor goes live on Cloudflare first; board validation continues in parallel from the command line.

## Decision
`apps/web` (React + Vite 8 + CodeMirror 6 + Tailwind 4) is deployed as Cloudflare Workers static assets (`wrangler.jsonc`, SPA routing). Phase 1 scope: local saving (IndexedDB), chapter list, hiding marks, focus/typewriter mode, light/dark theme. Server, sync and the board are later phases.

## Consequences
No server cost; the text lives only in the browser. The editor is in a separate chunk via `React.lazy`: initial JS ≈ 70 KB gzip (budget ≤ 100), editor chunk ≈ 173 KB (target ~150, to be watched).
