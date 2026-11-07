import { beforeEach, describe, expect, it } from "vitest";
import { hasScenes, live, useStore } from "../store";

const S = () => useStore.getState();
const book = () => S().books.find((b) => b.id === S().activeBookId)!;
const kinds = () => book().items.map((i) => (i.kind === "part" ? "K" : i.level === 2 ? "s" : "B"));

beforeEach(() => {
  useStore.setState({ books: [], activeBookId: null, driveTrash: [], deletedBooks: [] });
  S().addBook();
});

describe("structure: part › chapter › scene", () => {
  it("a scene is added after the active chapter (and its scenes)", () => {
    S().addItem("chapter"); // B B
    const first = book().items[0]!.id;
    S().setActive(first);
    S().addItem("scene"); // B s B
    S().addItem("scene"); // B s s B
    expect(kinds()).toEqual(["B", "s", "s", "B"]);
  });
  it("chapter ↔ scene conversion", () => {
    const id = book().items[0]!.id;
    S().setLevel(id, true);
    expect(book().items[0]!.level).toBe(2);
    S().setLevel(id, false);
    expect(book().items[0]!.level).toBeUndefined();
  });
  it("genre 'other' turns the scene level off; the default, novel, has it on", () => {
    expect(hasScenes(book())).toBe(true);
    S().updateBook(book().id, { genre: "diger" });
    expect(hasScenes(book())).toBe(false);
  });
});

describe("trash", () => {
  it("a chapter goes to the trash, is not deleted, and can be restored", () => {
    S().addItem("chapter");
    const id = book().items[1]!.id;
    S().trashItem(id);
    expect(book().items).toHaveLength(2);
    expect(live(book())).toHaveLength(1);
    S().restoreItem(id);
    expect(live(book())).toHaveLength(2);
  });
  it("if the last chapter is trashed, an empty chapter is opened", () => {
    S().trashItem(book().items[0]!.id);
    expect(live(book()).some((i) => i.kind === "chapter")).toBe(true);
  });
  it("emptying deletes permanently and queues a Drive trash job", () => {
    S().addItem("chapter");
    const id = book().items[1]!.id;
    S().patch((s) => ({ books: s.books.map((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, drive: { fileId: "F1", version: "1", hash: "h" } } : i)) })) }));
    S().trashItem(id);
    S().emptyItemTrash();
    expect(book().items.some((i) => i.id === id)).toBe(false);
    expect(S().driveTrash).toContain("F1");
  });
  it("a book goes to the trash and is hidden in the library; emptying deletes it", () => {
    const id = book().id;
    S().trashBook(id);
    expect(S().books.find((b) => b.id === id)?.trashed).toBeTruthy();
    expect(S().activeBookId).toBeNull();
    S().emptyBookTrash();
    expect(S().books.some((b) => b.id === id)).toBe(false);
  });
});
