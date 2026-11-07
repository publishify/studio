import { beforeEach, describe, expect, it } from "vitest";
import { hasScenes, live, useStore } from "../store";

const S = () => useStore.getState();
const book = () => S().books.find((b) => b.id === S().activeBookId)!;
const kinds = () => book().items.map((i) => (i.kind === "part" ? "K" : i.level === 2 ? "s" : "B"));

beforeEach(() => {
  useStore.setState({ books: [], activeBookId: null, driveTrash: [], deletedBooks: [] });
  S().addBook();
});

describe("yapı: kısım › bölüm › sahne", () => {
  it("sahne, etkin bölümün (ve sahnelerinin) arkasına eklenir", () => {
    S().addItem("chapter"); // B B
    const first = book().items[0]!.id;
    S().setActive(first);
    S().addItem("scene"); // B s B
    S().addItem("scene"); // B s s B
    expect(kinds()).toEqual(["B", "s", "s", "B"]);
  });
  it("bölüm ↔ sahne dönüştürme", () => {
    const id = book().items[0]!.id;
    S().setLevel(id, true);
    expect(book().items[0]!.level).toBe(2);
    S().setLevel(id, false);
    expect(book().items[0]!.level).toBeUndefined();
  });
  it("tür 'diğer' sahne düzeyini kapatır, varsayılan roman açıktır", () => {
    expect(hasScenes(book())).toBe(true);
    S().updateBook(book().id, { genre: "diger" });
    expect(hasScenes(book())).toBe(false);
  });
});

describe("çöp kutusu", () => {
  it("bölüm çöpe gider, silinmez; geri alınır", () => {
    S().addItem("chapter");
    const id = book().items[1]!.id;
    S().trashItem(id);
    expect(book().items).toHaveLength(2);
    expect(live(book())).toHaveLength(1);
    S().restoreItem(id);
    expect(live(book())).toHaveLength(2);
  });
  it("son bölüm çöpe atılırsa boş bir bölüm açılır", () => {
    S().trashItem(book().items[0]!.id);
    expect(live(book()).some((i) => i.kind === "chapter")).toBe(true);
  });
  it("boşaltınca kalıcı silinir ve Drive çöpüne iş kuyruğu eklenir", () => {
    S().addItem("chapter");
    const id = book().items[1]!.id;
    S().patch((s) => ({ books: s.books.map((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, drive: { fileId: "F1", version: "1", hash: "h" } } : i)) })) }));
    S().trashItem(id);
    S().emptyItemTrash();
    expect(book().items.some((i) => i.id === id)).toBe(false);
    expect(S().driveTrash).toContain("F1");
  });
  it("kitap çöpe gider, kitaplıkta gizlenir; boşaltınca silinir", () => {
    const id = book().id;
    S().trashBook(id);
    expect(S().books.find((b) => b.id === id)?.trashed).toBeTruthy();
    expect(S().activeBookId).toBeNull();
    S().emptyBookTrash();
    expect(S().books.some((b) => b.id === id)).toBe(false);
  });
});
