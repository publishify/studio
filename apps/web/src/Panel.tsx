import { Globe, History, Settings, Sparkles, Target, Volume2 } from "lucide-react";
import { AudioTab } from "./AudioTab";
import { PublishTab } from "./PublishTab";
import { type Lang, t, uiLangs } from "./i18n";
import { type Item, type Theme, useStore, wordCount } from "./store";
import { contrast, themeColors, themeOrder } from "./themes";

export type PanelKind = "board" | "audio" | "publish" | "history" | "stats" | "settings";
export const panelTabs: { id: PanelKind; icon: typeof History; label: "board" | "audio" | "publish" | "history" | "stats" | "settings" }[] = [
  { id: "board", icon: Sparkles, label: "board" },
  { id: "audio", icon: Volume2, label: "audio" },
  { id: "publish", icon: Globe, label: "publish" },
  { id: "history", icon: History, label: "history" },
  { id: "stats", icon: Target, label: "stats" },
  { id: "settings", icon: Settings, label: "settings" },
];

export function Panel({ kind, setKind, item, bookWords, lang, onRestore }: { kind: PanelKind; setKind: (k: PanelKind) => void; item: Item; bookWords: number; lang: Lang; onRestore: () => void }) {
  const s = useStore();
  const { snapshot, restore, setSettings } = s;
  const { dailyGoal, theme, fontSize } = s.settings;
  const pct = Math.min(100, Math.round((s.daily.words / Math.max(1, dailyGoal)) * 100));
  const chapterWords = wordCount(item.body);

  return (
    <aside className="panel">
      <div className="tabs">
        {panelTabs.map((p) => (
          <button key={p.id} className="icon" aria-pressed={kind === p.id} title={t(lang, p.label)} onClick={() => setKind(p.id)}>
            <p.icon />
          </button>
        ))}
      </div>
      <div className="pbody">
        {kind === "board" && (
          <>
            <h3>{t(lang, "boardTitle")}</h3>
            <p>{t(lang, "boardText")}</p>
            <button className="btn primary" disabled>{t(lang, "boardBtn")}</button>
            <p className="muted">{t(lang, "boardSoon")}</p>
            <h3>{t(lang, "dashboard")}</h3>
            <div className="dash">{["#3f8f5b", "#d6a93a", "#9a9a94", "#c4513f"].map((c) => <i key={c} style={{ background: c }} />)}</div>
            <p className="muted">{t(lang, "dashboardSoon")}</p>
          </>
        )}
        {kind === "audio" && <AudioTab item={item} lang={lang} />}
        {kind === "publish" && <PublishTab lang={lang} />}
        {kind === "history" && (
          <>
            <h3>{t(lang, "history")}</h3>
            <button className="btn" onClick={() => snapshot(item.id, "manual")}>{t(lang, "snapshot")}</button>
            {item.versions.length === 0 && <p className="muted">{t(lang, "noVersions")}</p>}
            <ul className="versions">
              {item.versions.map((v) => (
                <li key={v.t} className="card">
                  <div className="vhead">
                    <span>{new Date(v.t).toLocaleString(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="muted">{wordCount(v.body)} {t(lang, "words")}</span>
                  </div>
                  <p className="muted">{v.body.replace(/\s+/g, " ").slice(0, 140)}…</p>
                  <button className="btn" onClick={() => { restore(item.id, v); onRestore(); }}>{t(lang, "restore")}</button>
                </li>
              ))}
            </ul>
          </>
        )}
        {kind === "stats" && (
          <>
            <div className="card">
              <div className="kv"><span>{t(lang, "wordsToday")}</span><span>{s.daily.words} / {dailyGoal}</span></div>
              <div className="bar"><b style={{ width: `${pct}%` }} /></div>
              <button className="btn" onClick={() => { const n = prompt(t(lang, "goal"), String(dailyGoal)); if (n && +n > 0) setSettings({ dailyGoal: Math.round(+n) }); }}>{t(lang, "goal")}</button>
            </div>
            <div className="card">
              <div className="kv"><span>{t(lang, "chapterWords")}</span><span>{chapterWords.toLocaleString(lang)}</span></div>
              <div className="kv"><span>{t(lang, "bookWords")}</span><span>{bookWords.toLocaleString(lang)}</span></div>
              <div className="kv"><span>{t(lang, "readTime")}</span><span>{Math.max(1, Math.round(bookWords / 230))} {t(lang, "min")}</span></div>
            </div>
          </>
        )}
        {kind === "settings" && (
          <>
            <h3>{t(lang, "theme")}</h3>
            <div className="swatches" role="group" aria-label={t(lang, "theme")}>
              {themeOrder.map((th) => {
                const c = th === "custom" ? { bg: s.settings.customBg, ink: s.settings.customInk } : themeColors[th];
                return (
                  <button key={th} className={`swatch ${th === "custom" ? "custom" : ""}`} style={{ background: c.bg, color: c.ink }} title={t(lang, th)} aria-label={t(lang, th)} aria-pressed={theme === th} onClick={() => setSettings({ theme: th as Theme })}>Aa</button>
                );
              })}
            </div>
            {theme === "custom" && (
              <div className="colors">
                <label htmlFor="c-bg">{t(lang, "bgColor")}</label>
                <input id="c-bg" type="color" value={s.settings.customBg} onChange={(e) => setSettings({ customBg: e.target.value })} />
                <label htmlFor="c-ink">{t(lang, "textColor")}</label>
                <input id="c-ink" type="color" value={s.settings.customInk} onChange={(e) => setSettings({ customInk: e.target.value })} />
                {contrast(s.settings.customBg, s.settings.customInk) < 4.5 && <p className="muted" style={{ gridColumn: "1 / -1", margin: 0 }} role="alert">{t(lang, "lowContrast")}</p>}
              </div>
            )}
            <h3>{t(lang, "language")}</h3>
            <select className="field" value={lang} aria-label={t(lang, "language")} onChange={(e) => setSettings({ lang: e.target.value as Lang })}>
              {uiLangs.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
            </select>
            <h3>{t(lang, "fontSize")}</h3>
            <div className="seg">
              <button onClick={() => setSettings({ fontSize: Math.max(14, fontSize - 1) })}>A−</button>
              <button disabled>{fontSize}</button>
              <button onClick={() => setSettings({ fontSize: Math.min(30, fontSize + 1) })}>A+</button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
