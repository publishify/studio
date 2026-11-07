import type { EditorView } from "@codemirror/view";

/** Wraps the selection (or the word under the cursor) in a marker, or removes the wrapping. */
export function toggleWrap(view: EditorView, mark: string): boolean {
  const { state } = view;
  const r = state.selection.main;
  let { from, to } = r;
  if (from === to) {
    const w = state.wordAt(from);
    if (w) ({ from, to } = w);
  }
  const m = mark.length;
  const text = state.sliceDoc(from, to);
  const before = state.sliceDoc(Math.max(0, from - m), from);
  const after = state.sliceDoc(to, to + m);
  if (before === mark && after === mark) {
    view.dispatch({ changes: [{ from: from - m, to: from }, { from: to, to: to + m }], selection: { anchor: from - m, head: to - m } });
  } else {
    view.dispatch({ changes: { from, to, insert: mark + text + mark }, selection: { anchor: from + m, head: to + m } });
  }
  view.focus();
  return true;
}

/** Toggles a line-start prefix (heading, quote, list); pressing the same level on a heading removes it. */
export function toggleLinePrefix(view: EditorView, prefix: string): boolean {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const m = /^(#{1,6} |> |- \[[ x]\] |- |\d+\. )/.exec(line.text);
  const old = m?.[0] ?? "";
  const next = old === prefix ? "" : prefix;
  view.dispatch({ changes: { from: line.from, to: line.from + old.length, insert: next } });
  view.focus();
  return true;
}

export function insertHr(view: EditorView): boolean {
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  view.dispatch({ changes: { from: line.to, insert: "\n\n---\n\n" }, selection: { anchor: line.to + 7 } });
  view.focus();
  return true;
}

export function insertLink(view: EditorView): boolean {
  const { from, to } = view.state.selection.main;
  const text = from === to ? "bağlantı" : view.state.sliceDoc(from, to);
  const ins = `[${text}](https://)`;
  view.dispatch({ changes: { from, to, insert: ins }, selection: { anchor: from + text.length + 3, head: from + ins.length - 1 } });
  view.focus();
  return true;
}
