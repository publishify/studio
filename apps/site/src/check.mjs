// Validates the generated site: title/description length, a single h1, image attributes, internal links, hreflang, JSON-LD.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../../web/dist");
const errors = [];
const err = (m) => errors.push(m);

const htmlFiles = [];
const walk = (dir) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (e.name === "studio" || e.name === "k") continue; const f = path.join(dir, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith(".html")) htmlFiles.push(f); } };
walk(OUT);

const exists = (href) => {
  const p = href.split("#")[0].split("?")[0];
  if (!p || p.startsWith("/studio/") || p.startsWith("/k/") || p.startsWith("/api/")) return true;
  const f = path.join(OUT, p);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? true : fs.existsSync(path.join(f, "index.html"));
};
const titles = new Map(), descs = new Map();

for (const f of htmlFiles) {
  const rel = path.relative(OUT, f);
  const h = fs.readFileSync(f, "utf8");
  const is404 = rel === "404.html";
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (!is404) {
    if (title.length < 20 || title.length > 70) err(`${rel}: title length ${title.length}`);
    if (desc.length < 70 || desc.length > 170) err(`${rel}: description length ${desc.length}`);
    if (titles.has(title)) err(`${rel}: duplicate title (${titles.get(title)})`); titles.set(title, rel);
    if (descs.has(desc)) err(`${rel}: duplicate description (${descs.get(desc)})`); descs.set(desc, rel);
    if (!/<link rel="canonical" href="https:\/\/publishify\.app[^"]*">/.test(h)) err(`${rel}: missing canonical`);
    if (!/hreflang="x-default"/.test(h)) err(`${rel}: missing x-default`);
  }
  if ((h.match(/<h1[ >]/g) ?? []).length !== 1) err(`${rel}: h1 count ${(h.match(/<h1[ >]/g) ?? []).length}`);
  for (const m of h.matchAll(/<img [^>]*>/g)) if (!/ alt="[^"]*"/.test(m[0]) || !/ width="\d+"/.test(m[0]) || !/ height="\d+"/.test(m[0])) err(`${rel}: image is missing alt/width/height`);
  if (/<script(?![^>]*application\/ld\+json)/.test(h)) err(`${rel}: script other than JSON-LD`);
  for (const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) err(`${rel}: broken link ${m[1]}`);
  for (const m of h.matchAll(/srcset="([^"]*)"/g)) for (const part of m[1].split(",")) { const u = part.trim().split(" ")[0]; if (u && !exists(u)) err(`${rel}: broken srcset ${u}`); }
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { err(`${rel}: invalid JSON-LD`); } }
  for (const m of h.matchAll(/<link rel="alternate" hreflang="[^"]*" href="(https:\/\/publishify\.app[^"]*)"/g)) if (!exists(m[1].replace("https://publishify.app", ""))) err(`${rel}: missing hreflang target ${m[1]}`);
}
for (const f of ["sitemap.xml", "robots.txt", "llms.txt", "llms-full.txt", "_headers", "img/og.png", "img/og-en.png", "favicon.svg", "404.html"]) if (!fs.existsSync(path.join(OUT, f))) err(`missing file: ${f}`);

const bytes = (f) => fs.statSync(path.join(OUT, f)).size;
const homeKb = (bytes("index.html") / 1024).toFixed(1);
if (errors.length) { console.error(`site check: ${errors.length} problem(s)\n- ${errors.join("\n- ")}`); process.exit(1); }
console.log(`site check: ${htmlFiles.length} HTML pages OK (home page HTML ${homeKb} KB, no scripts, internal links intact)`);
