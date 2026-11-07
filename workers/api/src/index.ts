import { Hono, type MiddlewareHandler } from "hono";
import * as v from "valibot";
import { currentUser, loginOptions, loginVerify, logout, passkeyOptions, passkeyVerify, recover, registerOptions, registerVerify } from "./auth";
import { CSP, esc, isRtl, kinds, langCodes, page, readingMinutes, renderMarkdown, schemaType, shareLinks } from "./render";
import type { AppEnv } from "./types";

export { BookDO } from "./book-do";

/** Hız sınırlama (D1, sabit pencere). Kurtarma kodu denemelerini ve hesap oluşturmayı kötüye kullanıma karşı sınırlar. */
const rateLimit = (bucket: string, max: number, windowMs: number): MiddlewareHandler<AppEnv> => async (c, next) => {
  const ip = c.req.header("cf-connecting-ip") ?? "local";
  const win = Math.floor(Date.now() / windowMs);
  const row = await c.env.DB.prepare(
    "INSERT INTO rate_limits (key, window, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN window = excluded.window THEN count + 1 ELSE 1 END, window = excluded.window RETURNING count",
  ).bind(`${bucket}:${ip}`, win).first<{ count: number }>();
  if (Math.random() < 0.02) await c.env.DB.prepare("DELETE FROM rate_limits WHERE window < ?").bind(win - 1).run(); // eski sayaçları ara sıra temizle
  if ((row?.count ?? 0) > max) return c.json({ error: "rate" }, 429, { "retry-after": String(Math.ceil(windowMs / 1000)) });
  await next();
};

const app = new Hono<AppEnv>();

app.use("/api/*", async (c, next) => {
  // CSRF: durum değiştiren istekler yalnızca kendi kaynağımızdan gelebilir.
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    const origin = c.req.header("origin");
    if (origin && origin !== new URL(c.req.url).origin) return c.json({ error: "origin" }, 403);
  }
  await next();
  c.header("Cache-Control", "no-store");
});

const requireUser = async (c: Parameters<typeof currentUser>[0], next: () => Promise<void>) => {
  const u = await currentUser(c);
  if (!u) return c.json({ error: "auth" }, 401);
  c.set("user", u);
  await next();
};

const json = async <T extends v.GenericSchema>(c: Parameters<typeof currentUser>[0], schema: T): Promise<v.InferOutput<T> | null> => {
  const raw = await c.req.json().catch(() => null);
  const r = v.safeParse(schema, raw);
  return r.success ? r.output : null;
};

/** Gövdeyi gerçek boyutuyla sınırlar: content-length başlığına (yoksa ya da yalansa) güvenmez. */
const jsonLimited = async <T extends v.GenericSchema>(c: Parameters<typeof currentUser>[0], schema: T, max: number): Promise<v.InferOutput<T> | "large" | null> => {
  const declared = Number(c.req.header("content-length") ?? 0);
  if (declared > max) return "large";
  const text = await c.req.text().catch(() => null);
  if (text === null) return null;
  if (new TextEncoder().encode(text).byteLength > max) return "large";
  let raw: unknown = null;
  try { raw = JSON.parse(text); } catch { return null; }
  const r = v.safeParse(schema, raw);
  return r.success ? r.output : null;
};

app.get("/api/me", async (c) => {
  const u = await currentUser(c);
  if (!u) return c.json({ user: null });
  const n = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM credentials WHERE user_id = ?").bind(u.id).first<{ n: number }>();
  return c.json({ user: u, passkeys: n?.n ?? 0 });
});

const anyObj = v.looseObject({});
app.post("/api/auth/register/options", rateLimit("register", 10, 3_600_000), async (c) => {
  const b = await json(c, v.object({ name: v.optional(v.pipe(v.string(), v.maxLength(60))) }));
  return b ? registerOptions(c, (b.name ?? "").trim()) : c.json({ error: "body" }, 400);
});
app.post("/api/auth/register/verify", async (c) => {
  const b = await json(c, v.object({ response: anyObj }));
  return b ? registerVerify(c, b.response as never) : c.json({ error: "body" }, 400);
});
app.post("/api/auth/login/options", rateLimit("login", 40, 900_000), (c) => loginOptions(c));
app.post("/api/auth/login/verify", async (c) => {
  const b = await json(c, v.object({ response: anyObj }));
  return b ? loginVerify(c, b.response as never) : c.json({ error: "body" }, 400);
});
app.post("/api/auth/recover", rateLimit("recover", 5, 900_000), async (c) => {
  const b = await json(c, v.object({ code: v.pipe(v.string(), v.maxLength(64)) }));
  return b ? recover(c, b.code) : c.json({ error: "body" }, 400);
});
app.post("/api/auth/passkey/options", requireUser, (c) => passkeyOptions(c));
app.post("/api/auth/passkey/verify", requireUser, async (c) => {
  const b = await json(c, v.object({ response: anyObj }));
  return b ? passkeyVerify(c, b.response as never) : c.json({ error: "body" }, 400);
});
app.post("/api/auth/logout", (c) => logout(c));

