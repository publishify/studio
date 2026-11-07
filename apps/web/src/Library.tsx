import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AccountDialog, AccountIcon } from "./Account";
import { Logo } from "./Logo";
import { BookDialog } from "./BookDialog";
import { useBlobUrl } from "./media";
import { NewBookDialog } from "./NewBookDialog";
import { LibraryTrash } from "./Trash";
import { type Lang, t, uiLangs } from "./i18n";
import { type Book, live, useStore, wordCount } from "./store";

function Cover({ book }: { book: Book }) {
  const { url } = useBlobUrl(book.cover);
  return (
    <div className={`cover ${url ? "has-img" : ""}`} style={url ? { backgroundImage: `url(${url})` } : undefined} role="img" aria-label={book.title}>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  );
}

export function Library({ lang }: { lang: Lang }) {
  const { openBook, trashBook, setSettings } = useStore();
  const [newBook, setNewBook] = useState(false);
  const books = useStore((x) => x.books).filter((b) => !b.trashed);
  const [edit, setEdit] = useState<string | null>(null);
  const [acct, setAcct] = useState(false);
  const account = useStore((x) => x.account);
  const status = useStore((x) => x.sync.status);
  const words = (b: Book) => live(b).reduce((n, i) => n + wordCount(i.body), 0);
  return (
    <div className="library">
      {acct && <AccountDialog lang={lang} onClose={() => setAcct(false)} />}
      {edit && <BookDialog bookId={edit} lang={lang} onClose={() => setEdit(null)} />}
      {newBook && <NewBookDialog lang={lang} onClose={() => setNewBook(false)} />}
      <header>
        <Logo height={24} />
        <span className="spacer" />
        <button className="icon" title="Hesap" onClick={() => setAcct(true)}><AccountIcon status={status} signedIn={!!account} /></button>
        <select className="field langpick" value={lang} aria-label={t(lang, "language")} onChange={(e) => setSettings({ lang: e.target.value as Lang })}>
          {uiLangs.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
        </select>
        <button className="btn primary" onClick={() => setNewBook(true)}><Plus size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "newBook")}</button>
      </header>
      <h2>{t(lang, "library")}</h2>
      {books.length === 0 && <p className="muted">{t(lang, "empty")}</p>}
      <div className="shelf">
        {books.map((b) => (
          <article key={b.id} className="book" onClick={() => openBook(b.id)}>
            <Cover book={b} />
            <div className="meta">
              <span>{words(b).toLocaleString(lang)} {t(lang, "words")} · {live(b).filter((i) => i.kind === "chapter").length} {t(lang, "chapters")}</span>
              <span>
                <button className="link-danger" title={t(lang, "editBook")} onClick={(e) => { e.stopPropagation(); setEdit(b.id); }}><Pencil size={13} style={{ display: "inline", verticalAlign: "-2px" }} /></button>
                {" "}
                <button className="link-danger" onClick={(e) => { e.stopPropagation(); trashBook(b.id); }}>{t(lang, "del")}</button>
              </span>
            </div>
          </article>
        ))}
      </div>
      <LibraryTrash lang={lang} />
    </div>
  );
}
