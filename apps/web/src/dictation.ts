// Dictation: the browser's speech recognition (Web Speech API). Works in Chrome/Edge/Safari.
// Privacy: the browser sends audio to its own speech-recognition service (e.g. Chrome → Google); no audio goes to the Publishify server.
import type { EditorView } from "@codemirror/view";
import type { Lang } from "./i18n";

interface Rec {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void; stop(): void;
}
const ctor = (): (new () => Rec) | undefined => {
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};
export const dictationSupported = (): boolean => !!ctor();

const voice: Partial<Record<Lang, [string, string][]>> = {
  tr: [["yeni paragraf", "\n\n"], ["yeni satır", "\n"], ["noktalı virgül", ";"], ["soru işareti", "?"], ["ünlem işareti", "!"], ["ünlem", "!"], ["iki nokta", ":"], ["üç nokta", "…"], ["nokta", "."], ["virgül", ","]],
  en: [["new paragraph", "\n\n"], ["new line", "\n"], ["semicolon", ";"], ["question mark", "?"], ["exclamation mark", "!"], ["colon", ":"], ["ellipsis", "…"], ["period", "."], ["comma", ","]],
};

/** Turns spoken commands ("nokta"/"period", "virgül"/"comma", "yeni satır"/"new line") into punctuation. */
export function applyVoiceCommands(text: string, lang: Lang): string {
  let out = text;
  for (const [phrase, sym] of voice[lang] ?? []) out = out.replace(new RegExp(`\\s*(?:^|\\s)${phrase}(?=\\s|$|[.,!?])`, "giu"), sym);
  return out.replace(/\n +/g, "\n");
}

/** Writes speech at the cursor: fixes spacing, capitalisation and punctuation. */
/** cmd: language of the punctuation commands (tr/en only), locale: speech language for the capitalisation rule. */
export function insertDictated(view: EditorView, raw: string, cmd: Lang | null, locale: string): void {
  let text = cmd ? applyVoiceCommands(raw.trim(), cmd) : raw.trim();
  if (!text) return;
  const { from, to } = view.state.selection.main;
  const prev = view.state.doc.sliceString(Math.max(0, from - 3), from);
  const sentenceStart = from === 0 || /[.!?…]\s$/.test(prev) || /\n$/.test(prev);
  if (sentenceStart && /^[\p{L}]/u.test(text)) text = text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
  const needSpace = from > 0 && !/\s$/.test(prev) && !/^[.,;:!?…\n]/.test(text);
  const insert = `${needSpace ? " " : ""}${text}${/\n$/.test(text) ? "" : " "}`;
  view.dispatch({ changes: { from, to, insert }, selection: { anchor: from + insert.length }, scrollIntoView: true, userEvent: "input.dictate" });
}

/** Starts listening; the returned function stops it. If the browser stops during silence, it restarts by itself. */
export function startDictation(speech: string, onFinal: (text: string) => void, onStop: (reason?: "denied" | "error") => void): () => void {
  const R = ctor();
  if (!R) { onStop("error"); return () => undefined; }
  const rec = new R();
  rec.continuous = true;
  rec.interimResults = false;
  rec.lang = speech;
  let active = true;
  rec.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]!;
      if (r.isFinal) onFinal(r[0]!.transcript);
    }
  };
  rec.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") { active = false; onStop("denied"); }
    else if (e.error !== "no-speech" && e.error !== "aborted") { active = false; onStop("error"); }
  };
  rec.onend = () => {
    if (!active) return;
    window.setTimeout(() => { if (active) try { rec.start(); } catch { active = false; onStop(); } }, 200);
  };
  try { rec.start(); } catch { onStop("error"); return () => undefined; }
  return () => { if (!active) return; active = false; try { rec.stop(); } catch { /* already stopped */ } onStop(); };
}