/* ---------- Kitaplar ---------- */
const uuid = v.pipe(v.string(), v.uuid());
const syncSchema = v.object({
  cursor: v.pipe(v.number(), v.integer(), v.minValue(0)),
  meta: v.optional(v.object({ title: v.pipe(v.string(), v.maxLength(300)), author: v.pipe(v.string(), v.maxLength(300)), genre: v.optional(v.picklist(["roman", "novella", "hikaye", "diger"])), lang: v.optional(v.pipe(v.string(), v.maxLength(10))) })),
  order: v.optional(v.pipe(v.array(uuid), v.maxLength(2000))),
  items: v.pipe(
    v.array(v.object({
      id: uuid,
      kind: v.picklist(["part", "chapter", "scene"]),
      title: v.pipe(v.string(), v.maxLength(300)),
      body: v.pipe(v.string(), v.maxLength(1_000_000)),
      baseSeq: v.pipe(v.number(), v.integer(), v.minValue(0)),
      deleted: v.optional(v.boolean()),
    })),
    v.maxLength(500),
  ),
});

app.get("/api/books", requireUser, async (c) => {
  const rows = await c.env.DB.prepare("SELECT id, title, author, updated FROM books WHERE user_id = ? AND deleted = 0 ORDER BY updated DESC").bind(c.get("user").id).all();
  return c.json({ books: rows.results });
});

const stubFor = (c: Parameters<typeof currentUser>[0], bookId: string) =>
  c.env.BOOKS.get(c.env.BOOKS.idFromName(`${c.get("user").id}:${bookId}`));

app.post("/api/books/:id/sync", requireUser, async (c) => {
  const id = c.req.param("id");
  if (!v.is(uuid, id)) return c.json({ error: "id" }, 400);
  const b = await jsonLimited(c, syncSchema, 8_000_000);
  if (b === "large") return c.json({ error: "large" }, 413);
  if (!b) return c.json({ error: "body" }, 400);
  const user = c.get("user");

  const row = await c.env.DB.prepare("SELECT user_id, deleted FROM books WHERE id = ?").bind(id).first<{ user_id: string; deleted: number }>();
  if (row && row.user_id !== user.id) return c.json({ error: "not_found" }, 404);
  if (row?.deleted) return c.json({ error: "gone" }, 410);
  if (!row) {
    await c.env.DB.prepare("INSERT INTO books (id, user_id, title, author, updated) VALUES (?, ?, ?, '', ?)").bind(id, user.id, b.meta?.title ?? "", Date.now()).run();
  }
  const out = await stubFor(c, id).sync(b);
  if (b.meta || b.items.length) {
    await c.env.DB.prepare("UPDATE books SET title = COALESCE(?, title), author = COALESCE(?, author), updated = ? WHERE id = ?")
      .bind(b.meta?.title ?? null, b.meta?.author ?? null, Date.now(), id).run();
  }
  return c.json(out);
});

