// Herkese açık yayın sayfaları: güvenli Markdown → HTML ve sayfa şablonları (sunucu taraflı, istemci JS'i yok).
import { Marked } from "marked";

export const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Yazı dilleri. rtl: sağdan sola yazılır. */
export const langs = {
  tr: { rtl: false, name: "Türkçe" },
  ku: { rtl: false, name: "Kurdî (Kurmancî)" }, zza: { rtl: false, name: "Zazakî (Kırmancki)" },
  ota: { rtl: true, name: "لسان عثمانى" }, ar: { rtl: true, name: "العربية" },
  en: { rtl: false, name: "English" },
} as const;
export type LangCode = keyof typeof langs;
export const langCodes = Object.keys(langs) as LangCode[];
export const isRtl = (l: string): boolean => (langs as Record<string, { rtl: boolean }>)[l]?.rtl ?? false;
const htmlLang = (l: string) => (l === "ota" ? "ota-Arab" : l === "ku" ? "ku-Latn" : l);

const safeHref = (u: string): string => (/^(https?:\/\/|mailto:|\/(?!\/|\\)|#)/i.test(u.trim()) ? u.trim() : "");

// Yazarın metni bizim alan adımızda yayımlanır: ham HTML metne çevrilir, bağlantılar ve görseller süzülür.
const md = new Marked({
  gfm: true,
  breaks: true, // satır sonları korunur (şiir, küçürek öykü)
  renderer: {
    html: ({ text }) => esc(text),
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const url = safeHref(href);
      return url ? `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ""} rel="nofollow ugc noopener">${inner}</a>` : inner;
    },
    image({ href, text }) {
      return /^https:\/\//i.test(href) ? `<img src="${esc(href)}" alt="${esc(text)}" loading="lazy">` : esc(text);
    },
  },
});

export const renderMarkdown = (src: string): string => md.parse(src, { async: false }) as string;

export const slugify = (s: string): string =>
  s.replace(/İ/g, "i").toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");

const CSS = `
:root{--bg:#fff;--ink:#1a1a1a;--muted:#6b6b6b;--line:#e4e4e4;--link:#4a6f3f}
@media(prefers-color-scheme:dark){:root{--bg:#161616;--ink:#ececec;--muted:#9a9a9a;--line:#2c2c2c;--link:#a9cf9c}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:19px/1.75 "Source Serif 4","Iowan Old Style",Charter,Georgia,serif}
:lang(ar),:lang(ota-Arab){font-family:"Noto Naskh Arabic","Amiri","Geeza Pro",serif;line-height:2}
main{max-width:40rem;margin:0 auto;padding:2.5rem 1.25rem 4rem}
h1{font-size:1.9em;line-height:1.25;margin:.2em 0 .3em}h2,h3{line-height:1.3}
a{color:var(--link)}small,.muted{color:var(--muted);font-size:.8em;font-family:system-ui,sans-serif}
blockquote{margin:1em 0;padding-inline-start:1em;border-inline-start:3px solid var(--line);color:var(--muted)}
hr{border:0;border-top:1px solid var(--line);margin:2em 0}img{max-width:100%;height:auto}
nav.toc ol{padding-inline-start:1.2em}nav.toc li{margin:.35em 0}.part{margin:1.4em 0 .2em;font-weight:700;font-family:system-ui,sans-serif;font-size:.85em;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.share{margin:2rem 0 0;font-family:system-ui,sans-serif;font-size:.85em}.share a{white-space:nowrap}.pager{display:flex;justify-content:space-between;gap:1rem;margin-top:3rem;padding-top:1rem;border-top:1px solid var(--line);font-family:system-ui,sans-serif;font-size:.9em}
footer{margin-top:3rem;font:.8rem system-ui,sans-serif;color:var(--muted)}`;

export interface PageOpts { title: string; description: string; canonical: string; lang: string; body: string; ogType?: string; jsonLd?: unknown; noindex?: boolean }
export function page(o: PageOpts): string {
  const dir = isRtl(o.lang) ? "rtl" : "ltr";
  const ld = o.jsonLd ? `<script type="application/ld+json">${JSON.stringify(o.jsonLd).replace(/</g, "\\u003c")}</script>` : "";
  return `<!doctype html><html lang="${esc(htmlLang(o.lang))}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.title)}</title><meta name="description" content="${esc(o.description)}"><link rel="canonical" href="${esc(o.canonical)}">
<meta name="robots" content="${o.noindex ? "noindex" : "index,follow,max-image-preview:large"}">
<meta property="og:type" content="${o.ogType ?? "website"}"><meta property="og:title" content="${esc(o.title)}"><meta property="og:description" content="${esc(o.description)}"><meta property="og:url" content="${esc(o.canonical)}"><meta property="og:site_name" content="Publishify">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(o.title)}"><meta name="twitter:description" content="${esc(o.description)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&amp;family=Noto+Naskh+Arabic:wght@400;700&amp;display=swap" rel="stylesheet">
<style>${CSS}</style>${ld}</head><body><main>${o.body}<footer><a href="/">Publishify</a> ile yayımlandı</footer></main></body></html>`;
}

export const CSP = "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src https: data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

/** Yayın türleri: tek parçalık yazılar (blog, deneme, makale…) da kitaplar gibi yayınlanır. */
export const kinds = ["kitap", "roman", "novella", "hikaye", "kucurek", "siir", "deneme", "blog", "makale", "kurgu-disi", "ani", "oyun"] as const;
export type Kind = (typeof kinds)[number];
/** schema.org türü (arama motorları ve yapay zekâ için). */
export const schemaType = (k: string): string =>
  k === "kitap" || k === "roman" || k === "novella" ? "Book" : k === "makale" ? "ScholarlyArticle" : k === "blog" ? "BlogPosting" : k === "oyun" ? "CreativeWork" : "Article";

const tr = (l: string) => l === "tr";
/** Paylaşma bağlantıları: JavaScript ve üçüncü taraf betik yok, tıklayınca ilgili sitenin paylaşma sayfası açılır. */
export function shareLinks(url: string, title: string, lang: string): string {
  const u = encodeURIComponent(url);
  const ti = encodeURIComponent(title);
  const a = (href: string, label: string) => `<a href="${esc(href)}" target="_blank" rel="noopener nofollow">${label}</a>`;
  return `<p class="share"><span class="muted">${tr(lang) ? "Paylaş" : "Share"}:</span> ${[
    a(`https://wa.me/?text=${ti}%20${u}`, "WhatsApp"),
    a(`https://twitter.com/intent/tweet?text=${ti}&url=${u}`, "X"),
    a(`https://www.facebook.com/sharer/sharer.php?u=${u}`, "Facebook"),
    a(`mailto:?subject=${ti}&body=${u}`, tr(lang) ? "E-posta" : "Email"),
  ].join(" · ")}</p>`;
}
export const readingMinutes = (text: string): number => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
