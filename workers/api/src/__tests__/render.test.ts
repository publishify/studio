import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../render";

describe("yayın sayfası bağlantıları", () => {
  it("// ile başlayan (protokolsüz dış) bağlantı kaldırılır, metni kalır", () => {
    const html = renderMarkdown("[tıkla](//baska-site.com)");
    expect(html).not.toContain("<a ");
    expect(html).toContain("tıkla");
  });
  it("kök yolu, https ve mailto korunur; javascript: kaldırılır", () => {
    expect(renderMarkdown("[a](/k/x)")).toContain('href="/k/x"');
    expect(renderMarkdown("[a](https://example.com)")).toContain("https://example.com");
    expect(renderMarkdown("[a](mailto:a@b.co)")).toContain("mailto:a@b.co");
    expect(renderMarkdown("[a](javascript:alert(1))")).not.toContain("<a ");
  });
});
