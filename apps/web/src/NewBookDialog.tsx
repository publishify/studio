import { X } from "lucide-react";
import { type Lang, t } from "./i18n";
import { type Template, templateGroups, templates } from "./templates";
import { useStore } from "./store";

/** Yeni kitap: kategoriye göre örnek şablon seçimi. */
export function NewBookDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const addBook = useStore((s) => s.addBook);
  const li = lang === "tr" ? 0 : 1;
  const groups = (Object.keys(templateGroups) as Template["group"][]).map((g) => ({ g, list: templates.filter((x) => x.group === g) })).filter((x) => x.list.length);
  const pick = (id: string) => { addBook(id); onClose(); };
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide" role="dialog" aria-label={t(lang, "newBookTitle")}>
        <div className="modal-head">
          <h2>{t(lang, "newBookTitle")}</h2>
          <button className="icon" onClick={onClose} aria-label={t(lang, "close")}><X /></button>
        </div>
        <p className="muted">{t(lang, "pickTemplate")}</p>
        <div className="tpl-scroll">
          {groups.map(({ g, list }) => (
            <section key={g}>
              <h3 className="tpl-group">{templateGroups[g][li]}</h3>
              <div className="tpl-grid">
                {list.map((x) => (
                  <button key={x.id} className="tpl" onClick={() => pick(x.id)}>
                    <strong>{x.name[li]}</strong>
                    <span>{x.desc[li]}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
