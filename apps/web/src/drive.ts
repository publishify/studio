// Your own cloud: books live in the author's Google Drive as plain Markdown files (ADR-0010).
//   Publishify/<Book title>/kitap.json           metadata + order + parts
//   Publishify/<Book title>/NN-chapter-title.md  one file per chapter
// Only the `drive.file` scope: the app sees just the files it created itself.
import { create } from "zustand";
import { type MediaRef, delBlob, getBlob, putBlob } from "./media";
import { type Book, CONFLICT, type DriveLink, type Item, titleOf, useStore } from "./store";

export const GOOGLE_CLIENT_ID = "1030068899140-rrrs8rcrd2poro4vk5aggsrauqoncm2g.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const API = "https://www.googleapis.com/drive/v3";
const UP = "https://www.googleapis.com/upload/drive/v3";
const FOLDER = "application/vnd.google-apps.folder";
const HINT = "publishify:drive";

export type DriveStatus = "off" | "needs-auth" | "idle" | "syncing" | "error" | "offline";
const hint = (): string | null => { try { return localStorage.getItem(HINT); } catch { return null; } };
const setHint = (v: string | null) => { try { if (v) localStorage.setItem(HINT, v); else localStorage.removeItem(HINT); } catch { /* private window */ } };

export const useDrive = create<{ status: DriveStatus; email: string | null; last: number | null }>(() => ({
  status: hint() ? "needs-auth" : "off",
  email: hint() && hint() !== "1" ? hint() : null,
  last: null,
}));
const setStatus = (status: DriveStatus) => useDrive.setState((s) => ({ status, last: status === "idle" ? Date.now() : s.last }));

// ── Google session (Google Identity Services, in the browser; no key goes to the server) ──────────────
interface TokenResp { access_token?: string; expires_in?: number; error?: string }
interface TokenClient { requestAccessToken(o?: { prompt?: string }): void }
declare global {
  interface Window {
    google?: { accounts: { oauth2: {
      initTokenClient(c: { client_id: string; scope: string; callback: (r: TokenResp) => void; error_callback?: (e: { type: string }) => void }): TokenClient;
      revoke(token: string, done?: () => void): void;
    } } };
  }
}
let gsi: Promise<void> | null = null;
const loadGsi = (): Promise<void> => {
  if (window.google?.accounts) return Promise.resolve();
  gsi ??= new Promise<void>((ok, fail) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => ok();
    s.onerror = () => { gsi = null; fail(new Error("gsi")); };
    document.head.appendChild(s);
  });
  return gsi;
};

let token = "";
let expires = 0;
async function getToken(interactive: boolean): Promise<string> {
  if (token && Date.now() < expires - 60_000) return token;
  await loadGsi();
  return new Promise<string>((resolve, reject) => {
    const to = window.setTimeout(() => reject(new Error("auth")), interactive ? 120_000 : 15_000);
    const done = (fn: () => void) => { window.clearTimeout(to); fn(); };
    const c = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (r) => done(() => {
        if (r.access_token) { token = r.access_token; expires = Date.now() + (r.expires_in ?? 3600) * 1000; resolve(token); }
        else reject(new Error("auth"));
      }),
      error_callback: () => done(() => reject(new Error("auth"))),
    });
    c.requestAccessToken({ prompt: interactive ? "select_account" : "" });
  });
}

// ── Drive API ──────────────────────────────────────────────────────────────────────────────────
class DriveError extends Error { constructor(public status: number) { super(`drive ${status}`); } }
interface DFile { id: string; name: string; version: string; mimeType: string; size?: string; appProperties?: Record<string, string> }
const FIELDS = "id,name,version,mimeType,size,appProperties";

async function call(path: string, init: RequestInit = {}, base = API): Promise<Response> {
  const tk = await getToken(false);
  const r = await fetch(base + path, { ...init, headers: { ...(init.headers as Record<string, string> | undefined), authorization: `Bearer ${tk}` } });
  if (r.status === 401) { token = ""; throw new Error("auth"); }
  if (!r.ok) throw new DriveError(r.status);
  return r;
}
const json = async <T>(r: Response): Promise<T> => (await r.json()) as T;

