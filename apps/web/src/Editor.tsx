import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { GFM } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";
import { useEffect, useRef } from "react";
import { toggleWrap } from "./commands";
import { focusDim, typewriter } from "./focusMode";
import { type BookLang, htmlLang, isRtl } from "./languages";
import { livePreview } from "./livePreview";

interface Props {
  docId: string;
  value: string;
  focus: boolean;
  typewriter: boolean;
  onChange: (text: string) => void;
  onView: (v: EditorView | null) => void;
  hint: string;
  bookLang: BookLang;
}

const mdStyle = HighlightStyle.define([
  { tag: t.strong, fontWeight: "700" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.monospace, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.86em", backgroundColor: "var(--bg-hover)", borderRadius: "4px", padding: "1px 4px" },
  { tag: t.link, textDecoration: "underline" },
]);

const focusSlot = new Compartment();
const typeSlot = new Compartment();
const langSlot = new Compartment();
/** Yazı dili: yön (RTL), yazım denetimi dili; satır başına yön de otomatik (karışık metin için). */
const langExt = (l: BookLang) => [
  EditorView.contentAttributes.of({ spellcheck: "true", lang: htmlLang(l), dir: isRtl(l) ? "rtl" : "ltr", autocapitalize: "sentences" }),
  EditorView.perLineTextDirection.of(true),
];

export default function Editor({ docId, value, focus, typewriter: tw, onChange, onView, hint, bookLang }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const cb = useRef({ onChange, onView });
  cb.current = { onChange, onView };
  const initial = useRef({ value, focus, tw, hint, bookLang });
  initial.current = { value, focus, tw, hint, bookLang };

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    const v = new EditorView({
      parent,
      state: EditorState.create({
        doc: initial.current.value,
        extensions: [
          history(),
          keymap.of([
            { key: "Mod-b", run: (x) => toggleWrap(x, "**") },
            { key: "Mod-i", run: (x) => toggleWrap(x, "*") },
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          markdown({ extensions: [GFM] }),
          placeholder(initial.current.hint),
          syntaxHighlighting(mdStyle),
          livePreview,
          focusSlot.of(initial.current.focus ? focusDim : []),
          typeSlot.of(initial.current.tw ? typewriter : []),
          EditorView.lineWrapping,
          langSlot.of(langExt(initial.current.bookLang)),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) cb.current.onChange(u.state.doc.toString());
          }),
        ],
      }),
    });
    view.current = v;
    cb.current.onView(v);
    v.focus();
    return () => {
      cb.current.onView(null);
      v.destroy();
      view.current = null;
    };
  }, [docId]);

  useEffect(() => {
    view.current?.dispatch({ effects: focusSlot.reconfigure(focus ? focusDim : []) });
  }, [focus]);
  useEffect(() => {
    view.current?.dispatch({ effects: typeSlot.reconfigure(tw ? typewriter : []) });
  }, [tw]);
  useEffect(() => {
    view.current?.dispatch({ effects: langSlot.reconfigure(langExt(bookLang)) });
  }, [bookLang]);

  // Metnin altındaki boş alana tıklamak imleci sona koyar (yazı alanı tüm sayfa gibi davranır).
  const onMouseDown = (e: React.MouseEvent) => {
    const v = view.current;
    if (!v || v.contentDOM.contains(e.target as Node)) return;
    if (e.clientY > v.contentDOM.getBoundingClientRect().bottom - 2) {
      e.preventDefault();
      v.focus();
      v.dispatch({ selection: { anchor: v.state.doc.length }, scrollIntoView: true });
    }
  };

  return <div ref={host} className="editor-host" onMouseDown={onMouseDown} />;
}

