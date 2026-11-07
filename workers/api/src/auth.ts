import {
  generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse,
  type AuthenticationResponseJSON, type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { AppEnv } from "./types";

const enc = new TextEncoder();
const bytes = (s: string) => enc.encode(s) as Uint8Array<ArrayBuffer>;
const ALLOWED_HOSTS = new Set(["publishify.app", "localhost"]);
const SESSION_DAYS = 30;
const CHALLENGE_MS = 5 * 60_000;

export const b64url = (b: Uint8Array): string => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const fromB64url = (s: string): Uint8Array<ArrayBuffer> => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};
export async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return b64url(new Uint8Array(d));
}
const randomToken = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));

/** 100-bit recovery code: XXXXX-XXXXX-XXXXX-XXXXX (unambiguous letters). */
function newRecoveryCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return chars.match(/.{5}/g)!.join("-");
}
const normalizeCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "");

type C = Context<AppEnv>;

function rp(c: C): { rpID: string; origin: string } | null {
  const url = new URL(c.req.url);
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  return { rpID: url.hostname, origin: url.origin };
}

async function startSession(c: C, userId: string): Promise<void> {
  const token = randomToken();
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  await c.env.DB.prepare("INSERT INTO sessions (id_hash, user_id, expires) VALUES (?, ?, ?)").bind(await sha256(token), userId, expires).run();
  setCookie(c, "pf_session", token, { httpOnly: true, secure: new URL(c.req.url).protocol === "https:", sameSite: "Lax", path: "/", maxAge: SESSION_DAYS * 86_400 });
}

export async function currentUser(c: C): Promise<{ id: string; name: string } | null> {
  const token = getCookie(c, "pf_session");
  if (!token) return null;
  const row = await c.env.DB.prepare("SELECT u.id, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id_hash = ? AND s.expires > ?")
    .bind(await sha256(token), Date.now()).first<{ id: string; name: string }>();
  return row ?? null;
}

