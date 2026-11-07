import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { type Lang, t } from "./i18n";
import { type BookLang, bookLangOf, bookLangs } from "./languages";
import { useBlobUrl } from "./media";
import { type Genre, useStore } from "./store";

/** Edit book title and author. */
export function BookDialog({ bookId, lang, onClose }: { bookId: string; lang: Lang; onClose: () => void }) {
  const book = useStore((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useStore((s) => s.updateBook);
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [genre, setGenre] = useState<Genre>(book?.genre ?? "roman");
  const [wlang, setWlang] = useState<BookLang>(book ? bookLangOf(book, lang) : lang);
  const { setCover, removeCover } = useStore();
  const { url } = useBlobUrl(book?.cover);
  const pick = useRef<HTMLInputElement>(null);
  if (!book) return null;
  const save = () => { updateBook(bookId, { title: title.trim() || t(lang, "untitledBook"), author: author.trim(), genre, lang: wlang }); onClose(); };
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-label={t(lang, "editBook")} onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="modal-head">
          <h2>{t(lang, "editBook")}</h2>
          <button type="button" className="icon" onClick={onClose} aria-label={t(lang, "close")}><X /></button>
        </div>
        <div className="coverpick">
          <div className={`thumb ${url ? "has-img" : ""}`} style={url ? { backgroundImage: `url(${url})` } : undefined}>{!url && <ImagePlus />}</div>
          <div>
            <strong>{t(lang, "coverTitle")}</strong>
            <input ref={pick} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void setCover(bookId, f); e.target.value = ""; }} />
            <div className="row2">
              <button type="button" className="btn" onClick={() => pick.current?.click()}>{book.cover ? t(lang, "replaceFile") : t(lang, "uploadCover")}</button>
              {book.cover && <button type="button" className="btn" onClick={() => removeCover(bookId)}>{t(lang, "removeFile")}</button>}
            </div>
            <p className="muted">{t(lang, "coverHint")}</p>
          </div>
        </div>
        <label className="muted">{t(lang, "title")}</label>
        <input className="field" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        <label className="muted">{t(lang, "author")}</label>
        <input className="field" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={120} />
        <label className="muted">{t(lang, "writingLang")}</label>
        <select className="field" value={wlang} onChange={(e) => setWlang(e.target.value as BookLang)}>
          {bookLangs.map((l) => <option key={l.code} value={l.code}>{l.native} — {lang === "tr" ? l.tr : l.en}</option>)}
        </select>
        <p className="muted">{t(lang, "langHint")}</p>
        <label className="muted">{t(lang, "genre")}</label>
        <select className="field" value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
          <option value="roman">{t(lang, "genreRoman")}</option>
          <option value="novella">{t(lang, "genreNovella")}</option>
          <option value="hikaye">{t(lang, "genreHikaye")}</option>
          <option value="diger">{t(lang, "genreDiger")}</option>
        </select>
        <p className="muted">{t(lang, "genreHint")}</p>
        <button type="submit" className="btn primary">{t(lang, "save")}</button>
      </form>
    </div>
  );
}
