import { DurableObject } from "cloudflare:workers";
import type { Env, OutItem, SyncIn, SyncOut } from "./types";

type Row = { id: string; kind: "part" | "chapter" | "scene"; title: string; body: string; deleted: number; seq: number };

/**
 * Kitap başına bir Durable Object (SQLite). Birim bölümdür: her bölümün sunucu sıra numarası (seq) var.
 * İstemci, bölümü en son hangi seq ile aldığını (baseSeq) bildirir; farklıysa çakışmadır ve
 * iki sürüm de korunur ("çakışan kopya"). Hiçbir metin sessizce ezilmez.
 */
export class BookDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, kind TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0, seq INTEGER NOT NULL);
        CREATE INDEX IF NOT EXISTS items_seq ON items(seq);
        CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);
      `);
    });
  }

  private num(k: string): number {
    const r = this.ctx.storage.sql.exec<{ v: string }>("SELECT v FROM meta WHERE k = ?", k).toArray()[0];
    return r ? Number(r.v) : 0;
  }
  private put(k: string, v: string | number) {
    this.ctx.storage.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", k, String(v));
  }
  private text(k: string): string | null {
    return this.ctx.storage.sql.exec<{ v: string }>("SELECT v FROM meta WHERE k = ?", k).toArray()[0]?.v ?? null;
  }

  sync(input: SyncIn): SyncOut {
    return this.ctx.storage.transactionSync(() => {
      const sql = this.ctx.storage.sql;
      let seq = this.num("seq");
      const accepted: Record<string, number> = {};
      const conflicts: { id: string; copyId: string }[] = [];
      const forceSend = new Set<string>();

      for (const it of input.items) {
        const row = sql.exec<Row>("SELECT id, kind, title, body, deleted, seq FROM items WHERE id = ?", it.id).toArray()[0];
        if (it.deleted) {
          if (row && !row.deleted && row.seq <= it.baseSeq) {
            sql.exec("UPDATE items SET deleted = 1, body = '', seq = ? WHERE id = ?", ++seq, it.id);
            accepted[it.id] = seq;
          } else if (row) {
            forceSend.add(it.id); // sunucuda daha yeni; silme reddedildi, güncel sürüm geri gider
          }
          continue;
        }
        if (!row) {
          sql.exec("INSERT INTO items (id, kind, title, body, deleted, seq) VALUES (?, ?, ?, ?, 0, ?)", it.id, it.kind, it.title, it.body, ++seq);
          accepted[it.id] = seq;
        } else if (!row.deleted && row.body === it.body && row.title === it.title && row.kind === it.kind) {
          accepted[it.id] = row.seq; // zaten aynı
        } else if (!row.deleted && row.seq === it.baseSeq) {
          sql.exec("UPDATE items SET title = ?, body = ?, kind = ?, seq = ? WHERE id = ?", it.title, it.body, it.kind, ++seq, it.id);
          accepted[it.id] = seq;
        } else {
          // Çakışma: sunucu sürümü kalır, istemcinin metni yeni bir bölüm olarak saklanır.
          const copyId = crypto.randomUUID();
          // Bölüm başlığı gövdeden türetildiği için kopya, title alanındaki __conflict__ işaretiyle bilinir.
          const title = it.kind === "part" ? `${it.title} (çakışan kopya)` : "__conflict__";
          sql.exec("INSERT INTO items (id, kind, title, body, deleted, seq) VALUES (?, ?, ?, ?, 0, ?)", copyId, it.kind, title, it.body, ++seq);
          conflicts.push({ id: it.id, copyId });
          forceSend.add(it.id);
          forceSend.add(copyId);
        }
      }

      let orderOut: string[] | null = null;
      if (input.order) {
        this.put("order", JSON.stringify(input.order));
        this.put("order_seq", ++seq);
      } else if (this.num("order_seq") > input.cursor) {
        orderOut = JSON.parse(this.text("order") ?? "[]") as string[];
      }
      let metaOut: { title: string; author: string; genre?: string; lang?: string } | null = null;
      if (input.meta) {
        this.put("meta", JSON.stringify(input.meta));
        this.put("meta_seq", ++seq);
      } else if (this.num("meta_seq") > input.cursor) {
        metaOut = JSON.parse(this.text("meta") ?? "null") as { title: string; author: string; genre?: string; lang?: string } | null;
      }
      this.put("seq", seq);

      const changed = sql.exec<Row>("SELECT id, kind, title, body, deleted, seq FROM items WHERE seq > ?", input.cursor).toArray();
      const items: OutItem[] = [];
      for (const r of changed) {
        if (accepted[r.id] === r.seq && !forceSend.has(r.id)) continue; // istemcinin kendi yazdığı
        items.push({ id: r.id, kind: r.kind, title: r.title, body: r.body, deleted: !!r.deleted, seq: r.seq });
      }
      for (const id of forceSend) {
        if (items.some((x) => x.id === id)) continue;
        const r = sql.exec<Row>("SELECT id, kind, title, body, deleted, seq FROM items WHERE id = ?", id).toArray()[0];
        if (r) items.push({ id: r.id, kind: r.kind, title: r.title, body: r.body, deleted: !!r.deleted, seq: r.seq });
      }
      return { cursor: seq, items, order: orderOut, meta: metaOut, accepted, conflicts };
    });
  }

  wipe(): void {
    this.ctx.storage.deleteAll();
  }
}