async function saveChallenge(c: C, challenge: string, kind: string, userId?: string, name?: string) {
  const id = randomToken(16);
  await c.env.DB.prepare("DELETE FROM challenges WHERE expires < ?").bind(Date.now()).run();
  await c.env.DB.prepare("INSERT INTO challenges (id, challenge, kind, user_id, name, expires) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, challenge, kind, userId ?? null, name ?? null, Date.now() + CHALLENGE_MS).run();
  setCookie(c, "pf_ch", id, { httpOnly: true, secure: new URL(c.req.url).protocol === "https:", sameSite: "Strict", path: "/api/auth", maxAge: 300 });
}
async function takeChallenge(c: C, kind: string) {
  const id = getCookie(c, "pf_ch");
  if (!id) return null;
  const row = await c.env.DB.prepare("SELECT challenge, user_id, name FROM challenges WHERE id = ? AND kind = ? AND expires > ?").bind(id, kind, Date.now()).first<{ challenge: string; user_id: string | null; name: string | null }>();
  await c.env.DB.prepare("DELETE FROM challenges WHERE id = ?").bind(id).run(); // single-use
  deleteCookie(c, "pf_ch", { path: "/api/auth" });
  return row;
}

async function addCredential(c: C, userId: string, info: { id: string; publicKey: Uint8Array; counter: number; transports?: string[] }) {
  await c.env.DB.prepare("INSERT INTO credentials (id, user_id, public_key, counter, transports, created) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(info.id, userId, info.publicKey, info.counter, JSON.stringify(info.transports ?? []), Date.now()).run();
}

export async function registerOptions(c: C, name: string) {
  const r = rp(c);
  if (!r) return c.json({ error: "host" }, 400);
  const userId = crypto.randomUUID();
  const options = await generateRegistrationOptions({
    rpName: "Publishify", rpID: r.rpID, userName: name || "Yazar", userID: bytes(userId), attestationType: "none",
    authenticatorSelection: { residentKey: "required", userVerification: "preferred" },
  });
  await saveChallenge(c, options.challenge, "register", userId, name || "Yazar");
  return c.json(options);
}

export async function registerVerify(c: C, response: RegistrationResponseJSON) {
  const r = rp(c);
  const ch = await takeChallenge(c, "register");
  if (!r || !ch || !ch.user_id) return c.json({ error: "challenge" }, 400);
  const v = await verifyRegistrationResponse({ response, expectedChallenge: ch.challenge, expectedOrigin: r.origin, expectedRPID: r.rpID }).catch(() => null);
  if (!v?.verified) return c.json({ error: "verify" }, 400);
  const code = newRecoveryCode();
  await c.env.DB.prepare("INSERT INTO users (id, name, recovery_hash, created) VALUES (?, ?, ?, ?)")
    .bind(ch.user_id, ch.name ?? "Yazar", await sha256(normalizeCode(code)), Date.now()).run();
  await addCredential(c, ch.user_id, v.registrationInfo.credential);
  await startSession(c, ch.user_id);
  return c.json({ user: { id: ch.user_id, name: ch.name ?? "Yazar" }, recoveryCode: code });
}

export async function loginOptions(c: C) {
  const r = rp(c);
  if (!r) return c.json({ error: "host" }, 400);
  const options = await generateAuthenticationOptions({ rpID: r.rpID, userVerification: "preferred" });
  await saveChallenge(c, options.challenge, "login");
  return c.json(options);
}

export async function loginVerify(c: C, response: AuthenticationResponseJSON) {
  const r = rp(c);
  const ch = await takeChallenge(c, "login");
  if (!r || !ch) return c.json({ error: "challenge" }, 400);
  const cred = await c.env.DB.prepare("SELECT id, user_id, public_key, counter, transports FROM credentials WHERE id = ?").bind(response.id)
    .first<{ id: string; user_id: string; public_key: ArrayBuffer; counter: number; transports: string | null }>();
  if (!cred) return c.json({ error: "unknown" }, 400);
  const v = await verifyAuthenticationResponse({
    response, expectedChallenge: ch.challenge, expectedOrigin: r.origin, expectedRPID: r.rpID,
    credential: { id: cred.id, publicKey: new Uint8Array(cred.public_key), counter: cred.counter, transports: JSON.parse(cred.transports ?? "[]") },
  }).catch(() => null);
  if (!v?.verified) return c.json({ error: "verify" }, 400);
  await c.env.DB.prepare("UPDATE credentials SET counter = ? WHERE id = ?").bind(v.authenticationInfo.newCounter, cred.id).run();
  await startSession(c, cred.user_id);
  const u = await c.env.DB.prepare("SELECT id, name FROM users WHERE id = ?").bind(cred.user_id).first<{ id: string; name: string }>();
  return c.json({ user: u });
}

export async function recover(c: C, code: string) {
  const row = await c.env.DB.prepare("SELECT id, name FROM users WHERE recovery_hash = ?").bind(await sha256(normalizeCode(code))).first<{ id: string; name: string }>();
  if (!row) return c.json({ error: "code" }, 400);
  const fresh = newRecoveryCode(); // the used code becomes invalid
  await c.env.DB.prepare("UPDATE users SET recovery_hash = ? WHERE id = ?").bind(await sha256(normalizeCode(fresh)), row.id).run();
  await startSession(c, row.id);
  return c.json({ user: row, recoveryCode: fresh });
}

export async function passkeyOptions(c: C) {
  const r = rp(c);
  const u = c.get("user");
  if (!r) return c.json({ error: "host" }, 400);
  const existing = await c.env.DB.prepare("SELECT id FROM credentials WHERE user_id = ?").bind(u.id).all<{ id: string }>();
  const options = await generateRegistrationOptions({
    rpName: "Publishify", rpID: r.rpID, userName: u.name, userID: bytes(u.id), attestationType: "none",
    excludeCredentials: existing.results.map((x) => ({ id: x.id })),
    authenticatorSelection: { residentKey: "required", userVerification: "preferred" },
  });
  await saveChallenge(c, options.challenge, "passkey", u.id);
  return c.json(options);
}

export async function passkeyVerify(c: C, response: RegistrationResponseJSON) {
  const r = rp(c);
  const u = c.get("user");
  const ch = await takeChallenge(c, "passkey");
  if (!r || !ch || ch.user_id !== u.id) return c.json({ error: "challenge" }, 400);
  const v = await verifyRegistrationResponse({ response, expectedChallenge: ch.challenge, expectedOrigin: r.origin, expectedRPID: r.rpID }).catch(() => null);
  if (!v?.verified) return c.json({ error: "verify" }, 400);
  await addCredential(c, u.id, v.registrationInfo.credential);
  return c.json({ ok: true });
}

export async function logout(c: C) {
  const token = getCookie(c, "pf_session");
  if (token) await c.env.DB.prepare("DELETE FROM sessions WHERE id_hash = ?").bind(await sha256(token)).run();
  deleteCookie(c, "pf_session", { path: "/" });
  return c.json({ ok: true });
}

