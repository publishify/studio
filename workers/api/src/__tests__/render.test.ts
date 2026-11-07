import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../render";

describe("publication page links", () => {
  it("links starting with // (protocol-relative, external) are removed; their text stays", () => {
    const html = renderMarkdown("[tıkla](//baska-site.com)");
    expect(html).not.toContain("<a ");
    expect(html).toContain("tıkla");
  });
  it("root paths, https and mailto are kept; javascript: is removed", () => {
    expect(renderMarkdown("[a](/k/x)")).toContain('href="/k/x"');
    expect(renderMarkdown("[a](https://example.com)")).toContain("https://example.com");
    expect(renderMarkdown("[a](mailto:a@b.co)")).toContain("mailto:a@b.co");
    expect(renderMarkdown("[a](javascript:alert(1))")).not.toContain("<a ");
  });
});
