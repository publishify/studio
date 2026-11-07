import { ExternalLink, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { publishChapters } from "./export";
import { type Lang, t } from "./i18n";
import { defaultKind, pubKinds } from "./kinds";
import { bookLangOf } from "./languages";
import { slugify } from "./slug";
import { activeBook, useStore } from "./store";
import { api } from "./sync";

interface Pub { id: string; slug: string; description: string; kind?: string; updated: number }

/** Yayınla (CMS): kitabı herkese açık bir sayfa olarak yayımla, güncelle ya da kaldır. */
export function PublishTab({ lang }: { lang: Lang }) {
  const book = useStore(activeBook);
  const account = useStore((s) => s.account);
  const [pub, setPub] = useState<Pub | null>(null);
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [kind, setKind] = useState("kitap");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!book || !account) return;
    let dead = false;
    void api<{ books: Pub[] }>("/publish").then((r) => {
      if (dead) return;
      const mine = r.data.books?.find((b) => b.id === book.id) ?? null;
      setPub(mine);
      setSlug(mine?.slug ?? (slugify(book.title) || `kitap-${book.id.slice(0, 6)}`));
      setDesc(mine?.description ?? "");
      setKind(mine?.kind ?? defaultKind(book));
    });
    return () => { dead = true; };
  }, [book?.id, account?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!book) return null;
  if (!account) return <><h3>{t(lang, "publish")}</h3><p className="muted">{t(lang, "needAccount")}</p></>;

  const chapters = publishChapters(book);
  const url = `${location.origin}/k/${pub?.slug ?? slug}`;
  const share = async (u: string, title: string) => {
    // Telefon ve Mac'te sistemin paylaşma menüsü; desteklenmiyorsa bağlantı kopyalanır.
    if (navigator.share) { try { await navigator.share({ title, url: u }); } catch { /* vazgeçildi */ } return; }
    void navigator.clipboard?.writeText(u);
    setCopied(true);
  };
  const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 60;

  const publish = async () => {
    setBusy(true);
    setMsg("");
    try {
      const r = await api<{ slug?: string; updated?: number; error?: string }>(`/publish/${book.id}`, {
        method: "PUT",
        body: { slug, title: book.title || "—", author: book.author, description: desc.trim(), genre: book.genre ?? "", kind, lang: bookLangOf(book, lang), chapters },
      });
      if (r.status === 200) setPub({ id: book.id, slug, description: desc.trim(), kind, updated: r.data.updated ?? Date.now() });
      else if (r.status === 409) setMsg(t(lang, "slugTaken"));
      else if (r.status === 429) setMsg(t(lang, "tooMany"));
      else setMsg(t(lang, "failed"));
    } catch { setMsg(t(lang, "failed")); } finally { setBusy(false); }
  };
  const unpublish = async () => {
    setBusy(true);
    await api(`/publish/${book.id}`, { method: "DELETE" }).catch(() => undefined);
    setPub(null);
    setBusy(false);
  };

  return (
    <>
      <h3>{t(lang, "publish")}</h3>
      <p className="muted">{t(lang, "publishNote")}</p>
      {pub && (
        <div className="card">
          <div className="kv"><span>{t(lang, "publishedAs")}</span><span className="muted">{new Date(pub.updated).toLocaleString(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="pub-url"><ExternalLink size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {url.replace(/^https?:\/\//, "")}</a>
          <div className="row2">
            <button className="btn" onClick={() => { void navigator.clipboard?.writeText(url); setCopied(true); }}>{copied ? t(lang, "copied") : t(lang, "copy")}</button>
            <button className="btn" onClick={() => void share(url, book.title)}><Share2 size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "share")}</button>
          </div>
        </div>
      )}
      <label className="muted" htmlFor="pub-kind">{t(lang, "kindLabel")}</label>
      <select id="pub-kind" className="field" value={kind} onChange={(e) => setKind(e.target.value)}>
        {pubKinds.map((k) => <option key={k.id} value={k.id}>{lang === "tr" ? k.tr : k.en}</option>)}
      </select>
      <label className="muted" htmlFor="pub-slug">{t(lang, "slugLabel")}</label>
      <input id="pub-slug" className="field mono" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} maxLength={60} dir="ltr" />
      {!valid && <p className="muted" role="alert">{t(lang, "slugRule")}</p>}
      <label className="muted" htmlFor="pub-desc">{t(lang, "descLabel")}</label>
      <textarea id="pub-desc" className="field" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={500} />
      <p className="muted">{chapters.length} {t(lang, "chapters")}</p>
      <button className="btn primary" disabled={busy || !valid || chapters.length === 0} onClick={() => void publish()}>{pub ? t(lang, "updateBtn") : t(lang, "publishBtn")}</button>
      {pub && <button className="btn" disabled={busy} onClick={() => void unpublish()}>{t(lang, "unpublish")}</button>}
      {msg && <p className="muted" role="alert">{msg}</p>}
    </>
  );
}
