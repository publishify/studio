# ADR-0009: Accounts (passkey + recovery code) and chapter-level sync

- **Status:** accepted
- **Date:** 2026-11-06

## Context
The editor used to run only in the browser. Access across devices and backup need an account and a server (ARCHITECTURE §3–4). The text belongs to the author: sync must never silently overwrite any text.

## Decision
- **One Worker:** `workers/api` (Hono) serves both `/api/*` and the static editor (`run_worker_first: ["/api/*"]`); same origin, no CORS, cookie `SameSite=Lax`.
- **Sign-in:** passkey (WebAuthn, `@simplewebauthn`, discoverable credential, no username). Email links are postponed; to recover an account there is a 100-bit **recovery code** shown once at registration (only its SHA-256 is kept in D1; a new one is generated when it is used). Session: a random 256-bit token, only its digest in D1, 30 days, HttpOnly cookie.
- **Data:** D1 (users, credentials, sessions, book list) + one Durable Object per book (SQLite, name = `<user>:<book>`; reaching another user's object is structurally impossible).
- **Sync:** the unit is the chapter. Every chapter has a server sequence number (`seq`); the client sends `baseSeq`. If they differ it is a **conflict**: the server version stays and the client's text becomes a new "conflicted copy" chapter. Deletes are tombstones. Order and metadata: last writer wins.
- **Local first:** the client works without an account; changes live in IndexedDB and sync in the background when online (2.5 s debounce, on focus/online/every 60 s).

## Options considered
- Email links (Cloudflare Email Service) — domain verification and deliverability work; we started with passkey + recovery code and will add it later.
- CRDT (Yjs/Loro) — ADR-0005: postponed; revisions are enough for a single author.

## Consequences
Text is stored on the server as plain text (encryption at rest is handled on the Cloudflare side for R2/DO). Rate limiting did not exist yet (recovery-code attempts needed it). Conflicted copies are shown to the user with a badge.

## Rate limiting (7 November 2026)
- `workers/api/migrations/0002_rate_limits.sql` + a `rateLimit` middleware (D1, fixed window, per IP): recovery code **5 attempts / 15 min**, account creation **10 / hour**, sign-in options **40 / 15 min**. Exceeding returns `429 {"error":"rate"}`. Tried locally (the 6th wrong recovery attempt returns 429).
- Before deploying, apply the migration to the remote database: `cd workers/api && pnpm exec wrangler d1 migrations apply publishify --remote`.
