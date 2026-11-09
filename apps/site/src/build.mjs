// Marketing-site generator: produces static HTML, sitemap, robots, llms.txt and _headers from the content.
// Output is written to the root of apps/web/dist/ (the editor is under /studio/, see apps/web/vite.config.ts).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAQ, FEATURES, LANGS, SITE, THEMES, pages } from "./content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const OUT = path.resolve(root, "../web/dist");
const today = new Date().toISOString().slice(0, 10);
const LANG_KEYS = ["tr", "en"];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const css = fs.readFileSync(path.join(here, "style.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};,>])\s*/g, "$1").replace(/;}/g, "}").trim();
const logo = fs.readFileSync(path.join(root, "public/img/logo-yesil.svg"), "utf8")
  .replace(/<svg /, '<svg class="wm" aria-hidden="true" focusable="false" ').replace(/ role="img" aria-label="Publishify"/, "").replace(/fill="#668f5a"/, 'fill="currentColor"');

const slugOf = (id, L) => pages.find((p) => p.id === id).slug[L];
const urlOf = (id, L) => SITE + slugOf(id, L);
const other = (L) => (L === "tr" ? "en" : "tr");
const dict = {
  tr: { nav: "Ana gezinme", menu: "Menü", skip: "İçeriğe geç", studio: "Yazmaya başla", switchTo: "EN", crumbs: "Sayfa yolu", product: "Yazar için", help: "Yardım", language: "Dil", rights: "Yazar-yayıncının evi.", openStudio: "Studio'yu aç", llms: "Yapay zekâ için özet" },
  en: { nav: "Main navigation", menu: "Menu", skip: "Skip to content", studio: "Start writing", switchTo: "TR", crumbs: "Breadcrumb", product: "For authors", help: "Help", language: "Language", rights: "A home for author-publishers.", openStudio: "Open Studio", llms: "Summary for AI" },
};
const navIds = ["features", "masthead", "publishing", "faq"];
const navLabel = { features: { tr: "Studio", en: "Studio" }, masthead: { tr: "Masthead", en: "Masthead" }, languages: { tr: "Diller", en: "Languages" }, publishing: { tr: "Yayınla", en: "Publish" }, compare: { tr: "Karşılaştırma", en: "Compare" }, faq: { tr: "SSS", en: "FAQ" }, home: { tr: "Ana sayfa", en: "Home" } };

function helpers(L, page) {
  const t = (tr, en) => (L === "tr" ? tr : en);
  return {
    t,
    href: (id) => slugOf(id, L),
    shot(name, alt, o = {}) {
      const w = o.w, small = Math.round(w / 2);
      return `<figure class="shot ${o.cls ?? ""}"><img src="/img/${name}-${w}.jpg" srcset="/img/${name}-${small}.jpg ${small}w, /img/${name}-${w}.jpg ${w}w" sizes="${o.sizes ?? "100vw"}" width="${w}" height="${o.hh}" alt="${esc(alt)}" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></figure>`;
    },
    features: (n) => FEATURES.slice(0, n).map((f) => `<div class="card"><h3>${f.title[L]}</h3><p>${f.text[L]}</p></div>`).join(""),
    langChips: () => LANGS.map((x) => `<span class="chip"><b>${x.name}</b>${x.rtl ? `<span class="rtl" lang="ar" dir="rtl">${x.native}</span>` : x.name === x.native ? "" : `<span>${x.native}</span>`}</span>`).join(""),
    themes: () => THEMES.map((x) => `<div class="sw" role="listitem"><i style="background:${x.bg};color:${x.ink}">Aa</i>${x.name[L]}</div>`).join(""),
    faq: (n) => FAQ.slice(0, n).map((f) => `<details class="q"><summary>${f.q[L]}</summary><div class="a">${f.a[L]}</div></details>`).join(""),
    crumbs: (ids) => `<nav class="crumbs" aria-label="${dict[L].crumbs}">${ids.map(([id], i) => (i === ids.length - 1 ? `<span aria-current="page">${navLabel[id][L]}</span>` : `<a href="${slugOf(id, L)}">${navLabel[id][L]}</a> › `)).join("")}</nav>`,
  };
}

function jsonLd(L, page) {
  const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: "Publishify", url: `${SITE}/`, logo: { "@type": "ImageObject", url: `${SITE}/img/logo-512.png`, width: 512, height: 512 } };
  const site = { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Publishify", inLanguage: LANG_KEYS, publisher: { "@id": `${SITE}/#org` } };
  const app = {
    "@type": "SoftwareApplication", "@id": `${SITE}/#app`, name: "Publishify Studio", url: `${SITE}/studio/`,
    applicationCategory: "UtilitiesApplication", operatingSystem: "Any (web browser)", browserRequirements: "Requires a modern web browser",
    inLanguage: ["tr", "en", "ar"], offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
    description: pages[0].desc[L], featureList: FEATURES.map((f) => f.title[L]), publisher: { "@id": `${SITE}/#org` },
  };
  const out = [];
  if (page.schema?.includes("org")) out.push(org);
  if (page.schema?.includes("site")) out.push(site);
  if (page.schema?.includes("app")) out.push(app);
  const wp = { "@type": "WebPage", "@id": `${SITE}${page.slug[L]}#page`, url: urlOf(page.id, L), name: page.title[L], description: page.desc[L], inLanguage: L, isPartOf: { "@id": `${SITE}/#website` } };
  out.push(wp);
  if (page.schema?.includes("faq")) out.push({ "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q[L], acceptedAnswer: { "@type": "Answer", text: f.a[L] } })) });
  if (page.schema?.includes("crumbs")) out.push({ "@type": "BreadcrumbList", itemListElement: [["home"], [page.id]].map(([id], i) => ({ "@type": "ListItem", position: i + 1, name: navLabel[id][L], item: urlOf(id, L) })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": out }).replace(/</g, "\\u003c");
}

function layout(L, page, bodyHtml) {
  const d = dict[L], O = other(L);
  const canonical = urlOf(page.id, L);
  const alt = LANG_KEYS.map((k) => `<link rel="alternate" hreflang="${k}" href="${urlOf(page.id, k)}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${urlOf(page.id, "en")}">`;
  const nav = navIds.map((id) => `<a href="${slugOf(id, L)}"${id === page.id ? ' aria-current="page"' : ""}>${navLabel[id][L]}</a>`).join("");
  const preload = page.id === "home" ? `<link rel="preload" as="image" href="/img/editor-dark-1600.jpg" imagesrcset="/img/editor-dark-800.jpg 800w, /img/editor-dark-1600.jpg 1600w" imagesizes="(min-width:980px) 640px, 100vw" fetchpriority="high">` : "";
  return `<!doctype html>
<html lang="${L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title[L])}</title>
<meta name="description" content="${esc(page.desc[L])}">
<link rel="canonical" href="${canonical}">${alt}
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'none'">
<meta name="color-scheme" content="dark"><meta name="theme-color" content="#0a0f0b">
<meta property="og:type" content="website"><meta property="og:site_name" content="Publishify"><meta property="og:title" content="${esc(page.title[L])}"><meta property="og:description" content="${esc(page.desc[L])}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="${L === "tr" ? "tr_TR" : "en_US"}"><meta property="og:locale:alternate" content="${O === "tr" ? "tr_TR" : "en_US"}">
<meta property="og:image" content="${SITE}/img/${L === "tr" ? "og.png" : "og-en.png"}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${L === "tr" ? "Publishify: yazmak için sade bir stüdyo" : "Publishify: a calm studio to write in"}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title[L])}"><meta name="twitter:description" content="${esc(page.desc[L])}"><meta name="twitter:image" content="${SITE}/img/${L === "tr" ? "og.png" : "og-en.png"}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="text/plain" href="/llms.txt" title="${d.llms}">
${preload}<style>${css}</style>
<script type="application/ld+json">${jsonLd(L, page)}</script>
</head><body>
<a class="skip" href="#main">${d.skip}</a>
<header class="top"><div class="wrap"><a class="brand" href="${slugOf("home", L)}" aria-label="Publishify">${logo}</a>
<nav class="main" aria-label="${d.nav}">${nav}</nav>
<div class="right"><a class="lang" href="${slugOf(page.id, O)}" hreflang="${O}" lang="${O}">${d.switchTo}</a><a class="btn primary sm" href="/studio/">${d.studio}</a>
<details class="menu"><summary>${d.menu}</summary><nav aria-label="${d.nav}">${nav}</nav></details></div></div></header>
<main id="main">${bodyHtml}</main>
<footer class="foot"><div class="wrap"><div class="cols">
<div><span class="brand" aria-hidden="true">${logo}</span><p>${d.rights}</p></div>
<div><h4>${d.product}</h4><a href="/studio/">${d.openStudio}</a><a href="${slugOf("features", L)}">${navLabel.features[L]}</a><a href="${slugOf("masthead", L)}">${navLabel.masthead[L]}</a><a href="${slugOf("languages", L)}">${navLabel.languages[L]}</a><a href="${slugOf("publishing", L)}">${navLabel.publishing[L]}</a></div>
<div><h4>${d.help}</h4><a href="${slugOf("compare", L)}">${navLabel.compare[L]}</a><a href="${slugOf("faq", L)}">${navLabel.faq[L]}</a><a href="/llms.txt">${d.llms}</a></div>
<div><h4>${d.language}</h4><a href="${slugOf(page.id, "tr")}" hreflang="tr" lang="tr">Türkçe</a><a href="${slugOf(page.id, "en")}" hreflang="en" lang="en">English</a></div>
</div><p class="small" style="margin-top:28px">© ${new Date().getFullYear()} Publishify</p></div></footer>
</body></html>`;
}

const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
const copyDir = (from, to) => { for (const e of fs.readdirSync(from, { withFileTypes: true })) { const a = path.join(from, e.name), b = path.join(to, e.name); if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); } else fs.copyFileSync(a, b); } };

// Old (root-based) editor assets are no longer used
fs.rmSync(path.join(OUT, "assets"), { recursive: true, force: true });

// ---- sayfalar
for (const p of pages) for (const L of LANG_KEYS) {
  const body = p.body(L, helpers(L, p));
  const rel = p.slug[L] === "/" ? "index.html" : `${p.slug[L].replace(/^\//, "")}index.html`;
  write(rel, layout(L, p, body));
}
// 404
{
  const p = { id: "home", slug: { tr: "/tr/", en: "/" }, title: { tr: "Sayfa bulunamadı | Publishify", en: "Page not found | Publishify" }, desc: { tr: "Aradığın sayfa bulunamadı.", en: "The page you are looking for was not found." } };
  const h = layout("en", p, `<div class="wrap page-head"><h1>Page not found</h1><p class="lede">This page may have moved or may never have existed.</p><p class="cta"><a class="btn primary" href="/">Home</a><a class="btn ghost" href="/studio/">Open Studio</a></p></div>`)
    .replace('content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"', 'content="noindex"');
  write("404.html", h);
}
// Addresses from before English moved to the root keep working.
write("_redirects", pages.flatMap((p) => {
  const moved = [[p.slug.tr.replace(/^\/tr/, ""), p.slug.tr], [`/en${p.slug.en}`, p.slug.en]];
  // An old Turkish address can equal a current English one; that one must stay.
  return moved
    .filter(([from]) => !pages.some((q) => q.slug.en === from || q.slug.tr === from))
    .map(([from, to]) => `${from} ${to} 301`);
}).join("\n") + "\n");
copyDir(path.join(root, "public"), OUT);

// ---- sitemap, robots, llms
const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  pages.flatMap((p) => LANG_KEYS.map((L) => `<url><loc>${urlOf(p.id, L)}</loc><lastmod>${today}</lastmod><changefreq>${p.priority >= 0.9 ? "weekly" : "monthly"}</changefreq><priority>${p.priority}</priority>${LANG_KEYS.map((k) => `<xhtml:link rel="alternate" hreflang="${k}" href="${urlOf(p.id, k)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${urlOf(p.id, "tr")}"/></url>`)).join("\n") + `\n</urlset>\n`;
write("sitemap.xml", sm);

const bots = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "Amazonbot", "cohere-ai", "MistralAI-User"];
write("robots.txt", `# Publishify: herkese açık sayfalar arama motorları ve yapay zekâ asistanları için açıktır.\nUser-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /studio/\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /api/\nDisallow: /studio/\n`).join("\n")}\nSitemap: ${SITE}/sitemap.xml\n`);

const sumTr = pages[0].desc.tr, sumEn = pages[0].desc.en;
write("llms.txt", `# Publishify

> ${sumTr}
> ${sumEn}

Publishify, bağımsız yazarlar için tarayıcıda çalışan bir yazma editörü ve yayın stüdyosudur. Editör ${SITE}/studio/ adresindedir; tanıtım sitesi kök adrestedir. / Publishify is a browser-based writing editor and publishing studio for independent authors; the editor lives at ${SITE}/studio/.

## Türkçe
${pages.map((p) => `- [${navLabel[p.id][ "tr" ]}](${urlOf(p.id, "tr")}): ${p.desc.tr}`).join("\n")}

## English
${pages.map((p) => `- [${navLabel[p.id].en}](${urlOf(p.id, "en")}): ${p.desc.en}`).join("\n")}

## Optional
- [Full text for LLMs](${SITE}/llms-full.txt)
- [Sitemap](${SITE}/sitemap.xml)
`);

const full = (L) => `# Publishify (${L === "tr" ? "Türkçe" : "English"})

${pages[0].desc[L]}

## ${L === "tr" ? "Kısa cevaplar" : "Quick answers"}
${FAQ.map((f) => `### ${f.q[L]}\n${f.a[L]}\n`).join("\n")}
## ${L === "tr" ? "Özellikler" : "Features"}
${FEATURES.map((f) => `- **${f.title[L]}**: ${f.text[L]}`).join("\n")}

## ${L === "tr" ? "Diller" : "Languages"}
${LANGS.map((x) => `- ${x.name} (${x.script[L]}, ${x.dir === "rtl" ? (L === "tr" ? "sağdan sola" : "right to left") : (L === "tr" ? "soldan sağa" : "left to right")})${x.ui ? (L === "tr" ? " — arayüz dili de var" : " — also an interface language") : ""}`).join("\n")}

## ${L === "tr" ? "Karşılaştırma (Kasım 2026)" : "Comparison (November 2026)"}
- Publishify: ${L === "tr" ? "tarayıcıda, her cihazda; editör ücretsiz; kurulum yok" : "in the browser, on any device; free editor; no install"}
- Ulysses: Mac, iPad, iPhone; ${L === "tr" ? "abonelik" : "subscription"}
- Scrivener: Mac, Windows, iPhone/iPad; ${L === "tr" ? "tek seferlik satın alma" : "one-time purchase"}

${L === "tr" ? "Sayfalar" : "Pages"}: ${pages.map((p) => urlOf(p.id, L)).join(" · ")}
`;
write("llms-full.txt", `${full("tr")}\n---\n\n${full("en")}`);

// The studio's only third parties: Google Fonts, and Google sign-in plus the Drive API for Drive storage.
// Book text can carry raw HTML (imports, PDF export iframe), so inline and foreign scripts must stay blocked.
const STUDIO_CSP = [
  "default-src 'none'",
  "script-src 'self' https://accounts.google.com/gsi/client",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' https://www.googleapis.com https://accounts.google.com/gsi/",
  "frame-src https://accounts.google.com/gsi/",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

write("_headers", `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(self)
  Strict-Transport-Security: max-age=31536000
/studio/*
  Content-Security-Policy: ${STUDIO_CSP}
/img/*
  Cache-Control: public, max-age=31536000, immutable
/studio/assets/*
  Cache-Control: public, max-age=31536000, immutable
/robots.txt
  Cache-Control: public, max-age=3600
/sitemap.xml
  Cache-Control: public, max-age=3600
`);

console.log(`site: ${pages.length * 2} pages + 404, sitemap, robots, llms.txt → ${path.relative(process.cwd(), OUT) || OUT}`);
await import("./check.mjs");
