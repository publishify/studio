import { Bold, CheckSquare, Code, Heading1, Heading2, Heading3, Italic, Link2, List, ListOrdered, Mic, MicOff, Minus, Quote, Strikethrough } from "lucide-react";
import type { ReactNode } from "react";
import { type Lang, type Key, t } from "./i18n";

export type Cmd = "bold" | "italic" | "strike" | "code" | "h1" | "h2" | "h3" | "bullet" | "numbered" | "check" | "quote" | "link" | "hr";

const items: ({ cmd: Cmd; icon: ReactNode; label: Key; hint?: string } | "sep")[] = [
  { cmd: "bold", icon: <Bold />, label: "bold", hint: "⌘B" },
  { cmd: "italic", icon: <Italic />, label: "italic", hint: "⌘I" },
  { cmd: "strike", icon: <Strikethrough />, label: "strike" },
  { cmd: "code", icon: <Code />, label: "code" },
  "sep",
  { cmd: "h1", icon: <Heading1 />, label: "h1" },
  { cmd: "h2", icon: <Heading2 />, label: "h2" },
  { cmd: "h3", icon: <Heading3 />, label: "h3" },
  "sep",
  { cmd: "bullet", icon: <List />, label: "list" },
  { cmd: "numbered", icon: <ListOrdered />, label: "numbered" },
  { cmd: "check", icon: <CheckSquare />, label: "checklist" },
  "sep",
  { cmd: "quote", icon: <Quote />, label: "quote" },
  { cmd: "link", icon: <Link2 />, label: "link" },
  { cmd: "hr", icon: <Minus />, label: "hr" },
];

export function Toolbar({ lang, onCmd, right, dictating, onDictate }: { lang: Lang; onCmd: (c: Cmd) => void; right: ReactNode; dictating: boolean; onDictate: () => void }) {
  return (
    <div className="toolbar" role="toolbar">
      {items.map((it, i) =>
        it === "sep" ? (
          <span key={i} className="sep" />
        ) : (
          <button key={it.cmd} className="icon" title={`${t(lang, it.label)}${it.hint ? ` (${it.hint})` : ""}`} aria-label={t(lang, it.label)} onMouseDown={(e) => e.preventDefault()} onClick={() => onCmd(it.cmd)}>
            {it.icon}
          </button>
        ),
      )}
      <span className="sep" />
      <button className={`icon ${dictating ? "on rec" : ""}`} aria-pressed={dictating} title={dictating ? t(lang, "dictateStop") : `${t(lang, "dictate")} — ${t(lang, "dictateHint")}`} aria-label={t(lang, "dictate")} onMouseDown={(e) => e.preventDefault()} onClick={onDictate}>{dictating ? <MicOff /> : <Mic />}</button>
      <span className="sep" />
      {right}
    </div>
  );
}
