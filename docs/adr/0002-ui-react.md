# ADR-0002: UI: React + TypeScript + Vite

- **Status:** accepted
- **Date:** 2026-11-06

## Context
Solo, AI-assisted development; the team may grow later.

## Decision
React + TypeScript (strict) + Vite + Tailwind CSS.

## Options considered
- Svelte 5 — smaller bundle, smaller ecosystem; fewer examples for AI-generated code.
- Next.js — the editor is an offline-capable app that runs in the browser; server-side rendering gives no benefit here. It will be used separately for sites (marketing, CMS) (vinext).

## Consequences
A widespread ecosystem and easy hiring; a somewhat larger bundle than Svelte.
