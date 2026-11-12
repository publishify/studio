import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import { recover, sha256 } from "../src/auth";
import type { AppEnv } from "../src/types";

/** The small part of D1 that recover() uses, on a real SQLite database. */
function d1(db: DatabaseSync) {
  const prepare = (sql: string) => {
    const make = (args: unknown[]) => ({
      first: async () => db.prepare(sql).get(...(args as never[])) ?? null,
      run: async () => db.prepare(sql).run(...(args as never[])),
    });
    return { bind: (...args: unknown[]) => make(args), ...make([]) };
  };
  const batch = async (stmts: { run: () => Promise<unknown> }[]) => {
    db.exec("BEGIN");
    for (const s of stmts) await s.run();
    db.exec("COMMIT");
  };
  return { prepare, batch };
}

const CODE = "AAAAA-BBBBB-CCCCC-DDDDD";
const hash = (code: string) => sha256(code.replace(/-/g, ""));

describe("account recovery", () => {
  let db: DatabaseSync;
  const app = new Hono<AppEnv>();
  app.post("/recover", async (c) => recover(c, ((await c.req.json()) as { code: string }).code));
  const post = (code: string) =>
    app.request("/recover", { method: "POST", body: JSON.stringify({ code }) }, { DB: d1(db) } as never);
  const sessionsOf = (id: string) => db.prepare("SELECT id_hash FROM sessions WHERE user_id = ?").all(id);

  beforeEach(async () => {
    db = new DatabaseSync(":memory:");
    db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
    const add = db.prepare("INSERT INTO users (id, name, recovery_hash, created) VALUES (?, 'Yazar', ?, 0)");
    add.run("u1", await hash(CODE));
    add.run("u2", await hash("EEEEE-FFFFF-GGGGG-HHHHH"));
    const session = db.prepare("INSERT INTO sessions (id_hash, user_id, expires) VALUES (?, ?, ?)");
    session.run("old-1", "u1", Date.now() + 1000);
    session.run("old-2", "u1", Date.now() + 1000);
    session.run("other", "u2", Date.now() + 1000);
  });

  it("closes the account's earlier sessions and opens exactly one new one", async () => {
    const r = await post(CODE);
    expect(r.status).toBe(200);
    const left = sessionsOf("u1") as { id_hash: string }[];
    expect(left).toHaveLength(1);
    expect(["old-1", "old-2"]).not.toContain(left[0]!.id_hash);
    expect(r.headers.get("set-cookie")).toContain("pf_session=");
  });

  it("leaves other accounts signed in", async () => {
    await post(CODE);
    expect(sessionsOf("u2")).toHaveLength(1);
  });

  it("invalidates the used code", async () => {
    await post(CODE);
    expect((await post(CODE)).status).toBe(400);
  });

  it("changes nothing for a wrong code", async () => {
    expect((await post("ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ")).status).toBe(400);
    expect(sessionsOf("u1")).toHaveLength(2);
  });
});
