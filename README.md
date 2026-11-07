<div align="center">

<img src="docs/marka/logo/publishify-yesil.svg" alt="Publishify" height="56">

# Publishify Studio

**A calm, open-source writing studio for writers of all kinds.**
Novelists, short-story writers, poets, essayists, bloggers, students and academics write, organize, keep and publish their work in one quiet place. It runs in the browser, works offline-first, and your files stay yours.

[Try it](https://publishify.app/studio/) · [Website](https://publishify.app) · [Features](https://publishify.app/ozellikler/) · [License: MIT](LICENSE)

</div>

---

## Why Publishify Studio

Most writing tools make you choose: a minimal editor that cannot hold a book, or a heavy project manager that gets in the way of the words. Publishify Studio aims for the middle: **the calm of a plain-text editor with the structure of a book-length tool**, on every device with a browser, with no lock-in.

- **Your files are yours.** Text is plain Markdown. Keep it on your device, or sync it as one `.md` file per chapter into **your own Google Drive**. Nothing is shared with anyone without your say-so.
- **Write first.** Live Markdown, a full-screen writing mode that hides everything except the page, and focus + typewriter modes that dim every paragraph except the one you are writing.
- **Built for long form.** Part › chapter › scene structure, drag-and-drop ordering, version history and a trash bin that never deletes silently.
- **Every language, both directions.** Interface and writing in Arabic, Ottoman Turkish, Turkish, English, German, French, Russian and Japanese (plus Kurmanji and Zazaki for writing), with proper right-to-left support.
- **Publish in one click.** A fast, secure, search-ready public page for any piece or whole book.

## Features

### Write
- **Live Markdown** (CodeMirror 6): marks fade away when the cursor leaves the line, so what you see is what you wrote — bold, italic, headings, quotes, lists, checklists.
- **Writing mode:** press full screen and every menu, panel and toolbar disappears. Only the page remains; the paragraph you are writing stays sharp while the rest fades, and the cursor stays centred. Press `Esc` to leave.
- **Focus and typewriter modes**, daily word goal, reading time, word counts.
- **Dictation** (browser speech recognition) with spoken punctuation, in the writing language of the book.
- **Seven themes:** light, dark, sepia, green, pink, night and a custom theme where you choose the background and text colours.

### Organize
- **Part › chapter › scene** levels for novels, novellas and stories; other genres start flat.
- **Drag and drop**, convert chapter ⇄ scene, search across the book.
- **Templates for every kind of writing:** novel (three acts, hero's journey), novella, short story, flash fiction, poetry, essay, blog post, memoir, non-fiction guide, academic article, thesis, picture book, play.
- **Version history** taken as you write, restorable at any time. **Trash** for books, chapters and scenes — nothing is gone until you empty it.
- **Cover image** and **narration audio** per chapter.

### Keep
- **Local first.** Everything is saved to your device (IndexedDB) about 0.4 seconds after you type. No account needed to start.
- **Google Drive sync (early access):** one Markdown file per chapter, a `kitap.json`, conflict copies instead of lost text, deleted items go to Drive's trash. Uses the narrow `drive.file` scope.
- **Passkey accounts and cross-device sync** with per-chapter revisions; on conflict, both versions are kept.

### Publish and export
- **Publish** books and single pieces (blog posts, essays, stories, flash fiction, poems, articles) to `publishify.app/k/<address>` with sharing links, reading time and schema.org metadata. Author Markdown is rendered safely: raw HTML is escaped, links are filtered, pages run no scripts and ship a strict Content-Security-Policy.
- **Export** to Markdown, HTML, Word (`.docx`), EPUB (with cover) and PDF. Right-to-left direction is preserved in every format.

### Languages
Interface and writing: **Arabic, Ottoman Turkish (Arabic script), Turkish, English, German, French, Russian, Japanese.** Writing only: **Kurmanji (Latin), Zazaki.** The editor, exports and published pages pick the right direction, spell-check language and fonts automatically.

## Quick start

Requirements: a recent **Node.js** and **pnpm**.

```bash
git clone https://github.com/publishify/studio.git
cd studio
pnpm install

pnpm dev        # editor at http://localhost:5173/studio/
pnpm dev:api    # API + sync + publishing (Cloudflare Workers, local)
pnpm test       # unit tests for the editor and the API
pnpm build      # builds the editor and the marketing site
```

The editor works on its own; the API is only needed for accounts, sync and publishing.

### Deploying your own copy
Publishify runs on a single [Cloudflare Worker](https://developers.cloudflare.com/workers/) with D1, Durable Objects and static assets. To host your own:

1. Create a D1 database and replace the `database_id` and `routes` in [`workers/api/wrangler.jsonc`](workers/api/wrangler.jsonc).
2. Apply the migrations in [`workers/api/migrations`](workers/api/migrations).
3. Create your own Google OAuth client (scope `drive.file`) and set it in `apps/web/src/drive.ts` if you want Drive sync.
4. `pnpm deploy`.

## Project layout

```
apps/web/        The editor (React + TypeScript + Vite + CodeMirror 6)
apps/site/       The marketing site (static HTML generator, no client JavaScript)
workers/api/     Hono API on Cloudflare Workers: auth, sync, publishing
docs/adr/        Architecture decision records
```

**Stack:** React 19 · TypeScript (strict) · Vite · Tailwind CSS 4 · CodeMirror 6 · Zustand · Hono · Cloudflare Workers, D1, Durable Objects · SimpleWebAuthn · Valibot · Vitest.

## Principles

1. **The author writes.** Tools support the writer; they never take the pen. The editor never rewrites your text.
2. **Plain files, no lock-in.** Markdown in, Markdown out.
3. **Calm by default.** Few, well-chosen tools instead of a wall of menus.
4. **Every language is first-class**, including right-to-left.
5. **Open core.** The editor, sync protocol and publishing are open source (see [ADR-0006](docs/adr/0006-acik-cekirdek.md)).

## Roadmap

- **Editorial board** — a hosted, AI-assisted board of specialist editors (fiction, literary, academic, poetry, children's) plus a reader panel and consistency checkers that read your book and give feedback. It will never rewrite your text. Part of it will be free, deeper evaluations paid.
- Desktop and mobile apps (Tauri 2), offline install (PWA), iCloud, import from `.docx`/`.md`/Scrivener, more genre structures.

See the [architecture decisions](docs/adr/) for the reasoning behind the current design.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. For security issues, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 Publishify. "Publishify" is a trademark pending registration; the MIT license covers the code, not the name or logo.
