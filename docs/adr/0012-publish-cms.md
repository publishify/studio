# ADR-0012: Publish (CMS) — books and single pieces become public pages

- **Status:** accepted (first slice implemented, 7 November 2026)
- **Inspiration:** the founder's writercms project (Hono + D1, server-rendered HTML, SEO/GEO, author identity). The same view: the author writes, a publication is a copy, and pages are fast, safe and readable by search engines and AI.

## Decision
- **Unit of publication:** every project (book) in Publishify can be published. Single-piece writings (blog post, essay, story, flash fiction, poem, non-fiction, academic article) are one-chapter projects; **a single-chapter publication opens as an article directly at `/k/<address>`**, and a multi-chapter publication becomes a table of contents page plus `/k/<address>/<n>` chapter pages.
- **A publication is a copy:** the draft text stays in the Durable Object; "Publish/Update" writes a copy to D1 (`published_books`, `published_chapters`). "Unpublish" deletes the copy. Draft and publication are independent.
- **Kind (`kind`):** book, novel, novella, story, flash fiction, poem, essay, blog, article, non-fiction, memoir, play. It maps to a schema.org type (Book, Article, BlogPosting, ScholarlyArticle, CreativeWork).
- **Language and direction:** the publication language (Turkic languages, Middle Eastern languages, English) is reflected on the page as `lang` and `dir`; suitable typefaces for Arabic/Hebrew-script languages.
- **Sharing:** script-free links on the page (WhatsApp, X, Facebook, email); in the author panel the system share sheet (Web Share) and copy-link.
- **Security (the author's text is published on our domain):** Markdown is processed on the server; raw HTML is converted to text, only http/https/mailto links and only https images remain, links get `nofollow ugc noopener`; a strict CSP per page (`default-src 'none'`, no scripts), `nosniff`; the publish API requires a session, checks the origin against CSRF, and is limited to 60 publications per hour; the address (slug) is unique and validated.
- **Address:** for now `publishify.app/k/<address>`. A domain owned by the author (e.g. the-author-site.com) is a later slice and needs Cloudflare for SaaS (custom hostnames).

## Next slices
Author page (`/@name`, all publications), RSS and `sitemap.xml`/`robots.txt`/`llms.txt`, a cover image (needs R2), reader statistics (cookie-free), subscribers/newsletter, series, draft chapter status (publishing part of a book), comments (none for now), custom domain, theme choice.

## Notes
- writercms is for one author with several sites; Publishify is multi-tenant (every author has their own publications). No migration is needed; writercms keeps living separately.
- Published content is public; the interface says so clearly.
