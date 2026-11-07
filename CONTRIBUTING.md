# Contributing to Publishify Studio

Thanks for helping writers write. A few ground rules keep the project calm and focused.

## Before you start
- Open an issue to discuss larger changes before writing code.
- Keep the editor **calm**: new features should earn their place. We prefer a few good tools to many options.
- The editor must **never rewrite a writer's text** and must keep working with plain Markdown files.

## Setup
```bash
pnpm install
pnpm dev        # editor at http://localhost:5173/studio/
pnpm dev:api    # API (Cloudflare Workers, local)
pnpm test
```
A recent Node.js and pnpm are required.

## Pull requests
- Run `pnpm test` and a type check (`pnpm exec tsc --noEmit` inside the package you changed) before opening a PR.
- Add tests for logic changes, especially sync, conflicts, export and publishing: they protect writers' text.
- Right-to-left languages are first-class. If you touch layout, use CSS logical properties (`inline-start`, `margin-inline`, …) and check an Arabic book.
- User-facing strings live in `apps/web/src/i18n*.ts`. Missing translations fall back to English.
- Significant technical decisions are recorded as short ADRs in `docs/adr/`.

## Translations
Interface translations (Arabic, Ottoman Turkish, German, French, Russian, Japanese) were drafted without native review. Corrections from native speakers are especially welcome.

## Code of conduct
Be kind and respectful. Harassment of any kind is not tolerated.

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
