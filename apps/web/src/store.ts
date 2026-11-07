import { get, set } from "idb-keyval";
import { create } from "zustand";
import type { BookLang } from "./languages";
import { type MediaRef, delBlob, newRef, putBlob, prepareCover } from "./media";
import { templateById } from "./templates";

export type Theme = "light" | "dark" | "sepia" | "green" | "pink" | "night" | "custom";
import { type Lang, detectUiLang, isUiLang } from "./i18n";
export type { Lang };

export interface Version { t: number; body: string; label?: string }
export interface Item {
  id: string;
  kind: "part" | "chapter";
  title: string; // kısım adı; bölümlerde "__conflict__" = çakışan kopya işareti, aksi halde boş
  body: string;
  updated: number;
  versions: Version[];
  /** Sunucudaki son bilinen sıra numarası; tanımsızsa hiç eşitlenmedi. */
  seq?: number;
  dirty?: boolean;
  /** Google Drive'daki dosya bağı (yalnızca Drive bağlıysa). */
  drive?: DriveLink;
  /** Çöp kutusuna atıldığı an; tanımlıysa bölüm gizlenir ama silinmez (kullanıcı "boşalt" diyene kadar). */
  trashed?: number;
  /** 2 = sahne (bir bölümün altında); tanımsız = bölüm. Sahne de bir belgedir (kind "chapter"). */
  level?: 2;
  /** Bölümün seslendirmesi (tek dosya). */
  audio?: MediaRef;
}
export interface DriveLink { fileId: string; version: string; hash: string }
export const CONFLICT = "__conflict__";
/** Eşitlenmemiş değişiklik var mı? (eski kayıtlarda alan yoksa: hiç eşitlenmemişse evet) */
export const isDirty = (i: Item) => i.dirty ?? i.seq === undefined;
export type Genre = "roman" | "novella" | "hikaye" | "diger";
/** Sahne düzeyi yalnızca kurgu türlerinde var (roman, novella, hikâye). Diğer türlerin yapısı sonra tür modülleriyle gelecek. */
export const hasScenes = (b: Pick<Book, "genre">) => (b.genre ?? "roman") !== "diger";
export interface Book {
  id: string;
  genre?: Genre;
  /** Yazı dili (yön, yazım denetimi, dışa aktarma). Tanımsızsa arayüz dili. */
  lang?: BookLang;
  /** Hangi örnek şablondan başlatıldı (templates.ts). */
  template?: string;
  title: string;
  author: string;
  created: number;
  items: Item[];
  activeId: string;
  /** Eşitleme durumu (hesap açıkken). */
  remote?: boolean;
  cursor?: number;
  metaDirty?: boolean;
  orderDirty?: boolean;
  removed?: { id: string; seq: number }[];
  /** Google Drive'daki kitap klasörü ve kitap.json bilgisi. metaHash tanımsızsa: Drive'daki künye benimsenir. */
  drive?: { folderId: string; metaFileId?: string; metaVersion?: string; metaHash?: string };
  /** Çöp kutusuna atıldığı an (kitap kitaplıkta gizlenir, silinmez). */
  trashed?: number;
  cover?: MediaRef;
}
/** Çöpte olmayan bölümler ve kısımlar. */
export const live = (b: Book): Item[] => b.items.filter((i) => !i.trashed);
interface Settings { theme: Theme; lang: Lang; focus: boolean; typewriter: boolean; dailyGoal: number; fontSize: number; customBg: string; customInk: string }
interface Daily { date: string; words: number }

interface Persisted { books: Book[]; activeBookId: string | null; settings: Settings; daily: Daily; deletedBooks?: string[]; owner?: string | null; driveTrash?: string[] }
export type SyncStatus = "off" | "idle" | "syncing" | "error" | "offline";
export interface Account { id: string; name: string }
interface State extends Persisted {
  ready: boolean;
  saving: boolean;
  account: Account | null;
  sync: { status: SyncStatus; last: number | null };
  remoteTick: number;
  patch(fn: (s: State) => Partial<State>): void;
  setAccount(a: Account | null): void;
  init(): Promise<void>;
  openBook(id: string | null): void;
  addBook(templateId?: string): string;
  updateBook(id: string, patch: Partial<Pick<Book, "title" | "author" | "genre" | "lang">>): void;
  setCover(bookId: string, file: File): Promise<void>;
  removeCover(bookId: string): void;
  setAudio(itemId: string, file: File): Promise<void>;
  removeAudio(itemId: string): void;
  trashBook(id: string): void;
  restoreBook(id: string): void;
  purgeBook(id: string): void;
  emptyBookTrash(): void;
  setActive(itemId: string): void;
  addItem(kind: "part" | "chapter" | "scene"): void;
  renameItem(id: string, title: string): void;
  setLevel(id: string, scene: boolean): void;
  trashItem(id: string): void;
  restoreItem(id: string): void;
  purgeItem(id: string): void;
  emptyItemTrash(): void;
  moveItem(id: string, beforeId: string | null): void;
  setBody(id: string, body: string): void;
  snapshot(id: string, label?: string): void;
  restore(id: string, v: Version): void;
  setSettings(patch: Partial<Settings>): void;
}

