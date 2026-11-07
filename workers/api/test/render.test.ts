import { describe, expect, it } from "vitest";
import { isRtl, langCodes, page, renderMarkdown, slugify } from "../src/render";

describe("güvenli Markdown", () => {
  it("ham HTML ve script metne çevrilir", () => {
    const out = renderMarkdown("merhaba <script>alert(1)</script> dünya <img src=x onerror=alert(1)>");
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/<img[^>]*onerror/i);
    expect(out).toContain("&lt;script&gt;");
  });
  it("javascript: ve data: bağlantıları kaldırılır, https kalır", () => {
    expect(renderMarkdown("[x](javascript:alert(1))")).not.toMatch(/href/i);
    expect(renderMarkdown("[x](data:text/html,<b>)")).not.toMatch(/href/i);
    expect(renderMarkdown("[x](https://example.com)")).toContain('href="https://example.com"');
    expect(renderMarkdown("[x](https://example.com)")).toContain('rel="nofollow ugc noopener"');
  });
  it("yalnızca https görsellere izin verilir", () => {
    expect(renderMarkdown("![a](http://e.com/a.png)")).not.toMatch(/<img/);
    expect(renderMarkdown("![a](javascript:1)")).not.toMatch(/<img/);
    expect(renderMarkdown("![a](https://e.com/a.png)")).toMatch(/<img src="https:\/\/e.com\/a.png"/);
  });
  it("satır sonları korunur (şiir)", () => expect(renderMarkdown("bir\niki")).toContain("<br"));
  it("sayfa şablonunda başlık ve açıklama kaçırılır", () => {
    const h = page({ title: 'a"<b>', description: "<x>", canonical: "https://x/k/a", lang: "tr", body: "" });
    expect(h).not.toContain("<b>");
    expect(h).toContain("&lt;b&gt;");
  });
  it("JSON-LD içinde '<' kaçırılır", () => {
    const h = page({ title: "t", description: "d", canonical: "https://x", lang: "tr", body: "", jsonLd: { name: "</script><script>alert(1)</script>" } });
    expect(h.match(/<script/g)).toHaveLength(1);
  });
});

describe("dil ve yön", () => {
  it("sağdan sola diller", () => {
    for (const l of ["ar", "ota"]) expect(isRtl(l), l).toBe(true);
    for (const l of ["tr", "en", "ku", "zza"]) expect(isRtl(l), l).toBe(false);
  });
  it("RTL sayfa dir=rtl alır, Osmanlıca ota-Arab", () => {
    expect(page({ title: "t", description: "d", canonical: "https://x", lang: "ar", body: "" })).toContain('dir="rtl"');
    expect(page({ title: "t", description: "d", canonical: "https://x", lang: "ota", body: "" })).toContain('lang="ota-Arab"');
  });
  it("yalnızca seçilen diller tanımlı", () => expect([...langCodes].sort()).toEqual(["ar", "en", "ku", "ota", "tr", "zza"]));
});

describe("slug", () => {
  it("Türkçe karakterler sadeleşir", () => expect(slugify("Şu Çılgın Türkler: İkinci Kitap!")).toBe("su-cilgin-turkler-ikinci-kitap"));
  it("boş ve sembol girdisi boş döner", () => expect(slugify("!!!")).toBe(""));
});

import { readingMinutes, schemaType, shareLinks } from "../src/render";
describe("paylaşma ve yayın türü", () => {
  it("paylaşma bağlantıları kaçırılır ve JavaScript içermez", () => {
    const h = shareLinks("https://publishify.app/k/a?x=1&y=<2>", 'Başlık "x" <b>', "tr");
    expect(h).not.toMatch(/<b>/);
    expect(h).not.toMatch(/javascript:/i);
    expect(h).toContain("wa.me");
    expect(h).toContain("Paylaş");
    expect(shareLinks("https://x", "t", "ar")).toContain("Share");
  });
  it("schema.org türleri", () => {
    expect(schemaType("roman")).toBe("Book");
    expect(schemaType("blog")).toBe("BlogPosting");
    expect(schemaType("makale")).toBe("ScholarlyArticle");
    expect(schemaType("deneme")).toBe("Article");
  });
  it("okuma süresi en az 1 dk", () => {
    expect(readingMinutes("kısa")).toBe(1);
    expect(readingMinutes(Array(1000).fill("kelime").join(" "))).toBe(5);
  });
});
