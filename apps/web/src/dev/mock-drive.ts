// @ts-nocheck
// Yalnızca geliştirmede (?mockdrive): Google girişini ve Drive API'sini bellekte taklit eder,
// böylece Drive eşitlemesi gerçek hesap olmadan denenebilir. Üretim derlemesine girmez.
import * as drive from "../drive";
import { useStore } from "../store";

const files = new Map();
let n = 0;
const log: string[] = [];
const mk = (o) => { const id = `f${++n}`; const f = { id, version: "1", mimeType: "", name: "", appProperties: {}, parents: [], trashed: false, content: "", ...o }; files.set(id, f); return f; };
const pub = (f) => ({ id: f.id, name: f.name, version: f.version, mimeType: f.mimeType, size: f.blob ? String(f.blob.size) : undefined, appProperties: f.appProperties });
const sessions = new Map();
const touch = (f) => { f.version = String(Number(f.version) + 1); };
const resp = (o, status = 200, headers = {}) => new Response(o instanceof Blob || typeof o === "string" ? o : JSON.stringify(o), { status, headers });
const multipart = (body: string) => {
  const parts = body.split(/--pf[a-z0-9]+/).filter((s) => s.includes("Content-Type"));
  const meta = JSON.parse(parts[0].split("\r\n\r\n")[1].replace(/\r\n$/, ""));
  const content = parts[1].split("\r\n\r\n").slice(1).join("\r\n\r\n").replace(/\r\n$/, "");
  return { meta, content };
};

const realFetch = window.fetch.bind(window);
window.fetch = async (url, init = {}) => {
  const u = new URL(String(url), location.href);
  if (!u.host.includes("googleapis.com")) return realFetch(url, init);
  const m = init.method || "GET";
  const p = u.pathname.replace("/upload", "").replace("/drive/v3", "");
  log.push(`${m} ${p}${u.searchParams.get("uploadType") === "resumable" ? " (resumable)" : ""}`);
  if (p.startsWith("/resume/") && m === "PUT") {
    const ss = sessions.get(p);
    const blob = init.body;
    if (ss.fileId) { const f = files.get(ss.fileId); Object.assign(f, ss.meta, { blob, content: "" }); touch(f); return resp({ id: f.id, version: f.version }); }
    const f = mk({ ...ss.meta, blob, content: "" });
    return resp({ id: f.id, version: f.version });
  }
  if (u.searchParams.get("uploadType") === "resumable") {
    const id = `/resume/${Math.random().toString(36).slice(2)}`;
    sessions.set(id, { meta: JSON.parse(init.body), fileId: (p.match(/^\/files\/([^/]+)$/) || [])[1] || null });
    return resp("", 200, { Location: `https://www.googleapis.com/upload${id}` });
  }
  if (p === "/about") return resp({ user: { emailAddress: "test@example.com" } });
  if (p === "/files" && m === "GET") {
    const q = u.searchParams.get("q");
    let r = [...files.values()].filter((f) => !f.trashed);
    const par = q.match(/'([^']+)' in parents/);
    if (par) r = r.filter((f) => f.parents.includes(par[1]));
    if (q.includes("mimeType='application/vnd.google-apps.folder'")) r = r.filter((f) => f.mimeType === "application/vnd.google-apps.folder");
    if (q.includes("key='pfRoot'")) r = r.filter((f) => f.appProperties.pfRoot === "1");
    return resp({ files: r.map(pub) });
  }
  if (p === "/files" && m === "POST") {
    if (u.searchParams.get("uploadType") === "multipart") { const { meta, content } = multipart(init.body); const f = mk({ ...meta, content }); return resp({ id: f.id, version: f.version }); }
    return resp(pub(mk(JSON.parse(init.body))));
  }
  const mm = p.match(/^\/files\/([^/]+)$/);
  if (mm) {
    const f = files.get(mm[1]);
    if (!f) return resp({}, 404);
    if (m === "GET") return resp(f.blob ?? f.content);
    if (m === "PATCH") {
      if (u.searchParams.get("uploadType") === "multipart") { const { meta, content } = multipart(init.body); Object.assign(f, meta); f.content = content; }
      else Object.assign(f, JSON.parse(init.body));
      touch(f);
      return resp({ id: f.id, version: f.version });
    }
  }
  return resp({}, 400);
};
window.google = { accounts: { oauth2: { initTokenClient: (c) => ({ requestAccessToken: () => setTimeout(() => c.callback({ access_token: "T", expires_in: 3600 }), 10) }), revoke() {} } } };
window.__mock = { files, log, mk, touch, store: useStore, drive };
