import { type BookLang, isBookLang } from "./languages";
import { type Book, type Genre, type Item, isDirty, useStore } from "./store";

interface OutItem { id: string; kind: "part" | "chapter" | "scene"; title: string; body: string; deleted: boolean; seq: number }
interface SyncOut {
  cursor: number;
  items: OutItem[];
  order: string[] | null;
  meta: { title: string; author: string; genre?: Genre; lang?: BookLang } | null;
  accepted: Record<string, number>;
  conflicts: { id: string; copyId: string }[];
}

let running = false;
let rerun = false;
let timer = 0;

export const api = async <T>(path: string, init?: { method?: string; body?: unknown }): Promise<{ status: number; data: T }> => {
  const r = await fetch(`/api${path}`, {
    method: init?.method ?? (init?.body === undefined ? "GET" : "POST"),
    headers: init?.body === undefined ? undefined : { "content-type": "application/json" },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: "same-origin",
  });
  return { status: r.status, data: (await r.json().catch(() => ({}))) as T };
};

export async function refreshAccount(): Promise<void> {
  try {
    const { data } = await api<{ user: { id: string; name: string } | null }>("/me");
    const st = useStore.getState();
    if (data.user) {
      st.setAccount(data.user);
      // If another account's data is on this device, local books are uploaded to the new account as new books.
      if (st.owner && st.owner !== data.user.id) {
        st.patch((s) => ({ books: s.books.map(detach), deletedBooks: [], owner: data.user!.id }));
      } else if (!st.owner) {
        st.patch(() => ({ owner: data.user!.id }));
      }
      scheduleSync(0);
    } else if (st.account) {
      st.setAccount(null);
    }
  } catch {
    /* offline: keep working locally */
  }
}

const detach = (b: Book): Book => ({
  ...b, remote: false, cursor: 0, metaDirty: true, orderDirty: true, removed: [],
  items: b.items.map((i) => ({ ...i, seq: undefined, dirty: true })),
});

export function hasPending(): boolean {
  const s = useStore.getState();
  if ((s.deletedBooks ?? []).length) return true;
  return s.books.some((b) => !b.remote || b.metaDirty || b.orderDirty || (b.removed?.length ?? 0) > 0 || b.items.some(isDirty));
}

export function scheduleSync(delay = 2500): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => void syncAll(), delay);
}

export async function syncAll(): Promise<void> {
  const st = useStore.getState();
  if (!st.account) return;
  if (running) { rerun = true; return; }
  if (!navigator.onLine) { st.patch(() => ({ sync: { status: "offline", last: useStore.getState().sync.last } })); return; }
  running = true;
  useStore.setState({ sync: { status: "syncing", last: st.sync.last } });
  try {
    // 1) remove from the server the books deleted on another device/here
    for (const id of useStore.getState().deletedBooks ?? []) {
      const r = await api(`/books/${id}`, { method: "DELETE" });
      if (r.status === 401) throw new Error("auth");
      if (r.status === 200) useStore.getState().patch((s) => ({ deletedBooks: (s.deletedBooks ?? []).filter((x) => x !== id) }));
    }
    // 2) fetch books that are on the server but not here
    const list = await api<{ books: { id: string; title: string; author: string }[] }>("/books");
    if (list.status === 401) throw new Error("auth");
    const known = new Set(useStore.getState().books.map((b) => b.id));
    const pendingDelete = new Set(useStore.getState().deletedBooks ?? []);
    const fresh = (list.data.books ?? []).filter((b) => !known.has(b.id) && !pendingDelete.has(b.id));
    if (fresh.length) {
      useStore.getState().patch((s) => ({
        books: [...s.books, ...fresh.map((b): Book => ({ id: b.id, title: b.title, author: b.author, created: Date.now(), items: [], activeId: "", remote: true, cursor: 0 }))],
      }));
    }
    // 3) sync each book
    for (const b of useStore.getState().books) await syncBook(b.id);
    useStore.setState({ sync: { status: "idle", last: Date.now() } });
  } catch (e) {
    const auth = e instanceof Error && e.message === "auth";
    if (auth) useStore.getState().setAccount(null);
    else useStore.setState((s) => ({ sync: { status: navigator.onLine ? "error" : "offline", last: s.sync.last } }));
  } finally {
    running = false;
    if (rerun) { rerun = false; scheduleSync(500); }
  }
}