const KEY = "publishify:library:v2";
const OLD_KEY = "publishify:book:v1";
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();

export const wordCount = (s: string) => (s.trim() === "" ? 0 : s.trim().split(/\s+/).length);

export function titleOf(i: Item, fallback: string): string {
  if (i.kind === "part") return i.title || fallback;
  const line = i.body.split("\n").find((l) => l.trim() !== "") ?? "";
  return line.replace(/^#+\s*/, "").trim() || fallback;
}

const mkItem = (kind: Item["kind"], title = "", body = ""): Item => ({ id: uid(), kind, title, body, updated: Date.now(), versions: [], dirty: true });
const mkBook = (title: string, lang: Lang): Book => {
  const c = mkItem("chapter", "", lang === "tr" ? "# Birinci bölüm\n\nYazmaya başla." : "# Chapter one\n\nStart writing.");
  return { id: uid(), title, author: "", genre: "roman", created: Date.now(), items: [c], activeId: c.id, metaDirty: true, orderDirty: true };
};

const defaults: Persisted = {
  books: [], activeBookId: null, deletedBooks: [], owner: null, driveTrash: [], daily: { date: today(), words: 0 },
  settings: {
    theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    lang: detectUiLang(navigator.language), focus: false, typewriter: false, dailyGoal: 500, fontSize: 20, customBg: "#F4F0FF", customInk: "#1C1530",
  },
};

let timer = 0;
function persist(get_: () => State, set_: (p: Partial<State>) => void) {
  set_({ saving: true });
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    const { books, activeBookId, settings, daily, deletedBooks, owner, driveTrash } = get_();
    void set(KEY, { books, activeBookId, settings, daily, deletedBooks, owner, driveTrash } satisfies Persisted)
      .catch(() => undefined)
      .then(() => set_({ saving: false }));
  }, 400);
}