async function list(q: string): Promise<DFile[]> {
  const out: DFile[] = [];
  let page = "";
  do {
    const p = new URLSearchParams({ q, pageSize: "1000", fields: `nextPageToken,files(${FIELDS})`, spaces: "drive" });
    if (page) p.set("pageToken", page);
    const d = await json<{ files: DFile[]; nextPageToken?: string }>(await call(`/files?${p}`));
    out.push(...d.files);
    page = d.nextPageToken ?? "";
  } while (page);
  return out;
}
const createFolder = async (name: string, parent: string | null, props: Record<string, string>): Promise<DFile> =>
  json(await call(`/files?fields=${FIELDS}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER, ...(parent ? { parents: [parent] } : {}), appProperties: props }),
  }));
const patchFile = async (id: string, body: Record<string, unknown>): Promise<{ id: string; version: string }> =>
  json(await call(`/files/${id}?fields=id,version`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));
const download = async (id: string): Promise<string> => (await call(`/files/${id}?alt=media`)).text();
const downloadBlob = async (id: string): Promise<Blob> => (await call(`/files/${id}?alt=media`)).blob();
/** Resumable upload for large files (audio). */
async function uploadMedia(fileId: string | null, meta: Record<string, unknown>, blob: Blob): Promise<{ id: string; version: string }> {
  const type = blob.type || "application/octet-stream";
  const start = await call(`${fileId ? `/files/${fileId}` : "/files"}?uploadType=resumable&fields=id,version`, {
    method: fileId ? "PATCH" : "POST",
    headers: { "content-type": "application/json; charset=UTF-8", "x-upload-content-type": type, "x-upload-content-length": String(blob.size) },
    body: JSON.stringify(meta),
  }, UP);
  const loc = start.headers.get("location");
  if (!loc) throw new DriveError(500);
  const r = await fetch(loc, { method: "PUT", headers: { "content-type": type }, body: blob });
  if (!r.ok) throw new DriveError(r.status);
  return json(r);
}
/** Downloads a file (audio) that is on Drive but not yet on this device and stores it locally. */
export async function fetchMedia(ref: MediaRef): Promise<boolean> {
  if (!ref.drive) return false;
  await putBlob(ref.id, await downloadBlob(ref.drive.fileId));
  return true;
}
async function upload(fileId: string | null, meta: Record<string, unknown>, content: string, mime: string): Promise<{ id: string; version: string }> {
  const b = `pf${Math.random().toString(36).slice(2)}`;
  const body = `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: ${mime}; charset=UTF-8\r\n\r\n${content}\r\n--${b}--`;
  return json(await call(`${fileId ? `/files/${fileId}` : "/files"}?uploadType=multipart&fields=id,version`, {
    method: fileId ? "PATCH" : "POST", headers: { "content-type": `multipart/related; boundary=${b}` }, body,
  }, UP));
}

// ── Helpers ────────────────────────────────────────────────────────────
function hashStr(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `${str.length}:${(4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)}`;
}
const hashOf = (i: Pick<Item, "body">) => hashStr(i.body);
const clean = (s: string) => s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
const chapterName = (it: Item, n: number) =>
  `${String(n).padStart(2, "0")}-${clean(titleOf(it, "")) || "bolum"}${it.title === CONFLICT ? " (çakışan kopya)" : ""}.md`;

interface Meta { format: string; v: number; id: string; title: string; author: string; genre?: string; lang?: string; trashed?: number; items: { id: string; kind: "part" | "chapter"; level?: 2; title?: string; trashed?: number }[] }
const buildMeta = (b: Book): Meta => ({
  format: "publishify-book", v: 1, id: b.id, title: b.title, author: b.author, ...(b.genre ? { genre: b.genre } : {}), ...(b.lang ? { lang: b.lang } : {}), ...(b.trashed ? { trashed: b.trashed } : {}),
  items: b.items.map((i) => ({ id: i.id, kind: i.kind, ...(i.level ? { level: i.level } : {}), ...(i.kind === "part" ? { title: i.title } : {}), ...(i.trashed ? { trashed: i.trashed } : {}) })),
});
const metaHash = (b: Book) => hashStr(JSON.stringify(buildMeta(b)));
const parseMeta = (text: string): Meta | null => {
  try {
    const m = JSON.parse(text) as Meta;
    return m && m.format === "publishify-book" && Array.isArray(m.items) ? m : null;
  } catch { return null; }
};
const getBook = (id: string) => useStore.getState().books.find((b) => b.id === id);

// ── Sync ─────────────────────────────────────────────────────────────
let running = false;
let rerun = false;
let timer = 0;

export function scheduleDrive(delay = 4000): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => void driveSync(), delay);
}

function drivePending(): boolean {
  const s = useStore.getState();
  if ((s.driveTrash ?? []).length) return true;
  return s.books.some((b) => !b.drive || b.drive.metaHash !== metaHash(b) || b.items.some((i) => i.kind === "chapter" && (!i.drive || i.drive.hash !== hashOf(i))) || mediaPending(b));
}

const needsUp = (r: MediaRef | undefined) => !!r && (r.up || !r.drive);
const mediaPending = (b: Book) => needsUp(b.cover) || b.items.some((i) => needsUp(i.audio));

export async function driveSync(): Promise<void> {
  if (useDrive.getState().status === "off") return;
  if (running) { rerun = true; return; }
  if (!navigator.onLine) { setStatus("offline"); return; }
  running = true;
  setStatus("syncing");
  try {
    await getToken(false);
    // 1) move deleted items to the Drive trash
    for (const id of useStore.getState().driveTrash ?? []) {
      try { await patchFile(id, { trashed: true }); } catch (e) { if (!(e instanceof DriveError && e.status === 404)) throw e; }
      useStore.getState().patch((s) => ({ driveTrash: (s.driveTrash ?? []).filter((x) => x !== id) }));
    }
    // 2) root folder and book folders
    const roots = await list(`mimeType='${FOLDER}' and trashed=false and appProperties has { key='pfRoot' and value='1' }`);
    const rootId = roots[0]?.id ?? (await createFolder("Publishify", null, { pfRoot: "1" })).id;
    const folders = await list(`'${rootId}' in parents and mimeType='${FOLDER}' and trashed=false`);
    // 3) fetch books that are on Drive but not here
    const known = new Set(useStore.getState().books.map((b) => b.id));
    const fresh = folders.filter((f) => f.appProperties?.pfBook && !known.has(f.appProperties.pfBook));
    if (fresh.length) {
      useStore.getState().patch((s) => ({
        books: [...s.books, ...fresh.map((f): Book => ({
          id: f.appProperties!.pfBook!, title: f.name, author: "", created: Date.now(), items: [], activeId: "", drive: { folderId: f.id },
        }))],
      }));
    }
    for (const b of useStore.getState().books) await syncBook(b.id, rootId, folders);
    setStatus("idle");
  } catch (e) {
    if (e instanceof Error && e.message === "auth") setStatus("needs-auth");
    else setStatus(navigator.onLine ? "error" : "offline");
  } finally {
    running = false;
    if (rerun) { rerun = false; scheduleDrive(800); }
  }
}

interface Replace { id: string; expect: string; body: string; link: DriveLink; copy?: Item }

async function syncBook(bookId: string, rootId: string, folders: DFile[]): Promise<void> {
  const snap = getBook(bookId);
  if (!snap) return;
  let folder = folders.find((f) => f.id === snap.drive?.folderId) ?? folders.find((f) => f.appProperties?.pfBook === snap.id);
  if (!folder) {
    folder = await createFolder(clean(snap.title) || "Kitap", rootId, { pfBook: snap.id });
    folders.push(folder);
  }
  const folderId = folder.id;
  // If the folder changed (deleted/recreated), old file links are invalid; local text is kept and uploaded again.
  const dm = snap.drive?.folderId === folderId ? snap.drive : undefined;
  const linkOf = (i: Item) => (dm ? i.drive : undefined);

  const files = await list(`'${folderId}' in parents and trashed=false`);
  const metaFile = files.find((f) => f.appProperties?.pfKind === "meta");
  const byId = new Map(files.filter((f) => f.appProperties?.pfId).map((f) => [f.appProperties!.pfId!, f] as const));
  const chapters = snap.items.filter((i) => i.kind === "chapter");
  const order = new Map(chapters.map((c, n) => [c.id, n + 1] as const));
  // If no files are visible at all (possibly a folder problem), never delete any chapter locally; upload again.
  const noRemote = byId.size === 0;

  const links = new Map<string, DriveLink>();
  const replaces: Replace[] = [];
  const adds: Item[] = [];
  const removes = new Map<string, string>(); // id -> expected hash
  const uploaded = new Set<string>();

  for (const c of chapters) {
    const f = byId.get(c.id);
    const l = linkOf(c);
    const h = hashOf(c);
    const conflictProp = c.title === CONFLICT ? { pfConflict: "1" } : {};
    const put = async (existing: string | null) => {
      const meta = { name: chapterName(c, order.get(c.id) ?? 0), mimeType: "text/markdown", appProperties: { pfId: c.id, pfKind: "chapter", ...conflictProp }, ...(existing ? {} : { parents: [folderId] }) };
      const r = await upload(existing, meta, c.body, "text/markdown");
      links.set(c.id, { fileId: r.id, version: r.version, hash: h });
      uploaded.add(c.id);
    };
    if (!f) {
      if (l && !noRemote && h === l.hash) removes.set(c.id, h); // deleted on Drive, unchanged here
      else await put(null);
      continue;
    }
    const remoteChanged = !l || l.fileId !== f.id || l.version !== f.version;
    const localChanged = !l || h !== l.hash;
    if (!remoteChanged && !localChanged) continue;
    if (!remoteChanged) { await put(f.id); continue; }
    const text = await download(f.id);
    const link: DriveLink = { fileId: f.id, version: f.version, hash: hashStr(text) };
    if (text === c.body) links.set(c.id, link);
    else if (!localChanged) replaces.push({ id: c.id, expect: h, body: text, link });
    else {
      // Both sides changed: the Drive version stays and the local text becomes a "conflicted copy" (same rule as ADR-0009).
      const copy: Item = { id: crypto.randomUUID(), kind: "chapter", title: CONFLICT, body: c.body, updated: Date.now(), versions: [], dirty: true };
      replaces.push({ id: c.id, expect: h, body: text, link, copy });
    }
  }
  // Chapters that are on Drive but not here
  for (const [id, f] of byId) {
    if (chapters.some((c) => c.id === id)) continue;
    const text = await download(f.id);
    adds.push({
      id, kind: "chapter", title: f.appProperties?.pfConflict === "1" ? CONFLICT : "", body: text, updated: Date.now(), versions: [],
      dirty: true, drive: { fileId: f.id, version: f.version, hash: hashStr(text) },
    });
  }
  // Rename if the file names (order number/title) changed
  for (const c of chapters) {
    const f = byId.get(c.id);
    if (!f || uploaded.has(c.id) || replaces.some((r) => r.id === c.id)) continue;
    const want = chapterName(c, order.get(c.id) ?? 0);
    if (f.name === want) continue;
    const r = await patchFile(f.id, { name: want });
    const l = links.get(c.id) ?? linkOf(c) ?? { fileId: f.id, version: f.version, hash: hashOf(c) };
    links.set(c.id, { ...l, fileId: f.id, version: r.version });
  }

  // Metadata: adopt Drive's version (if local is unchanged) or write the local one.
  const localMetaChanged = dm?.metaHash !== undefined && metaHash(snap) !== dm.metaHash;
  let applyMeta: Meta | null = null;
  let metaVersion = dm?.metaVersion;
  if (metaFile) {
    const remoteChanged = !dm || dm.metaFileId !== metaFile.id || dm.metaVersion !== metaFile.version;
    if (remoteChanged && !localMetaChanged) { applyMeta = parseMeta(await download(metaFile.id)); metaVersion = metaFile.version; }
  }

  const nothing = !links.size && !replaces.length && !adds.length && !removes.size && !applyMeta && snap.drive?.folderId === folderId;
  if (!nothing) {
    useStore.getState().patch((s) => {
      let activeChanged = false;
      const now = Date.now();
      const books = s.books.map((b): Book => {
        if (b.id !== bookId) return b;
        let list = b.items.slice();
        for (const r of replaces) {
          const idx = list.findIndex((i) => i.id === r.id);
          const cur = list[idx];
          if (!cur || hashOf(cur) !== r.expect) continue; // changed while being written: next round
          const versions = cur.body.trim() ? [{ t: now, body: cur.body, label: "drive" }, ...cur.versions].slice(0, 40) : cur.versions;
          list[idx] = { ...cur, body: r.body, updated: now, dirty: true, versions, drive: r.link };
          if (r.copy) list.splice(idx + 1, 0, r.copy);
          if (b.activeId === r.id) activeChanged = true;
        }
        for (const n of adds) if (!list.some((i) => i.id === n.id)) list.push(n);
        for (const [id, expect] of removes) {
          const cur = list.find((i) => i.id === id);
          if (cur && hashOf(cur) === expect) { list = list.filter((i) => i.id !== id); if (b.activeId === id) activeChanged = true; }
        }
        list = list.map((i) => {
          const l = links.get(i.id);
          if (l && !replaces.some((r) => r.id === i.id)) return { ...i, drive: l };
          return !dm && i.drive && snap.drive?.folderId !== folderId ? { ...i, drive: undefined } : i;
        });
        let title = b.title, author = b.author, genre = b.genre, lang = b.lang, metaDirty = b.metaDirty, orderDirty = b.orderDirty;
        if (applyMeta) {
          const byItem = new Map(list.map((i) => [i.id, i] as const));
          const next: Item[] = [];
          for (const mi of applyMeta.items) {
            const have = byItem.get(mi.id);
            if (have) { next.push({ ...have, ...(have.kind === "part" ? { title: mi.title ?? have.title } : {}), level: mi.level, trashed: mi.trashed }); byItem.delete(mi.id); }
            else if (mi.kind === "part") next.push({ id: mi.id, kind: "part", title: mi.title ?? "", body: "", updated: now, versions: [], dirty: true, trashed: mi.trashed });
          }
          for (const rest of byItem.values()) if (rest.kind === "chapter") next.push(rest); // chapters not yet in the metadata go last
          list = next;
          title = applyMeta.title || b.title;
          author = applyMeta.author ?? b.author;
          genre = (applyMeta.genre as Book["genre"]) ?? b.genre;
          lang = (applyMeta.lang as Book["lang"]) ?? b.lang;
          metaDirty = true;
          orderDirty = true;
        }
        if (!list.some((i) => i.kind === "chapter" && !i.trashed)) list.push({ id: crypto.randomUUID(), kind: "chapter", title: "", body: "# \n\n", updated: now, versions: [], dirty: true });
        const activeId = list.some((i) => i.id === b.activeId && i.kind === "chapter" && !i.trashed) ? b.activeId : (list.find((i) => i.kind === "chapter" && !i.trashed)?.id ?? "");
        const nb: Book = { ...b, title, author, genre, lang, items: list, activeId, metaDirty, orderDirty, ...(applyMeta ? { trashed: applyMeta.trashed } : {}) };
        nb.drive = {
          folderId,
          ...(dm?.metaFileId ? { metaFileId: dm.metaFileId } : {}),
          ...(metaVersion ? { metaVersion } : {}),
          ...(applyMeta && metaFile ? { metaFileId: metaFile.id, metaHash: metaHash(nb) } : dm?.metaHash !== undefined ? { metaHash: dm.metaHash } : {}),
        };
        return nb;
      });
      return { books, remoteTick: activeChanged ? s.remoteTick + 1 : s.remoteTick };
    });
  }

  // Write the metadata (and folder name) if needed
  const cur = getBook(bookId);
  if (!cur) return;
  const h = metaHash(cur);
  if (!cur.drive?.metaFileId || cur.drive.metaHash !== h) {
    const existing = metaFile?.id ?? null;
    const r = await upload(existing, { name: "kitap.json", mimeType: "application/json", appProperties: { pfKind: "meta", pfBook: cur.id }, ...(existing ? {} : { parents: [folderId] }) }, JSON.stringify(buildMeta(cur), null, 2), "application/json");
    useStore.getState().patch((s) => ({
      books: s.books.map((b) => (b.id === bookId ? { ...b, drive: { folderId, metaFileId: r.id, metaVersion: r.version, metaHash: h } } : b)),
    }));
  }
  await syncMedia(bookId, folderId, files, noRemote);

  const want = clean(cur.title);
  if (want && folder.name !== want) { await patchFile(folderId, { name: want }); folder.name = want; }
}

// ── Cover and narration ─────────────────────────────────────────────────
interface MediaJob {
  ref: MediaRef | undefined; file: DFile | undefined; name: string; props: Record<string, string>; folderId: string;
  eager: boolean; noRemote: boolean; read: () => MediaRef | undefined; write: (r: MediaRef | undefined) => void;
}
async function syncMedia1(o: MediaJob): Promise<void> {
  const { ref, file } = o;
  const fromRemote = (f: DFile): MediaRef => ({ id: crypto.randomUUID(), name: f.name, type: f.mimeType, size: Number(f.size ?? 0), drive: { fileId: f.id, version: f.version } });
  if (ref && needsUp(ref)) {
    const blob = await getBlob(ref.id);
    if (!blob) return;
    const existing = ref.drive?.fileId ?? file?.id ?? null;
    const r = await uploadMedia(existing, { name: o.name, mimeType: ref.type, appProperties: o.props, ...(existing ? {} : { parents: [o.folderId] }) }, blob);
    if (o.read()?.id === ref.id) o.write({ ...ref, up: false, drive: { fileId: r.id, version: r.version } });
  } else if (!ref && file) {
    const next = fromRemote(file);
    if (o.eager) await putBlob(next.id, await downloadBlob(file.id));
    if (!o.read()) o.write(next); else if (o.eager) void delBlob(next.id);
  } else if (ref?.drive && file && (ref.drive.fileId !== file.id || ref.drive.version !== file.version)) {
    const next = fromRemote(file);
    if (o.eager) await putBlob(next.id, await downloadBlob(file.id));
    if (o.read()?.id === ref.id) { o.write(next); void delBlob(ref.id); } else if (o.eager) void delBlob(next.id);
  } else if (ref?.drive && !file && !o.noRemote && o.read()?.id === ref.id) {
    o.write(undefined); // deleted on Drive
    void delBlob(ref.id);
  }
}

async function syncMedia(bookId: string, folderId: string, files: DFile[], noRemote: boolean): Promise<void> {
  const patchBook = (fn: (b: Book) => Book) => useStore.getState().patch((s) => ({ books: s.books.map((b) => (b.id === bookId ? fn(b) : b)) }));
  const cover = files.find((f) => f.appProperties?.pfKind === "cover");
  const book = getBook(bookId);
  if (!book) return;
  await syncMedia1({
    ref: book.cover, file: cover, name: book.cover?.name ?? "kapak.jpg", props: { pfKind: "cover", pfBook: bookId }, folderId, eager: true, noRemote,
    read: () => getBook(bookId)?.cover, write: (r) => patchBook((b) => ({ ...b, cover: r })),
  });
  const audio = new Map(files.filter((f) => f.appProperties?.pfAudio).map((f) => [f.appProperties!.pfAudio!, f] as const));
  const ids = new Set([...(getBook(bookId)?.items ?? []).filter((i) => i.kind === "chapter").map((i) => i.id)]);
  for (const id of ids) {
    const item = getBook(bookId)?.items.find((i) => i.id === id);
    if (!item || (!item.audio && !audio.has(id))) continue;
    const n = (getBook(bookId)?.items.filter((i) => i.kind === "chapter").findIndex((i) => i.id === id) ?? 0) + 1;
    await syncMedia1({
      ref: item.audio, file: audio.get(id), name: `${String(n).padStart(2, "0")}-${clean(item.audio?.name.replace(/\.[^.]+$/, "") ?? "ses")}${item.audio?.name.match(/\.[^.]+$/)?.[0] ?? ""}`,
      props: { pfKind: "audio", pfAudio: id }, folderId, eager: false, noRemote,
      read: () => getBook(bookId)?.items.find((i) => i.id === id)?.audio,
      write: (r) => patchBook((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? { ...i, audio: r } : i)) })),
    });
  }
}

// ── Exposed operations ──────────────────────────────────────────────────
export async function connectDrive(): Promise<void> {
  const tk = await getToken(true);
  let email = "";
  try {
    const r = await fetch(`${API}/about?fields=user(emailAddress)`, { headers: { authorization: `Bearer ${tk}` } });
    email = ((await r.json()) as { user?: { emailAddress?: string } }).user?.emailAddress ?? "";
  } catch { /* no problem if the email cannot be shown */ }
  const prev = hint();
  if (prev && prev !== "1" && email && prev !== email) clearLinks(); // another Google account: old file links are invalid
  setHint(email || "1");
  useDrive.setState({ status: "idle", email: email || null });
  void driveSync();
}

function clearLinks(): void {
  useStore.getState().patch((s) => ({
    driveTrash: [],
    books: s.books.map((b) => ({ ...b, drive: undefined, items: b.items.map((i) => ({ ...i, drive: undefined })) })),
  }));
}

/** Disconnects. Local books and Drive files stay as they are. */
export function disconnectDrive(): void {
  if (token && window.google) window.google.accounts.oauth2.revoke(token);
  token = "";
  setHint(null);
  clearLinks();
  useDrive.setState({ status: "off", email: null, last: null });
}

/** Called once when the app starts. */
export function startDrive(): void {
  if (hint()) {
    getToken(false)
      .then(() => { setStatus("idle"); scheduleDrive(500); })
      .catch(() => setStatus("needs-auth"));
  }
  let last = useStore.getState().books;
  useStore.subscribe((s) => {
    if (s.books === last) return;
    last = s.books;
    const st = useDrive.getState().status;
    if (st !== "off" && st !== "needs-auth" && drivePending()) scheduleDrive();
  });
  const pull = () => { if (useDrive.getState().status !== "off") scheduleDrive(300); };
  window.addEventListener("online", pull);
  window.addEventListener("focus", pull);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });
  window.setInterval(() => { if (useDrive.getState().status === "idle") scheduleDrive(300); }, 60_000);
}
