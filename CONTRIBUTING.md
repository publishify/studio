# Contributing to Publishify

Thank you for helping writers. Publishify is a small project with a few firm principles, and this page explains how to work with them.

## Principles

1. **The author's text is sacred.** No change may silently overwrite, reformat or "fix" a writer's words. When two versions conflict, keep both.
2. **Plain files.** Chapters are plain Markdown. Do not introduce formats that lock writers in.
3. **Fast and calm.** The editor must stay responsive on a 200,000-word book. The initial JavaScript budget is about 100 KB gzip.
4. **Every script.** Test right-to-left (Arabic, Ottoman Turkish) as well as left-to-right. Use CSS logical properties (`margin-inline-start`, not `margin-left`).
5. **Only true claims.** Docs and the website describe what the code does today. Anything still to come is labelled as planned.

## Ways to help

- **Translations.** The interface strings live in `apps/web/src/i18n*.ts`. Native-speaker reviews of the existing Arabic, Ottoman Turkish and Japanese strings are especially valuable.
- **Writing in English.** Code comments, commit messages, tests and documentation are in English.
- **Tests.** The sync and conflict logic in `workers/api` would benefit most.
- **Bugs.** Open an issue with steps to reproduce, your browser and your OS. Never paste your unpublished manuscript into an issue; a short sample is enough.

## Development setup

```bash
corepack enable
pnpm install
pnpm dev        # Studio at http://localhost:5173/studio/
pnpm test       # unit tests
pnpm build      # type-check and build
```

See the [README](README.md#getting-started) for running the full stack with the Worker locally.

## Pull requests

- Keep each PR focused on one change. Explain *why* the change is needed, not only *what* it does.
- Run `pnpm build` and `pnpm test` before you push. Both must pass.
- TypeScript is strict. Avoid `any` and avoid non-null assertions unless you can explain them.
- Add or update tests for any behaviour you change.
- For UI changes, include before and after screenshots in light, dark and right-to-left.
- Significant design decisions are recorded as short Architecture Decision Records. If your change makes one, describe it in the PR and we will add it.

## Code of conduct

Be kind, be patient, and assume good faith. Harassment, discrimination or personal attacks are not tolerated in issues, pull requests or any other project space. Maintainers may remove content and block participants who break these expectations.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
