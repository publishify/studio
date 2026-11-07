# ADR-0003: Server in TypeScript on Cloudflare Workers (Hono)

- **Status:** accepted
- **Date:** 2026-11-06

## Decision
API: a TypeScript Worker on Hono. Book data: one SQLite-backed Durable Object per book. Accounts: D1. Files: R2. AI: AI Gateway.

## Options considered
- Python Workers — about 1 s cold start even with a snapshot.
- Rust Workers — WASM bundle weight; no speed gain for an I/O-bound API.

## Consequences
Native to V8, the smallest bundle, first-class access to every Cloudflare binding. The founder already knows Hono + D1 from writercms.
