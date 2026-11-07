# Security Policy

Writers trust Publishify with unpublished work, so we take security seriously.

## Reporting a vulnerability
Please **do not open a public issue** for security problems. Email **info@publishify.app** with:
- a description of the issue and its impact,
- steps to reproduce,
- any proof-of-concept you can share.

We aim to acknowledge reports within a few days and will keep you informed while we fix the issue. Please give us reasonable time to release a fix before any public disclosure.

## Scope
In scope: the editor (`apps/web`), the API (`workers/api`), published pages (`/k/<address>`) and the marketing site.
Of particular interest: text loss in sync or conflict handling, cross-account access to books, script injection in published pages, and handling of Google Drive tokens.

## Design notes
- Session tokens and recovery codes are stored only as hashes.
- Author Markdown is rendered with raw HTML escaped, filtered links, no scripts, and a strict Content-Security-Policy on published pages.
- Every book is isolated in its own Durable Object, keyed by user and book.
