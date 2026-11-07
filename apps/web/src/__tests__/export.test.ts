import { describe, expect, it } from "vitest";
import { toMarkdown } from "../export";
import type { Book, Item } from "../store";

const item = (o: Partial<Item> & { body: string }): Item => ({ id: crypto.randomUUID(), kind: "chapter", title: "", updated: 0, versions: [], ...o });
const mk = (items: Item[]): Book => ({ id: "b", title: "Kitap", author: "Yazar", created: 0, items, activeId: items[0]!.id });

describe("markdown dışa aktarma", () => {
  it("kısım başlığı, bölüm ve sahneler sırayla", () => {
    const md = toMarkdown(mk([
      item({ kind: "part", title: "Birinci Kısım", body: "" }),
      item({ body: "# Bir\n\nGiriş." }),
      item({ body: "Sahne bir.", level: 2 }),
      item({ body: "Sahne iki.", level: 2 }),
    ]));
    expect(md).toContain("# Birinci Kısım");
    expect(md).toContain("# Bir\n\nGiriş.\n\n* * *\n\nSahne bir.\n\n* * *\n\nSahne iki.");
  });
  it("bölüm yalnızca başlıksa ilk sahneden önce ayırıcı konmaz", () => {
    const md = toMarkdown(mk([item({ body: "# Bir" }), item({ body: "A.", level: 2 }), item({ body: "B.", level: 2 })]));
    expect(md).toContain("# Bir\n\nA.\n\n* * *\n\nB.");
  });
  it("çöpteki bölümler dışarı çıkmaz", () => {
    const md = toMarkdown(mk([item({ body: "# Kalır" }), item({ body: "# Gider", trashed: 1 })]));
    expect(md).toContain("Kalır");
    expect(md).not.toContain("Gider");
  });
});
