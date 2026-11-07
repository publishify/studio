import { beforeEach, describe, expect, it } from "vitest";
import { hasScenes, useStore } from "../store";
import { templates } from "../templates";

const S = () => useStore.getState();
beforeEach(() => useStore.setState({ books: [], activeBookId: null }));

describe("example templates", () => {
  it("every template has at least one chapter", () => {
    for (const t of templates) expect(t.items.some((i) => i.k === "chapter"), t.id).toBe(true);
  });
  it("the scene level is used only in fiction genres", () => {
    for (const t of templates) if (t.items.some((i) => i.k === "scene")) expect(hasScenes({ genre: t.genre }), t.id).toBe(true);
  });
  it("a scene always comes after a chapter", () => {
    for (const t of templates) t.items.forEach((it, n) => { if (it.k === "scene") expect(t.items.slice(0, n).some((x) => x.k === "chapter"), t.id).toBe(true); });
  });
  it("the novel template sets up parts, chapters and scenes", () => {
    const id = S().addBook("roman-uc-perde");
    const b = S().books.find((x) => x.id === id)!;
    expect(b.genre).toBe("roman");
    expect(b.template).toBe("roman-uc-perde");
    expect(b.items.filter((i) => i.kind === "part")).toHaveLength(3);
    expect(b.items.filter((i) => i.level === 2).length).toBeGreaterThan(0);
    expect(b.items.find((i) => i.id === b.activeId)?.kind).toBe("chapter");
  });
  it("the blank template is a single chapter", () => {
    const id = S().addBook("bos");
    const b = S().books.find((x) => x.id === id)!;
    expect(b.items).toHaveLength(1);
  });
});