export const useStore = create<State>((setS, getS) => {
  const mutate = (fn: (s: State) => Partial<State>) => {
    setS(fn(getS()));
    persist(getS, setS);
  };
  const withBook = (fn: (b: Book) => Book) =>
    mutate((s) => ({ books: s.books.map((b) => (b.id === s.activeBookId ? fn(b) : b)) }));

  return {
    ...defaults, ready: false, saving: false, account: null, sync: { status: "off", last: null }, remoteTick: 0,
    patch: (fn) => mutate(fn),
    setAccount: (account) => setS({ account, sync: { status: account ? "idle" : "off", last: null } }),
    async init() {
      let saved: Persisted | undefined;
      try {
        saved = await get<Persisted>(KEY);
        if (!saved) {
          // v1 (tek bölümlü) kayıtları yeni kitaplığa taşı
          const old = await get<{ chapters: { id: string; body: string; updated: number }[]; activeId: string }>(OLD_KEY);
          if (old?.chapters.length) {
            const items = old.chapters.map((c) => ({ ...mkItem("chapter", "", c.body), id: c.id, updated: c.updated }));
            const book: Book = { id: uid(), title: "İlk kitabım", author: "", created: Date.now(), items, activeId: old.activeId };
            saved = { ...defaults, books: [book] };
          }
        }
      } catch { /* IndexedDB kapalı */ }
      const s = saved ?? defaults;
      setS({ ...s, deletedBooks: s.deletedBooks ?? [], owner: s.owner ?? null, driveTrash: s.driveTrash ?? [], settings: { ...defaults.settings, ...s.settings, lang: isUiLang(s.settings?.lang) ? s.settings.lang : defaults.settings.lang }, daily: s.daily.date === today() ? s.daily : { date: today(), words: 0 }, ready: true });
    },
    openBook: (id) => mutate(() => ({ activeBookId: id })),
    addBook(templateId) {
      const lang = getS().settings.lang;
      const b = mkBook(t0(lang), lang);
      const tpl = templateId && templateId !== "bos" ? templateById(templateId) : undefined;
      if (tpl) {
        const li = lang === "tr" ? 0 : 1;
        const items = tpl.items.map((sp): Item =>
          sp.k === "part" ? mkItem("part", sp.t[li])
          : sp.k === "scene" ? { ...mkItem("chapter", "", ""), level: 2 }
          : mkItem("chapter", "", `# ${sp.t[li]}\n\n`));
        b.items = items;
        b.genre = tpl.genre;
        b.template = tpl.id;
        b.activeId = items.find((i) => i.kind === "chapter")?.id ?? "";
      }
      mutate((s) => ({ books: [b, ...s.books], activeBookId: b.id }));
      return b.id;
    },
    updateBook: (id, patch) => mutate((s) => ({ books: s.books.map((b) => (b.id === id ? { ...b, ...patch, metaDirty: true } : b)) })),
    async setCover(bookId, file) {
      const blob = await prepareCover(file);
      const ref = newRef(blob, `kapak.${blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg"}`, { up: true });
      await putBlob(ref.id, blob);
      mutate((s) => ({
        books: s.books.map((b) => {
          if (b.id !== bookId) return b;
          if (b.cover) void delBlob(b.cover.id);
          // Drive'da zaten bir kapak varsa aynı dosya yerinde güncellenir.
          return { ...b, cover: { ...ref, ...(b.cover?.drive ? { drive: b.cover.drive } : {}) } };
        }),
      }));
    },
    removeCover: (bookId) => mutate((s) => {
      const b = s.books.find((x) => x.id === bookId);
      if (b?.cover) void delBlob(b.cover.id);
      return { books: s.books.map((x) => (x.id === bookId ? { ...x, cover: undefined } : x)), driveTrash: b?.cover?.drive ? [...(s.driveTrash ?? []), b.cover.drive.fileId] : s.driveTrash };
    }),
    async setAudio(itemId, file) {
      const ref = newRef(file, file.name, { up: true });
      await putBlob(ref.id, file);
      mutate((s) => ({
        books: s.books.map((b) => (b.id !== s.activeBookId ? b : { ...b, items: b.items.map((i) => {
          if (i.id !== itemId) return i;
          if (i.audio) void delBlob(i.audio.id);
          return { ...i, audio: { ...ref, ...(i.audio?.drive ? { drive: i.audio.drive } : {}) } };
        }) })),
      }));
    },
    removeAudio: (itemId) => mutate((s) => {
      const b = s.books.find((x) => x.id === s.activeBookId);
      const it = b?.items.find((i) => i.id === itemId);
      if (it?.audio) void delBlob(it.audio.id);
      return {
        books: s.books.map((x) => (x.id !== b?.id ? x : { ...x, items: x.items.map((i) => (i.id === itemId ? { ...i, audio: undefined } : i)) })),
        driveTrash: it?.audio?.drive ? [...(s.driveTrash ?? []), it.audio.drive.fileId] : s.driveTrash,
      };
    }),
    trashBook: (id) => mutate((s) => ({ books: s.books.map((b) => (b.id === id ? { ...b, trashed: Date.now() } : b)), activeBookId: s.activeBookId === id ? null : s.activeBookId })),
    restoreBook: (id) => mutate((s) => ({ books: s.books.map((b) => (b.id === id ? { ...b, trashed: undefined } : b)) })),
    purgeBook: (id) => mutate((s) => purgeBooks(s, [id])),
    emptyBookTrash: () => mutate((s) => purgeBooks(s, s.books.filter((b) => b.trashed).map((b) => b.id))),
    setActive: (itemId) => withBook((b) => ({ ...b, activeId: itemId })),
    addItem(kind) {
      const lang = getS().settings.lang;
      const it: Item =
        kind === "part" ? mkItem("part", lang === "tr" ? "Yeni kısım" : "New part")
        : kind === "scene" ? { ...mkItem("chapter", "", ""), level: 2 }
        : mkItem("chapter", "", lang === "tr" ? "# Yeni bölüm\n\n" : "# New chapter\n\n");
      withBook((b) => {
        let items = [...b.items, it];
        if (kind === "scene") {
          // Sahne, etkin bölümün (ve sahnelerinin) hemen arkasına eklenir.
          const idx = b.items.findIndex((i) => i.id === b.activeId);
          let at = idx < 0 ? b.items.length : idx + 1;
          while (at < b.items.length && b.items[at]!.level === 2) at++;
          items = [...b.items.slice(0, at), it, ...b.items.slice(at)];
        }
        return { ...b, items, orderDirty: true, activeId: kind !== "part" ? it.id : b.activeId };
      });
    },
    setLevel: (id, scene) => withBook((b) => ({ ...b, items: b.items.map((i) => (i.id === id && i.kind === "chapter" ? { ...i, level: scene ? 2 : undefined, dirty: true } : i)), orderDirty: true })),
    renameItem: (id, title) => withBook((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, title, dirty: true } : i)) })),
    trashItem: (id) =>
      withBook((b) => {
        const items = b.items.map((i) => (i.id === id ? { ...i, trashed: Date.now() } : i));
        if (!items.some((i) => i.kind === "chapter" && !i.trashed)) items.push(mkItem("chapter", "", "# \n\n"));
        return { ...b, items, activeId: validActive(items, b.activeId), orderDirty: true };
      }),
    restoreItem: (id) => withBook((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, trashed: undefined } : i)), orderDirty: true })),
    purgeItem: (id) => mutate((s) => purgeItems(s, [id])),
    emptyItemTrash: () =>
      mutate((s) => {
        const b = s.books.find((x) => x.id === s.activeBookId);
        return b ? purgeItems(s, b.items.filter((i) => i.trashed).map((i) => i.id)) : {};
      }),
    moveItem: (id, beforeId) =>
      withBook((b) => {
        const it = b.items.find((i) => i.id === id);
        if (!it || id === beforeId) return b;
        const rest = b.items.filter((i) => i.id !== id);
        const at = beforeId === null ? rest.length : rest.findIndex((i) => i.id === beforeId);
        rest.splice(at < 0 ? rest.length : at, 0, it);
        return { ...b, items: rest, orderDirty: true };
      }),
    setBody(id, body) {
      const s = getS();
      const book = s.books.find((b) => b.id === s.activeBookId);
      const cur = book?.items.find((i) => i.id === id);
      if (!cur || cur.body === body) return;
      const delta = wordCount(body) - wordCount(cur.body);
      const now = Date.now();
      const last = cur.versions[0]?.t ?? 0;
      const versions = now - last > 5 * 60_000 && cur.body.trim() !== "" ? [{ t: now, body: cur.body }, ...cur.versions].slice(0, 40) : cur.versions;
      const daily = { date: today(), words: Math.max(0, (s.daily.date === today() ? s.daily.words : 0) + delta) };
      mutate(() => ({
        daily,
        books: s.books.map((b) => (b.id === s.activeBookId ? { ...b, items: b.items.map((i) => (i.id === id ? { ...i, body, updated: now, versions, dirty: true } : i)) } : b)),
      }));
    },
    snapshot: (id, label) =>
      withBook((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, versions: [{ t: Date.now(), body: i.body, label }, ...i.versions].slice(0, 40) } : i)) })),
    restore: (id, v) =>
      withBook((b) => ({
        ...b,
        items: b.items.map((i) => (i.id === id ? { ...i, body: v.body, updated: Date.now(), dirty: true, versions: [{ t: Date.now(), body: i.body, label: "restore" }, ...i.versions].slice(0, 40) } : i)),
      })),
    setSettings: (patch) => mutate((s) => ({ settings: { ...s.settings, ...patch } })),
  };
});

