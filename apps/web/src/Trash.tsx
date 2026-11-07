import { RotateCcw, Trash2, X } from "lucide-react";
import { useState } from "react";
import { type Lang, t } from "./i18n";
import { type Book, titleOf, useStore } from "./store";

/** Two-step confirmation in place, before permanent delete (not a browser dialog). */
export function EmptyTrashButton({ lang, onConfirm }: { lang: Lang; onConfirm: () => void }) {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button className="btn" onClick={() => setAsk(true)}><Trash2 size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "emptyTrash")}</button>;
  return (
    <div className="ask">
      <span>{t(lang, "emptyAsk")}</span>
      <button className="btn danger" onClick={() => { onConfirm(); setAsk(false); }}>{t(lang, "yesDelete")}</button>
      <button className="btn" onClick={() => setAsk(false)}>{t(lang, "cancel")}</button>
    </div>
  );
}

const when = (n: number, lang: Lang) => new Date(n).toLocaleDateString(lang, { day: "numeric", month: "short" });

/** In the library: books in the trash. */
export function LibraryTrash({ lang }: { lang: Lang }) {
  const all = useStore((s) => s.books);
  const books = all.filter((b) => b.trashed);
  const { restoreBook, purgeBook, emptyBookTrash } = useStore();
  if (!books.length) return null;
  return (
    <section className="trash">
      <h2>{t(lang, "trash")} ({books.length})</h2>
      <p className="muted">{t(lang, "trashNote")}</p>
      {books.map((b) => (
        <div key={b.id} className="trow">
          <span className="name">{b.title}</span>
          <small>{b.trashed ? when(b.trashed, lang) : ""}</small>
          <button className="btn" onClick={() => restoreBook(b.id)}><RotateCcw size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "untrash")}</button>
          <button className="link-danger" onClick={() => purgeBook(b.id)}>{t(lang, "deleteForever")}</button>
        </div>
      ))}
      <EmptyTrashButton lang={lang} onConfirm={emptyBookTrash} />
    </section>
  );
}

/** In the sidebar: this book's chapters in the trash. */
export function ItemTrash({ book, lang }: { book: Book; lang: Lang }) {
  const { restoreItem, purgeItem, emptyItemTrash } = useStore();
  const [open, setOpen] = useState(false);
  const items = book.items.filter((i) => i.trashed);
  if (!items.length) return null;
  return (
    <div className="sb-trash">
      <button className="sb-trash-head" onClick={() => setOpen((o) => !o)}><Trash2 /> {t(lang, "trash")} ({items.length})</button>
      {open && (
        <>
          {items.map((i) => (
            <div key={i.id} className="trow">
              <span className="name">{titleOf(i, i.kind === "part" ? t(lang, "newPart") : t(lang, "untitled"))}</span>
              <button className="icon" title={t(lang, "untrash")} onClick={() => restoreItem(i.id)}><RotateCcw /></button>
              <button className="icon" title={t(lang, "deleteForever")} onClick={() => purgeItem(i.id)}><X /></button>
            </div>
          ))}
          <EmptyTrashButton lang={lang} onConfirm={emptyItemTrash} />
        </>
      )}
    </div>
  );
}
