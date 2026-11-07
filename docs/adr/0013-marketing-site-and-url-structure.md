# ADR-0013: Marketing site at the root, the editor under `/studio/`; SEO and GEO approach

- **Status:** accepted (7 November 2026)

## Context
`publishify.app` opened the editor directly. The product had no marketing site; content, identity and structured data were missing for search engines and AI assistants. Competitors (Ulysses, Scrivener, iA Writer, Sudowrite…) put marketing on the root address and the app on another path or subdomain.

## Decision
- **URL structure:** `/` Turkish marketing, `/en/` English; inner pages `/ozellikler/`, `/diller/`, `/yayinla/`, `/karsilastirma/`, `/sss/` and `/en/features/`, `/en/languages/`, `/en/publishing/`, `/en/compare/`, `/en/faq/`. The editor lives under **`/studio/`** (Vite `base: "/studio/"`, output `dist/studio`). Published writings stay at `/k/<address>` (Worker).
- **Why a path, not a subdomain:** the same origin is kept; local data (IndexedDB), passkeys (`rpID: publishify.app`), Google OAuth allowed origins and the session cookie keep working unchanged. A subdomain would have needed extra DNS and OAuth/passkey configuration.
- **A static, script-free site:** `apps/site` generates plain HTML from content (`pnpm --filter @publishify/site build`), one inline stylesheet, no external requests, no JavaScript, system fonts. Files are written to the root of `apps/web/dist/` and served as Cloudflare Workers static assets (`not_found_handling: 404-page`). The `/studio` → `/studio/` redirect comes from the asset handler.
- **Only verifiable claims:** the feature list comes from the code; the comparison table (Ulysses: Mac/iPad/iPhone, subscription; Scrivener: Mac/Windows/iOS, one-time) was checked against sources and dated. Things that are not ready (the "board", mobile/desktop apps, offline, opening the Drive connection to everyone) are labelled clearly as "on the way/early access".
- **SEO:** a unique title/description per page (length-checked), canonical, hreflang (tr, en, x-default), Open Graph + Twitter card (a 1200×630 image), `sitemap.xml` (with hreflang), `robots.txt`, breadcrumbs and JSON-LD (Organization, WebSite, SoftwareApplication, WebPage, FAQPage, BreadcrumbList), a single h1, alt/width/height on images, a preloaded LCP image, a broken-link check (`apps/site/src/check.mjs`, run on every build).
- **GEO (AI visibility):** a "Publishify in brief" short-answer block, an FAQ in question-and-answer form, consistent naming, `llms.txt` and `llms-full.txt` (from the same data), explicit allowance for AI crawlers in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), the editor and API `Disallow`.
- **Security/performance:** a strict CSP via `<meta>` on pages (no scripts), nosniff via `_headers`, Referrer-Policy, Permissions-Policy (microphone only for our own origin), HSTS; images get `immutable` caching, and screenshots are 800/1600 px `srcset`.
- **Screenshots from the real app:** `?demo=` (development only, `apps/web/src/dev/demo.ts`) loads a sample book; shots are taken with headless Chrome. The sample text is original; the founder's own text is never used.

## Open work
Google Search Console and Bing Webmaster verification + sitemap submission (needs the founder's account); privacy policy and terms pages (also required for Google OAuth verification); Organization `sameAs` once social accounts exist; blog/guide content; a payment/pricing page on the marketing site (once the product is charged for); real user reviews (made-up reviews are never added).