async function syncBook(bookId: string): Promise<void> {
  const book = useStore.getState().books.find((b) => b.id === bookId);
  if (!book) return;
  const first = !book.remote;
  const pushed = new Map<string, { body: string; title: string }>();
  const items = book.items.filter(isDirty).map((i) => {
    pushed.set(i.id, { body: i.body, title: i.title });
    return { id: i.id, kind: (i.level === 2 ? "scene" : i.kind) as "part" | "chapter" | "scene", title: i.title, body: i.body, baseSeq: i.seq ?? 0 };
  });
  for (const r of book.removed ?? []) items.push({ id: r.id, kind: "chapter", title: "", body: "", baseSeq: r.seq, deleted: true } as (typeof items)[number]);
  const sendMeta = first || !!book.metaDirty;
  const sendOrder = first || !!book.orderDirty;
  const sentOrder = book.items.map((i) => i.id);
  const sentMeta = { title: book.title, author: book.author, ...(book.genre ? { genre: book.genre } : {}), ...(isBookLang(book.lang) ? { lang: book.lang } : {}) };

  const res = await api<SyncOut>(`/books/${bookId}/sync`, {
    body: { cursor: book.cursor ?? 0, ...(sendMeta ? { meta: sentMeta } : {}), ...(sendOrder ? { order: sentOrder } : {}), items },
  });
  if (res.status === 401) throw new Error("auth");
  if (res.status === 410) return; // book deleted on another device: the local copy is not deleted
  if (res.status !== 200) throw new Error("sync");
  const out = res.data;
  const conflictIds = new Set(out.conflicts.map((c) => c.id));

  useStore.getState().patch((s) => {
    let activeChanged = false;
    const books = s.books.map((b): Book => {
      if (b.id !== bookId) return b;
      let list = b.items.slice();

      // result of what we sent
      list = list.map((i) => {
        const p = pushed.get(i.id);
        if (!p || out.accepted[i.id] === undefined) return i;
        const same = i.body === p.body && i.title === p.title;
        return { ...i, seq: out.accepted[i.id], dirty: same ? false : true };
      });

      // sunucudan gelenler
      for (const inc of out.items) {
        const idx = list.findIndex((x) => x.id === inc.id);
        const local = idx >= 0 ? list[idx] : undefined;
        if (inc.deleted) {
          if (local && !isDirty(local)) { list.splice(idx, 1); if (b.activeId === inc.id) activeChanged = true; }
          continue;
        }
        const wasPushed = pushed.get(inc.id);
        const replaceable = !local || !isDirty(local) || (conflictIds.has(inc.id) && wasPushed && local.body === wasPushed.body);
        if (!replaceable) continue;
        const next: Item = {
          id: inc.id, kind: inc.kind === "scene" ? "chapter" : inc.kind, level: inc.kind === "scene" ? 2 : undefined, title: inc.title, body: inc.body, updated: Date.now(), seq: inc.seq, dirty: false, drive: local?.drive, trashed: local?.trashed, audio: local?.audio,
          versions: local ? (local.body !== inc.body && local.body.trim() ? [{ t: Date.now(), body: local.body, label: "sync" }, ...local.versions].slice(0, 40) : local.versions) : [],
        };
        if (local) { list[idx] = next; if (b.activeId === inc.id && local.body !== inc.body) activeChanged = true; }
        else list.push(next);
      }

      // order
      if (out.order && !b.orderDirty) {
        const pos = new Map(out.order.map((id, n) => [id, n] as const));
        list.sort((a, c) => (pos.get(a.id) ?? 1e9) - (pos.get(c.id) ?? 1e9));
      }
      // keep at least one chapter and keep the active chapter valid
      if (!list.some((i) => i.kind === "chapter" && !i.trashed)) list.push({ id: crypto.randomUUID(), kind: "chapter", title: "", body: "# \n\n", updated: Date.now(), versions: [], dirty: true });
      const activeId = list.some((i) => i.id === b.activeId && i.kind === "chapter" && !i.trashed) ? b.activeId : (list.find((i) => i.kind === "chapter" && !i.trashed)?.id ?? "");

      const unchangedOrder = b.items.map((i) => i.id).join() === sentOrder.join();
      const unchangedMeta = b.title === sentMeta.title && b.author === sentMeta.author && b.genre === book.genre && b.lang === book.lang;
      const stillRemoved = (b.removed ?? []).filter((r) => !(r.id in out.accepted) && !out.items.some((o) => o.id === r.id && !o.deleted));
      return {
        ...b, items: list, activeId, cursor: out.cursor, remote: true,
        title: out.meta && !b.metaDirty ? out.meta.title : b.title,
        author: out.meta && !b.metaDirty ? out.meta.author : b.author,
        genre: out.meta?.genre && !b.metaDirty ? out.meta.genre : b.genre,
        lang: isBookLang(out.meta?.lang) && !b.metaDirty ? out.meta.lang : b.lang,
        metaDirty: sendMeta && unchangedMeta ? false : b.metaDirty,
        orderDirty: sendOrder && unchangedOrder ? false : b.orderDirty,
        removed: stillRemoved,
      };
    });
    return { books, remoteTick: activeChanged ? s.remoteTick + 1 : s.remoteTick };
  });
}

/** Called once at app start: loads the account and listens for changes. */
export function startSync(): void {
  void refreshAccount();
  let last = useStore.getState().books;
  useStore.subscribe((s) => {
    if (s.books === last) return;
    last = s.books;
    if (s.account && hasPending()) scheduleSync();
  });
  const pull = () => { if (useStore.getState().account) scheduleSync(300); };
  window.addEventListener("online", pull);
  window.addEventListener("focus", pull);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });
  window.setInterval(pull, 60_000);
}

