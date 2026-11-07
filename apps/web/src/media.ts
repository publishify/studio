// Kapak ve seslendirme dosyaları: büyük olduğu için kitaplık kaydına değil, ayrı IndexedDB girdilerine yazılır.
import { del, get, set } from "idb-keyval";
import { useEffect, useState } from "react";

export interface MediaRef {
  id: string;
  name: string;
  type: string;
  size: number;
  /** Drive'daki dosya bağı. */
  drive?: { fileId: string; version: string };
  /** Yeni/değişmiş: Drive'a yüklenmeyi bekliyor. */
  up?: boolean;
}

export const MAX_AUDIO = 300 * 1024 * 1024;
const key = (id: string) => `publishify:media:${id}`;
export const putBlob = (id: string, b: Blob) => set(key(id), b);
export const getBlob = (id: string) => get<Blob>(key(id));
export const delBlob = (id: string) => del(key(id)).catch(() => undefined);
export const newRef = (blob: Blob, name: string, extra: Partial<MediaRef> = {}): MediaRef => ({ id: crypto.randomUUID(), name, type: blob.type || "application/octet-stream", size: blob.size, ...extra });

/** Kapak: çok büyükse küçültüp JPEG'e çevirir (kitaplık ve e-kitap için yeterli). */
export async function prepareCover(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    if (k === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise<Blob>((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("cover"))), "image/jpeg", 0.9));
  } catch {
    return file;
  }
}

/** Yerelde saklanan dosyanın geçici adresi; yoksa null (Drive'dan henüz indirilmemiş). */
export function useBlobUrl(ref: MediaRef | undefined, reload = 0): { url: string | null; loading: boolean } {
  const [state, setState] = useState<{ url: string | null; loading: boolean }>({ url: null, loading: !!ref });
  useEffect(() => {
    let dead = false;
    let url: string | null = null;
    if (!ref) { setState({ url: null, loading: false }); return; }
    setState({ url: null, loading: true });
    void getBlob(ref.id).then((b) => {
      if (dead) return;
      if (b) url = URL.createObjectURL(b);
      setState({ url, loading: false });
    });
    return () => { dead = true; if (url) URL.revokeObjectURL(url); };
  }, [ref?.id, reload]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}
