import { beforeEach, describe, expect, it } from "vitest";
import { hasScenes, useStore } from "../store";
import { templates } from "../templates";

const S = () => useStore.getState();
beforeEach(() => useStore.setState({ books: [], activeBookId: null }));

describe("örnek şablonlar", () => {
  it("her şablonun en az bir bölümü var", () => {
    for (const t of templates) expect(t.items.some((i) => i.k === "chapter"), t.id).toBe(true);
  });
  it("sahne düzeyi yalnızca kurgu türlerinde kullanılır", () => {
    for (const t of templates) if (t.items.some((i) => i.k === "scene")) expect(hasScenes({ genre: t.genre }), t.id).toBe(true);
  });
  it("sahne her zaman bir bölümden sonra gelir", () => {
    for (const t of templates) t.items.forEach((it, n) => { if (it.k === "scene") expect(t.items.slice(0, n).some((x) => x.k === "chapter"), t.id).toBe(true); });
  });
  it("roman şablonu kısım, bölüm ve sahneleri kurar", () => {
    const id = S().addBook("roman-uc-perde");
    const b = S().books.find((x) => x.id === id)!;
    expect(b.genre).toBe("roman");
    expect(b.template).toBe("roman-uc-perde");
    expect(b.items.filter((i) => i.kind === "part")).toHaveLength(3);
    expect(b.items.filter((i) => i.level === 2).length).toBeGreaterThan(0);
    expect(b.items.find((i) => i.id === b.activeId)?.kind).toBe("chapter");
  });
  it("boş şablon tek bölüm", () => {
    const id = S().addBook("bos");
    const b = S().books.find((x) => x.id === id)!;
    expect(b.items).toHaveLength(1);
  });
});
