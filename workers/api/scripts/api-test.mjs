// Local API integration test. First `pnpm dev:api` (wrangler dev --local) and the local D1 migration must be running;
// a test user u1 and a session row with the SHA-256 (base64url) digest of TESTTOKEN must be inserted into the local D1.
// Run: node workers/api/scripts/api-test.mjs
const B = "http://localhost:8787";
const h = { "content-type": "application/json", cookie: "pf_session=TESTTOKEN", origin: B };
const post = async (p, body) => { const r = await fetch(B + p, { method: "POST", headers: h, body: JSON.stringify(body) }); return { s: r.status, j: await r.json() }; };
const BK = "11111111-1111-4111-8111-111111111111", A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
let ok = true; const check = (n, c, x) => { if (!c) ok = false; console.log(c ? "OK  " : "FAIL", n, c ? "" : JSON.stringify(x)); };

const me = await (await fetch(B + "/api/me", { headers: h })).json(); check("signed in", me.user?.id === "u1", me);
const anon = await (await fetch(B + "/api/me")).json(); check("signed-out /me is empty", anon.user === null, anon);
const un = await fetch(B + "/api/books"); check("signed-out /books 401", un.status === 401, un.status);

// 1) device A first send
let r = await post(`/api/books/${BK}/sync`, { cursor: 0, meta: { title: "Kitap", author: "Y" }, order: [A], items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nmetin", baseSeq: 0 }] });
check("first push accepted", r.s === 200 && r.j.accepted[A] > 0, r); const seqA1 = r.j.accepted[A]; const cursorA = r.j.cursor;
check("its own write does not come back", r.j.items.length === 0, r.j.items);

// 2) device B pulls from scratch
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
check("device B receives the chapter", r.j.items.length === 1 && r.j.items[0].body.includes("metin"), r.j);
check("order and metadata arrive", r.j.order?.[0] === A && r.j.meta?.title === "Kitap", r.j);
const cursorB = r.j.cursor;

// 3) A edits (correct baseSeq) → accepted
r = await post(`/api/books/${BK}/sync`, { cursor: cursorA, items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nA düzenledi", baseSeq: seqA1 }] });
check("normal edit accepted", r.j.conflicts.length === 0 && r.j.accepted[A] > seqA1, r.j);

// 4) B edits with an old baseSeq → CONFLICT, both texts are kept
r = await post(`/api/books/${BK}/sync`, { cursor: cursorB, items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nB düzenledi", baseSeq: seqA1 }] });
check("conflict detected", r.j.conflicts.length === 1, r.j);
const bodies = r.j.items.map((i) => i.body).join("|");
check("server version sent back", bodies.includes("A düzenledi"), r.j);
check("B's text is stored as a copy", bodies.includes("B düzenledi") && r.j.items.some((i) => i.title === "__conflict__"), r.j);

// 5) delete: deleted with the current baseSeq
const cur = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
const live = cur.j.items.find((i) => i.id === A);
r = await post(`/api/books/${BK}/sync`, { cursor: cur.j.cursor, items: [{ id: A, kind: "chapter", title: "", body: "", baseSeq: live.seq, deleted: true }] });
check("delete with current baseSeq accepted", r.j.accepted[A] > live.seq, r.j);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
check("silinen tombstone olarak gelir", r.j.items.find((i) => i.id === A)?.deleted === true, r.j);

// 6) validation and authorization
r = await post(`/api/books/not-a-uuid/sync`, { cursor: 0, items: [] }); check("bad id 400", r.s === 400, r);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [{ id: "x", kind: "chapter", title: "", body: "", baseSeq: 0 }] }); check("bad body 400", r.s === 400, r);
const evil = await fetch(B + `/api/books/${BK}/sync`, { method: "POST", headers: { ...h, origin: "https://evil.example" }, body: JSON.stringify({ cursor: 0, items: [] }) }); check("foreign origin 403", evil.status === 403, evil.status);
const list = await (await fetch(B + "/api/books", { headers: h })).json(); check("kitap listesi", list.books?.[0]?.title === "Kitap", list);

// 7) passkey options (host allowed)
r = await post("/api/auth/register/options", { name: "Deneme" }); check("registration options", r.s === 200 && r.j.challenge && r.j.authenticatorSelection.residentKey === "required", r);
r = await post("/api/auth/login/options", {}); check("sign-in options", r.s === 200 && r.j.challenge, r);
r = await post("/api/auth/recover", { code: "YANLIS-KOD" }); check("wrong recovery code 400", r.s === 400, r);
r = await post("/api/auth/register/verify", { response: {} }); check("registration without a challenge is rejected", r.s === 400, r);

// 8) kitap silme
let d = await fetch(B + `/api/books/${BK}`, { method: "DELETE", headers: h }); check("kitap silinir", d.status === 200, d.status);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] }); check("silinen kitaba yazma 410", r.s === 410, r);
console.log(ok ? "\nTÜMÜ GEÇTİ" : "\nBAZILARI BAŞARISIZ"); process.exit(ok ? 0 : 1);
