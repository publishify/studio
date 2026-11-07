import { strToU8, zipSync } from "fflate";
import { marked } from "marked";
import { getBlob } from "./media";
import { type BookLang, bookLangOf, htmlLang, isRtl } from "./languages";
import type { Book } from "./store";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9ığüşöç]+/gi, "-").replace(/^-|-$/g, "") || "kitap";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function download(name: string, data: BlobPart | Uint8Array, type: string) {
  const url = URL.createObjectURL(new Blob([data as BlobPart], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Parts become `# ` headings; chapter headings move one level down. */
function sections(book: Book): { part: boolean; md: string; title: string }[] {
  const out: { part: boolean; md: string; title: string }[] = [];
  const first = (body: string) => body.split("\n").find((l) => l.trim())?.replace(/^#+\s*/, "") ?? "";
  let scenes = 0; // number of scenes joined to the current chapter
  let onlyHeading = false; // whether the chapter's own text is only a heading
  for (const i of book.items) {
    if (i.trashed) continue;
    if (i.kind === "part") { out.push({ part: true, title: i.title, md: `# ${i.title}` }); scenes = 0; continue; }
    const last = out[out.length - 1];
    if (i.level === 2 && last && !last.part) {
      // A scene goes inside the chapter. Scenes are separated by "* * *"; if the chapter is only a heading, no separator is placed before the first scene.
      const sep = scenes === 0 && onlyHeading ? "" : "* * *\n\n";
      last.md = `${last.md.trimEnd()}\n\n${sep}${i.body.trim()}`;
      scenes++;
      continue;
    }
    const lines = i.body.split("\n").filter((l) => l.trim());
    onlyHeading = lines.length <= 1 && lines.every((l) => l.startsWith("#"));
    scenes = 0;
    out.push({ part: false, title: first(i.body), md: i.body });
  }
  return out;
}

/** The book's writing language (Turkish if undefined). */
const bl = (book: Book): BookLang => bookLangOf(book, "tr");

/** Chapters for publishing: part label + title + Markdown body (scenes are merged into the chapter, trashed items excluded). */
export function publishChapters(book: Book): { part: string; title: string; body: string }[] {
  const out: { part: string; title: string; body: string }[] = [];
  let part = "";
  for (const s of sections(book)) {
    if (s.part) { part = s.title; continue; }
    if (s.md.trim()) out.push({ part, title: s.title.slice(0, 300), body: s.md });
  }
  return out;
}

export function toMarkdown(book: Book): string {
  const head = `# ${book.title}\n${book.author ? `\n*${book.author}*\n` : ""}\n`;
  return head + sections(book).map((s) => s.md.trim()).join("\n\n") + "\n";
}

const CSS = `body{font-family:Georgia,'Iowan Old Style',serif;line-height:1.7;max-width:40rem;margin:2rem auto;padding:0 1rem}h1,h2,h3{line-height:1.25}blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:1rem;color:#555}section{break-before:page}`;

async function bodyHtml(book: Book): Promise<string> {
  const parts: string[] = [`<h1>${esc(book.title)}</h1>${book.author ? `<p><em>${esc(book.author)}</em></p>` : ""}`];
  for (const s of sections(book)) parts.push(`<section>${await marked.parse(s.md)}</section>`);
  return parts.join("\n");
}

export async function exportBook(book: Book, kind: "md" | "html" | "docx" | "epub" | "pdf") {
  const name = slug(book.title);
  if (kind === "md") return download(`${name}.md`, toMarkdown(book), "text/markdown");
  if (kind === "html") {
    const html = `<!doctype html><html lang="${htmlLang(bl(book))}" dir="${isRtl(bl(book)) ? "rtl" : "ltr"}"><meta charset="utf-8"><title>${esc(book.title)}</title><style>${CSS}</style><body>${await bodyHtml(book)}</body></html>`;
    return download(`${name}.html`, html, "text/html");
  }
  if (kind === "pdf") {
    const html = `<!doctype html><html><meta charset="utf-8"><title>${esc(book.title)}</title><style>${CSS}</style><body>${await bodyHtml(book)}</body></html>`;
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;width:0;height:0;border:0";
    document.body.appendChild(f);
    f.srcdoc = html;
    f.onload = () => {
      f.contentWindow?.print();
      setTimeout(() => f.remove(), 60_000);
    };
    return;
  }
  if (kind === "docx") return download(`${name}.docx`, docx(book), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  return download(`${name}.epub`, await epub(book), "application/epub+zip");
}

/* ---------- DOCX ---------- */
function runs(text: string, rtl = false): string {
  const out: string[] = [];
  for (const tok of text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)) {
    if (!tok) continue;
    const b = tok.startsWith("**") && tok.endsWith("**") && tok.length > 4;
    const i = !b && tok.startsWith("*") && tok.endsWith("*") && tok.length > 2;
    const txt = b ? tok.slice(2, -2) : i ? tok.slice(1, -1) : tok;
    out.push(`<w:r><w:rPr>${b ? "<w:b/>" : ""}${rtl && b ? "<w:bCs/>" : ""}${i ? "<w:i/>" : ""}${rtl && i ? "<w:iCs/>" : ""}${rtl ? "<w:rtl/>" : ""}</w:rPr><w:t xml:space="preserve">${esc(txt)}</w:t></w:r>`);
  }
  return out.join("");
}

function docx(book: Book): Uint8Array {
  const paras: string[] = [];
  const rtl = isRtl(bl(book));
  // OOXML order: pStyle, pageBreakBefore, bidi, ind
  const p = (text: string, style?: string, opts: { pb?: boolean; ind?: boolean } = {}) =>
    paras.push(`<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ""}${opts.pb ? "<w:pageBreakBefore/>" : ""}${rtl ? "<w:bidi/>" : ""}${opts.ind ? '<w:ind w:left="720"/>' : ""}</w:pPr>${runs(text, rtl)}</w:p>`);
  p(book.title, "Title");
  if (book.author) p(book.author);
  for (const s of sections(book)) {
    for (const block of s.md.split(/\n{2,}/)) {
      const lines = block.split("\n");
      const first = lines[0] ?? "";
      const h = /^(#{1,3})\s+(.*)$/.exec(first);
      if (h && h[1] && h[2] !== undefined) {
        p(h[2], `Heading${h[1].length}`, { pb: !!s.part || h[1].length === 1 });
      } else if (first.startsWith(">")) {
        p(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), undefined, { ind: true });
      } else if (block.trim()) {
        p(lines.join(" "));
      }
    }
  }
  const ns = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  const sty = (id: string, name: string, size: number, bold = true) =>
    `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/></w:rPr></w:style>`;
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "word/styles.xml": `<?xml version="1.0" encoding="UTF-8"?><w:styles ${ns}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:sz w:val="24"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>${sty("Title", "Title", 48)}${sty("Heading1", "heading 1", 36)}${sty("Heading2", "heading 2", 30)}${sty("Heading3", "heading 3", 26)}</w:styles>`,
    "word/document.xml": `<?xml version="1.0" encoding="UTF-8"?><w:document ${ns}><w:body>${paras.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
  };
  return zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, strToU8(v)])));
}

/* ---------- EPUB ---------- */
const xhtml = (title: string, body: string, lang: BookLang = "tr") =>
  `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${htmlLang(lang)}" xml:lang="${htmlLang(lang)}" dir="${isRtl(lang) ? "rtl" : "ltr"}"><head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" href="style.css"/></head><body>${body}</body></html>`;

/** E-book readers are guaranteed to read JPEG and PNG; other formats are converted to JPEG. */
async function coverImage(book: Book): Promise<{ ext: "jpg" | "png"; type: string; data: Uint8Array } | null> {
  const raw = book.cover ? await getBlob(book.cover.id) : undefined;
  if (!raw) return null;
  let blob: Blob = raw;
  if (!/^image\/(jpeg|png)$/.test(blob.type)) {
    const bmp = await createImageBitmap(blob);
    const c = document.createElement("canvas");
    c.width = bmp.width; c.height = bmp.height;
    c.getContext("2d")!.drawImage(bmp, 0, 0);
    blob = await new Promise<Blob>((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("cover"))), "image/jpeg", 0.9));
  }
  return { ext: blob.type === "image/png" ? "png" : "jpg", type: blob.type, data: new Uint8Array(await blob.arrayBuffer()) };
}

export async function buildEpub(book: Book): Promise<Uint8Array> { return epub(book); }

async function epub(book: Book): Promise<Uint8Array> {
  const cover = await coverImage(book);
  const secs = sections(book).filter((s) => s.md.trim());
  const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {};
  files["mimetype"] = [strToU8("application/epub+zip"), { level: 0 }];
  files["META-INF/container.xml"] = strToU8(`<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  const L = bl(book);
  files["OEBPS/style.css"] = strToU8(`${isRtl(L) ? "html,body{direction:rtl}" : ""}body{font-family:serif;line-height:1.6}h1,h2,h3{line-height:1.25}blockquote{margin-left:1em;font-style:italic}`);
  const ids: { id: string; href: string; title: string }[] = [];
  for (const [n, s] of secs.entries()) {
    const html = (await marked.parse(s.md)).replace(/<br>/g, "<br/>").replace(/<hr>/g, "<hr/>");
    const href = `s${String(n + 1).padStart(3, "0")}.xhtml`;
    files[`OEBPS/${href}`] = strToU8(xhtml(s.title || book.title, html, L));
    ids.push({ id: `s${n + 1}`, href, title: s.title || `${n + 1}` });
  }
  if (cover) {
    files[`OEBPS/cover.${cover.ext}`] = cover.data;
    files["OEBPS/cover.xhtml"] = strToU8(xhtml(book.title, `<div style="text-align:center"><img src="cover.${cover.ext}" alt="${esc(book.title)}" style="max-width:100%;height:auto"/></div>`, L));
  }
  files["OEBPS/nav.xhtml"] = strToU8(xhtml(book.title, `<nav epub:type="toc"><h1>${esc(book.title)}</h1><ol>${ids.map((c) => `<li><a href="${c.href}">${esc(c.title)}</a></li>`).join("")}</ol></nav>`, L));
  const uuid = `urn:uuid:${book.id}`;
  files["OEBPS/content.opf"] = strToU8(`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">${uuid}</dc:identifier><dc:title>${esc(book.title)}</dc:title><dc:creator>${esc(book.author || "—")}</dc:creator><dc:language>${htmlLang(L)}</dc:language>${cover ? `<meta name="cover" content="cover-image"/>` : ""}<meta property="dcterms:modified">${new Date().toISOString().slice(0, 19)}Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>${cover ? `<item id="cover-image" href="cover.${cover.ext}" media-type="${cover.type}" properties="cover-image"/><item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>` : ""}${ids.map((c) => `<item id="${c.id}" href="${c.href}" media-type="application/xhtml+xml"/>`).join("")}</manifest><spine${isRtl(L) ? ' page-progression-direction="rtl"' : ""}>${cover ? `<itemref idref="cover"/>` : ""}${ids.map((c) => `<itemref idref="${c.id}"/>`).join("")}</spine></package>`);
  return zipSync(files as Parameters<typeof zipSync>[0]);
}
