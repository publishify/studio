import type { BookDO } from "./book-do";

export interface Env {
  DB: D1Database;
  BOOKS: DurableObjectNamespace<BookDO>;
  ASSETS: Fetcher;
}

export type User = { id: string; name: string };
export type AppEnv = { Bindings: Env; Variables: { user: User } };

export interface SyncItem {
  id: string;
  kind: "part" | "chapter" | "scene";
  title: string;
  body: string;
  /** İstemcinin bu bölümü son eşitlediği sunucu sıra numarası (0 = yeni). */
  baseSeq: number;
  deleted?: boolean;
}
export interface SyncIn {
  cursor: number;
  meta?: { title: string; author: string; genre?: string; lang?: string };
  order?: string[];
  items: SyncItem[];
}
export interface OutItem { id: string; kind: "part" | "chapter" | "scene"; title: string; body: string; deleted: boolean; seq: number }
export interface SyncOut {
  cursor: number;
  items: OutItem[];
  order: string[] | null;
  meta: { title: string; author: string; genre?: string; lang?: string } | null;
  accepted: Record<string, number>;
  conflicts: { id: string; copyId: string }[];
}
