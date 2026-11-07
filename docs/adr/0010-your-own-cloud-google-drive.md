# ADR-0010: Your own cloud — Google Drive (later iCloud) as a shared book format

- **Status:** accepted; Google Drive implemented on the web (7 November 2026), iCloud and desktop/mobile later
- **Date:** 2026-11-07

## Context
The author wants to keep their book in their own Google Drive / iCloud account and reach the same book from everywhere (web, desktop, mobile). That is a promise of trust for the author ("your book is not on our server") and zero storage cost for us. Sync currently lives on the server (ADR-0009).

## Decision
1. **Storage provider interface:** the editor works through a storage interface. Implementations: `Local` (IndexedDB, exists), `PublishifyCloud` (ADR-0009, exists), `GoogleDrive` (the first new one), `iCloud` (later).
2. **Shared book format (the contract every app follows):** a `Publishify/<Book title>/` folder on Drive.
   - Each chapter is a plain Markdown file: `NN-chapter-title.md` (optional YAML front matter for front matter/credits: `id`, `type`, `part`).
   - `kitap.json`: metadata, order, parts, chapter ids, format version.
   - The author can also open and read the files from Drive themselves; the format version preserves forward compatibility.
3. **Permission scope:** only `drive.file` (files created by the app). Access to the whole Drive is never requested.
4. **Sign-in:** in addition to passkeys, "Sign in with Google" and "Sign in with Apple" (identity). Storage permission is granted separately and deliberately.
5. **Sync:** conflict detection on the client using Drive's file revision information (`headRevisionId`, `md5Checksum`); the rule is the same as ADR-0009: no text is silently overwritten, and conflicting text is kept as a "conflicted copy".
6. **iCloud:** no file access on the web. In the Mac/iPhone app (Tauri), an iCloud Drive folder with the same format. CloudKit JS for the web is a separate decision (its own ADR later).
7. **Editorial board:** for a report, the text goes to the Publishify server during analysis; it is not stored permanently (details in a separate ADR).

## Options considered
- Full Drive access (`drive`) — needlessly broad, and heavy Google review.
- `appdata` hidden folder — the author cannot see the files, which breaks the "my own files, everywhere" promise.
- A single binary/JSON book file — hard to merge and hard to read by hand; per-chapter files match ADR-0005.