app.delete("/api/books/:id", requireUser, async (c) => {
  const id = c.req.param("id");
  if (!v.is(uuid, id)) return c.json({ error: "id" }, 400);
  const row = await c.env.DB.prepare("SELECT user_id FROM books WHERE id = ?").bind(id).first<{ user_id: string }>();
  if (!row || row.user_id !== c.get("user").id) return c.json({ ok: true });
  await stubFor(c, id).wipe();
  await c.env.DB.prepare("UPDATE books SET deleted = 1, title = '' WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});

/* ---------- Yayınla (CMS) ---------- */
const pubSchema = v.object({
  slug: v.pipe(v.string(), v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), v.minLength(3), v.maxLength(60)),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(300)),
  author: v.pipe(v.string(), v.maxLength(300)),
  description: v.pipe(v.string(), v.maxLength(500)),
  genre: v.optional(v.pipe(v.string(), v.maxLength(20))),
  kind: v.optional(v.picklist(kinds)),
  lang: v.picklist(langCodes as [string, ...string[]]),
  chapters: v.pipe(
    v.array(v.object({ part: v.pipe(v.string(), v.maxLength(300)), title: v.pipe(v.string(), v.maxLength(300)), body: v.pipe(v.string(), v.maxLength(1_000_000)) })),
    v.minLength(1), v.maxLength(500),
  ),
});

app.get("/api/publish", requireUser, async (c) => {
  const rows = await c.env.DB.prepare("SELECT id, slug, title, description, lang, kind, published, updated FROM published_books WHERE user_id = ? ORDER BY updated DESC").bind(c.get("user").id).all();
  return c.json({ books: rows.results });
});

app.put("/api/publish/:id", requireUser, rateLimit("publish", 60, 3_600_000), async (c) => {
  const id = c.req.param("id");
  if (!v.is(uuid, id)) return c.json({ error: "id" }, 400);
  const b = await jsonLimited(c, pubSchema, 8_000_000);
  if (b === "large") return c.json({ error: "large" }, 413);
  if (!b) return c.json({ error: "body" }, 400);
  const user = c.get("user");
  const row = await c.env.DB.prepare("SELECT user_id, published FROM published_books WHERE id = ?").bind(id).first<{ user_id: string; published: number }>();
  if (row && row.user_id !== user.id) return c.json({ error: "not_found" }, 404);
  const clash = await c.env.DB.prepare("SELECT id FROM published_books WHERE slug = ? AND id <> ?").bind(b.slug, id).first();
  if (clash) return c.json({ error: "slug" }, 409);
  const now = Date.now();
  await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO published_books (id, user_id, slug, title, author, description, genre, lang, kind, published, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, title = excluded.title, author = excluded.author, description = excluded.description, genre = excluded.genre, lang = excluded.lang, kind = excluded.kind, updated = excluded.updated",
    ).bind(id, user.id, b.slug, b.title, b.author, b.description, b.genre ?? "", b.lang, b.kind ?? "kitap", row?.published ?? now, now),
    c.env.DB.prepare("DELETE FROM published_chapters WHERE book_id = ?").bind(id),
    ...b.chapters.map((ch, n) => c.env.DB.prepare("INSERT INTO published_chapters (book_id, n, part, title, body) VALUES (?, ?, ?, ?, ?)").bind(id, n + 1, ch.part, ch.title, ch.body)),
  ]);
  return c.json({ ok: true, slug: b.slug, updated: now });
});

app.delete("/api/publish/:id", requireUser, async (c) => {
  const id = c.req.param("id");
  if (!v.is(uuid, id)) return c.json({ error: "id" }, 400);
  await c.env.DB.prepare("DELETE FROM published_books WHERE id = ? AND user_id = ?").bind(id, c.get("user").id).run();
  return c.json({ ok: true });
});

app.all("/api/*", (c) => c.json({ error: "not_found" }, 404));

/* ---------- Herkese açık yayın sayfaları: /k/<slug> ve /k/<slug>/<bölüm> ---------- */
type PubBook = { id: string; slug: string; title: string; author: string; description: string; genre: string; lang: string; kind: string; published: number; updated: number };
type PubChapter = { n: number; part: string; title: string; body: string };
const html = (c: Parameters<typeof currentUser>[0], body: string, status: 200 | 404 = 200) => {
  c.header("Content-Security-Policy", CSP);
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Cache-Control", status === 200 ? "public, max-age=60, s-maxage=300" : "no-store");
  return c.html(body, status);
};
const notFound = (c: Parameters<typeof currentUser>[0]) =>
  html(c, page({ title: "Bulunamadı — Publishify", description: "", canonical: new URL(c.req.url).origin, lang: "tr", noindex: true, body: "<h1>Sayfa bulunamadı</h1><p><a href=\"/\">Publishify</a></p>" }), 404);

