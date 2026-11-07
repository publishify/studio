import { Download, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { fetchMedia, useDrive } from "./drive";
import { type Lang, t } from "./i18n";
import { MAX_AUDIO, useBlobUrl } from "./media";
import { type Item, useStore } from "./store";

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(n > 10 * 1024 * 1024 ? 0 : 1)} MB`;

/** Bölümün seslendirme dosyası: yükle, dinle, Drive'a gönder. */
export function AudioTab({ item, lang }: { item: Item; lang: Lang }) {
  const { setAudio, removeAudio } = useStore();
  const drive = useDrive((s) => s.status);
  const [reload, setReload] = useState(0);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const pick = useRef<HTMLInputElement>(null);
  const a = item.audio;
  const { url, loading } = useBlobUrl(a, reload);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_AUDIO) { setMsg(t(lang, "tooBig")); return; }
    setMsg("");
    void setAudio(item.id, f);
  };
  const download = async () => {
    if (!a) return;
    setBusy(true);
    setMsg("");
    try { await fetchMedia(a); setReload((n) => n + 1); } catch { setMsg(t(lang, "failed")); } finally { setBusy(false); }
  };
  const state = !a ? "" : a.up || !a.drive ? (drive === "off" ? t(lang, "localOnly") : t(lang, "uploading")) : t(lang, "onDrive");

  return (
    <>
      <h3>{t(lang, "audio")}</h3>
      <input ref={pick} type="file" accept="audio/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
      {!a && <p className="muted">{t(lang, "audioNone")}</p>}
      {!a && <button className="btn primary" onClick={() => pick.current?.click()}><Upload size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "uploadAudio")}</button>}
      {a && (
        <div className="card">
          <div className="kv"><span className="name">{a.name}</span><span>{mb(a.size)}</span></div>
          <div className="muted">{state}</div>
          {url && <audio controls src={url} style={{ width: "100%" }} />}
          {!url && !loading && a.drive && <button className="btn" disabled={busy || drive === "off"} onClick={() => void download()}><Download size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "fromDrive")}</button>}
          <div className="row2">
            <button className="btn" onClick={() => pick.current?.click()}>{t(lang, "replaceFile")}</button>
            <button className="btn" onClick={() => removeAudio(item.id)}><Trash2 size={14} style={{ display: "inline", verticalAlign: "-2px" }} /> {t(lang, "removeFile")}</button>
          </div>
        </div>
      )}
      {msg && <p className="muted" role="alert">{msg}</p>}
    </>
  );
}