const validActive = (items: Item[], activeId: string) =>
  items.some((i) => i.id === activeId && i.kind === "chapter" && !i.trashed) ? activeId : (items.find((i) => i.kind === "chapter" && !i.trashed)?.id ?? "");

/** Kalıcı silme: sunucuya silme bilgisi gider, Drive dosyaları Drive çöp kutusuna taşınır. */
function purgeItems(s: State, ids: string[]): Partial<State> {
  const b = s.books.find((x) => x.id === s.activeBookId);
  if (!b || !ids.length) return {};
  const gone = b.items.filter((i) => ids.includes(i.id));
  for (const i of gone) if (i.audio) void delBlob(i.audio.id);
  const removed = [...(b.removed ?? []), ...gone.filter((i) => i.seq !== undefined).map((i) => ({ id: i.id, seq: i.seq! }))];
  const items = b.items.filter((i) => !ids.includes(i.id));
  if (!items.some((i) => i.kind === "chapter" && !i.trashed)) items.push(mkItem("chapter", "", "# \n\n"));
  return {
    books: s.books.map((x) => (x.id === b.id ? { ...b, items, activeId: validActive(items, b.activeId), removed, orderDirty: true } : x)),
    driveTrash: [...(s.driveTrash ?? []), ...gone.flatMap((i) => [...(i.drive ? [i.drive.fileId] : []), ...(i.audio?.drive ? [i.audio.drive.fileId] : [])])],
  };
}
function purgeBooks(s: State, ids: string[]): Partial<State> {
  const gone = s.books.filter((b) => ids.includes(b.id));
  for (const b of gone) { if (b.cover) void delBlob(b.cover.id); for (const i of b.items) if (i.audio) void delBlob(i.audio.id); }
  return {
    books: s.books.filter((b) => !ids.includes(b.id)),
    activeBookId: s.activeBookId && ids.includes(s.activeBookId) ? null : s.activeBookId,
    deletedBooks: [...(s.deletedBooks ?? []), ...gone.filter((b) => b.remote).map((b) => b.id)],
    // Drive'daki klasör kalıcı silinmez, Drive çöp kutusuna taşınır (30 gün geri alınabilir).
    driveTrash: [...(s.driveTrash ?? []), ...gone.flatMap((b) => (b.drive ? [b.drive.folderId] : []))],
  };
}

const t0 = (lang: Lang) => (lang === "tr" ? "Adsız kitap" : "Untitled book");
export const activeBook = (s: State) => s.books.find((b) => b.id === s.activeBookId);