/** Bir bölümün sayfası (kitabın bölümü ya da tek parçalık yazının kendisi). */
const articleHtml = (c: Parameters<typeof currentUser>[0], book: PubBook, ch: PubChapter, total: number, single: boolean) => {
  const origin = new URL(c.req.url).origin;
  const slug = book.slug;
  const rtl = isRtl(book.lang);
  const canonical = single ? `${origin}/k/${slug}` : `${origin}/k/${slug}/${ch.n}`;
  const text = ch.body.replace(/[#>*_`\s]+/g, " ").trim();
  const desc = (single && book.description) || text.slice(0, 160) || book.title;
  const minutes = readingMinutes(ch.body);
  const startsWithHeading = /^\s*#\s/.test(ch.body);
  const prev = !single && ch.n > 1 ? `<a href="/k/${esc(slug)}/${ch.n - 1}">${rtl ? "→" : "←"}</a>` : "<span></span>";
  const next = !single && ch.n < total ? `<a href="/k/${esc(slug)}/${ch.n + 1}">${rtl ? "←" : "→"}</a>` : "<span></span>";
  const head = single
    ? `${startsWithHeading ? "" : `<h1>${esc(book.title)}</h1>`}<p class="muted">${book.author ? `${esc(book.author)} · ` : ""}${new Date(book.published).toLocaleDateString(book.lang === "ota" ? "tr" : book.lang, { year: "numeric", month: "long", day: "numeric" })} · ${minutes} ${book.lang === "tr" ? "dk okuma" : "min read"}</p>`
    : `<p class="muted"><a href="/k/${esc(slug)}">${esc(book.title)}</a>${ch.part ? ` · ${esc(ch.part)}` : ""}</p>`;
  const pager = single ? "" : `<div class="pager">${prev}<a href="/k/${esc(slug)}">${ch.n}/${total}</a>${next}</div>`;
  const ld = { "@context": "https://schema.org", "@type": single ? schemaType(book.kind) : "Chapter", name: single ? book.title : ch.title || String(ch.n), inLanguage: book.lang, url: canonical, description: desc, ...(book.author ? { author: { "@type": "Person", name: book.author } } : {}), datePublished: new Date(book.published).toISOString(), dateModified: new Date(book.updated).toISOString(), ...(single ? { wordCount: text.split(/\s+/).length } : { isPartOf: { "@type": "Book", name: book.title, url: `${origin}/k/${slug}` } }) };
  return html(c, page({
    title: single ? `${book.title}${book.author ? ` — ${book.author}` : ""}` : `${ch.title || ch.n} — ${book.title}`,
    description: desc, canonical, lang: book.lang, ogType: "article", jsonLd: ld,
    body: `${head}<article>${renderMarkdown(ch.body)}</article>${shareLinks(canonical, book.title, book.lang)}${pager}`,
  }));
};

app.get("/k/:slug", async (c) => {
  const slug = c.req.param("slug");
  const book = await c.env.DB.prepare("SELECT * FROM published_books WHERE slug = ?").bind(slug).first<PubBook>();
  if (!book) return notFound(c);
  const chs = (await c.env.DB.prepare("SELECT n, part, title FROM published_chapters WHERE book_id = ? ORDER BY n").bind(book.id).all<Omit<PubChapter, "body">>()).results;
  // Tek parçalık yazı (blog, deneme, hikâye, makale…): içerik doğrudan bu adreste.
  if (chs.length === 1) {
    const one = await c.env.DB.prepare("SELECT n, part, title, body FROM published_chapters WHERE book_id = ? AND n = 1").bind(book.id).first<PubChapter>();
    if (one) return articleHtml(c, book, one, 1, true);
  }
  const origin = new URL(c.req.url).origin;
  let lastPart = "";
  const toc = chs.map((ch) => {
    const head = ch.part && ch.part !== lastPart ? `<li class="part" style="list-style:none;margin-inline-start:-1.2em">${esc(ch.part)}</li>` : "";
    lastPart = ch.part;
    return `${head}<li><a href="/k/${esc(slug)}/${ch.n}">${esc(ch.title || String(ch.n))}</a></li>`;
  }).join("");
  const desc = book.description || `${book.title} — ${book.author}`;
  return html(c, page({
    title: `${book.title}${book.author ? ` — ${book.author}` : ""}`, description: desc, canonical: `${origin}/k/${slug}`, lang: book.lang, ogType: "book",
    jsonLd: { "@context": "https://schema.org", "@type": schemaType(book.kind), name: book.title, inLanguage: book.lang, description: desc, url: `${origin}/k/${slug}`, ...(book.author ? { author: { "@type": "Person", name: book.author } } : {}), datePublished: new Date(book.published).toISOString() },
    body: `<h1>${esc(book.title)}</h1>${book.author ? `<p class="muted">${esc(book.author)}</p>` : ""}${book.description ? `<p>${esc(book.description)}</p>` : ""}<nav class="toc"><ol>${toc}</ol></nav>${shareLinks(`${origin}/k/${slug}`, book.title, book.lang)}`,
  }));
});

app.get("/k/:slug/:n", async (c) => {
  const slug = c.req.param("slug");
  const n = Number(c.req.param("n"));
  if (!Number.isInteger(n) || n < 1) return notFound(c);
  const book = await c.env.DB.prepare("SELECT * FROM published_books WHERE slug = ?").bind(slug).first<PubBook>();
  const ch = book ? await c.env.DB.prepare("SELECT n, part, title, body FROM published_chapters WHERE book_id = ? AND n = ?").bind(book.id, n).first<PubChapter>() : null;
  if (!book || !ch) return notFound(c);
  const total = (await c.env.DB.prepare("SELECT COUNT(*) AS n FROM published_chapters WHERE book_id = ?").bind(book.id).first<{ n: number }>())?.n ?? n;
  return articleHtml(c, book, ch, total, total === 1);
});

app.onError((e, c) => {
  console.error("api error", e instanceof Error ? e.message : "unknown"); // metin asla loglanmaz
  return c.json({ error: "server" }, 500);
});

export default app;
