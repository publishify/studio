// Yerel API entegrasyon testi. Önce `pnpm dev:api` (wrangler dev --local) ve yerel D1 migrasyonu çalışmalı;
// yerel D1'e test kullanıcısı u1 ve TESTTOKEN'in SHA-256 (base64url) özetiyle bir oturum satırı eklenmeli.
// Çalıştır: node workers/api/scripts/api-test.mjs
const B = "http://localhost:8787";
const h = { "content-type": "application/json", cookie: "pf_session=TESTTOKEN", origin: B };
const post = async (p, body) => { const r = await fetch(B + p, { method: "POST", headers: h, body: JSON.stringify(body) }); return { s: r.status, j: await r.json() }; };
const BK = "11111111-1111-4111-8111-111111111111", A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
let ok = true; const check = (n, c, x) => { if (!c) ok = false; console.log(c ? "OK  " : "FAIL", n, c ? "" : JSON.stringify(x)); };

const me = await (await fetch(B + "/api/me", { headers: h })).json(); check("oturum açık", me.user?.id === "u1", me);
const anon = await (await fetch(B + "/api/me")).json(); check("oturumsuz /me boş", anon.user === null, anon);
const un = await fetch(B + "/api/books"); check("oturumsuz /books 401", un.status === 401, un.status);

// 1) A cihazı ilk gönderim
let r = await post(`/api/books/${BK}/sync`, { cursor: 0, meta: { title: "Kitap", author: "Y" }, order: [A], items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nmetin", baseSeq: 0 }] });
check("ilk push kabul", r.s === 200 && r.j.accepted[A] > 0, r); const seqA1 = r.j.accepted[A]; const cursorA = r.j.cursor;
check("kendi yazdığı geri dönmez", r.j.items.length === 0, r.j.items);

// 2) B cihazı sıfırdan çeker
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
check("B cihazı bölümü alır", r.j.items.length === 1 && r.j.items[0].body.includes("metin"), r.j);
check("sıra ve künye gelir", r.j.order?.[0] === A && r.j.meta?.title === "Kitap", r.j);
const cursorB = r.j.cursor;

// 3) A düzenler (doğru baseSeq) → kabul
r = await post(`/api/books/${BK}/sync`, { cursor: cursorA, items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nA düzenledi", baseSeq: seqA1 }] });
check("normal düzenleme kabul", r.j.conflicts.length === 0 && r.j.accepted[A] > seqA1, r.j);

// 4) B eski baseSeq ile düzenler → ÇAKIŞMA, iki metin de korunur
r = await post(`/api/books/${BK}/sync`, { cursor: cursorB, items: [{ id: A, kind: "chapter", title: "", body: "# Bir\n\nB düzenledi", baseSeq: seqA1 }] });
check("çakışma bulundu", r.j.conflicts.length === 1, r.j);
const bodies = r.j.items.map((i) => i.body).join("|");
check("sunucu sürümü geri gönderildi", bodies.includes("A düzenledi"), r.j);
check("B'nin metni kopya olarak saklandı", bodies.includes("B düzenledi") && r.j.items.some((i) => i.title === "__conflict__"), r.j);

// 5) silme: güncel baseSeq ile silinir
const cur = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
const live = cur.j.items.find((i) => i.id === A);
r = await post(`/api/books/${BK}/sync`, { cursor: cur.j.cursor, items: [{ id: A, kind: "chapter", title: "", body: "", baseSeq: live.seq, deleted: true }] });
check("güncel silme kabul", r.j.accepted[A] > live.seq, r.j);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] });
check("silinen tombstone olarak gelir", r.j.items.find((i) => i.id === A)?.deleted === true, r.j);

// 6) doğrulama ve yetki
r = await post(`/api/books/not-a-uuid/sync`, { cursor: 0, items: [] }); check("kötü id 400", r.s === 400, r);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [{ id: "x", kind: "chapter", title: "", body: "", baseSeq: 0 }] }); check("kötü gövde 400", r.s === 400, r);
const evil = await fetch(B + `/api/books/${BK}/sync`, { method: "POST", headers: { ...h, origin: "https://evil.example" }, body: JSON.stringify({ cursor: 0, items: [] }) }); check("yabancı origin 403", evil.status === 403, evil.status);
const list = await (await fetch(B + "/api/books", { headers: h })).json(); check("kitap listesi", list.books?.[0]?.title === "Kitap", list);

// 7) passkey seçenekleri (host izinli)
r = await post("/api/auth/register/options", { name: "Deneme" }); check("kayıt seçenekleri", r.s === 200 && r.j.challenge && r.j.authenticatorSelection.residentKey === "required", r);
r = await post("/api/auth/login/options", {}); check("giriş seçenekleri", r.s === 200 && r.j.challenge, r);
r = await post("/api/auth/recover", { code: "YANLIS-KOD" }); check("yanlış kurtarma kodu 400", r.s === 400, r);
r = await post("/api/auth/register/verify", { response: {} }); check("challenge olmadan kayıt reddedilir", r.s === 400, r);

// 8) kitap silme
let d = await fetch(B + `/api/books/${BK}`, { method: "DELETE", headers: h }); check("kitap silinir", d.status === 200, d.status);
r = await post(`/api/books/${BK}/sync`, { cursor: 0, items: [] }); check("silinen kitaba yazma 410", r.s === 410, r);
console.log(ok ? "\nTÜMÜ GEÇTİ" : "\nBAZILARI BAŞARISIZ"); process.exit(ok ? 0 : 1);
