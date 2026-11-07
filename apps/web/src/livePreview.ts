import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate, WidgetType } from "@codemirror/view";

/** İmleç dışındaki Markdown işaretlerini gizler (Obsidian tarzı canlı önizleme). */
const HIDDEN = new Set(["HeaderMark", "EmphasisMark", "QuoteMark", "CodeMark", "LinkMark", "URL", "StrikethroughMark"]);
const hide = Decoration.replace({});

class Bullet extends WidgetType {
  eq() { return true; }
  toDOM() { const e = document.createElement("span"); e.className = "cm-bullet"; e.textContent = "•"; return e; }
}

class Check extends WidgetType {
  constructor(readonly checked: boolean) { super(); }
  eq(o: Check) { return o.checked === this.checked; }
  toDOM(view: EditorView) {
    const e = document.createElement("span");
    e.className = `cm-check${this.checked ? " on" : ""}`;
    e.setAttribute("role", "checkbox");
    e.setAttribute("aria-checked", String(this.checked));
    e.onmousedown = (ev) => {
      ev.preventDefault();
      const at = view.posAtDOM(e);
      view.dispatch({ changes: { from: at + 1, to: at + 2, insert: this.checked ? " " : "x" } });
    };
    return e;
  }
  ignoreEvent() { return true; }
}

function build(view: EditorView): DecorationSet {
  const decos: Range<Decoration>[] = [];
  const { state } = view;
  const active = new Set<number>();
  for (const r of state.selection.ranges) {
    const a = state.doc.lineAt(r.from).number;
    const b = state.doc.lineAt(r.to).number;
    for (let n = a; n <= b; n++) active.add(n);
  }
  for (const { from, to } of view.visibleRanges) {
    for (let n = state.doc.lineAt(from).number; n <= state.doc.lineAt(to).number; n++) {
      const l = state.doc.line(n);
      if (l.length === 0 && !active.has(n)) decos.push(Decoration.line({ class: "cm-blank" }).range(l.from));
    }
    syntaxTree(state).iterate({
      from,
      to,
      enter(node) {
        const line = state.doc.lineAt(node.from);
        const m = /^ATXHeading(\d)$/.exec(node.name);
        if (m) decos.push(Decoration.line({ class: `cm-h${m[1]}` }).range(line.from));
        if (node.name === "Blockquote") {
          for (let p = line.from; p <= node.to; ) {
            const l = state.doc.lineAt(p);
            decos.push(Decoration.line({ class: "cm-quote" }).range(l.from));
            p = l.to + 1;
          }
        }
        if (node.name === "ListMark" && !active.has(line.number)) {
          if (/^\s*[-*+]\s+\[[ xX]\]/.test(line.text)) decos.push(hide.range(node.from, node.to + 1));
          else if (/^[-*+]$/.test(state.sliceDoc(node.from, node.to))) decos.push(Decoration.replace({ widget: new Bullet() }).range(node.from, node.to));
        }
        if (node.name === "TaskMarker") {
          const done = /x/i.test(state.sliceDoc(node.from, node.to));
          decos.push(Decoration.replace({ widget: new Check(done) }).range(node.from, node.to));
          if (done) decos.push(Decoration.line({ class: "cm-done" }).range(line.from));
        }
        if (node.name === "HorizontalRule") {
          decos.push(Decoration.line({ class: "cm-hr" }).range(line.from));
          if (!active.has(line.number)) decos.push(hide.range(node.from, node.to));
        }
        if (!HIDDEN.has(node.name) || active.has(line.number)) return;
        let end = node.to;
        // "# " ve "> " işaretinden sonraki boşluğu da gizle
        if ((node.name === "HeaderMark" || node.name === "QuoteMark") && state.sliceDoc(end, end + 1) === " ") end += 1;
        if (end > node.from) decos.push(hide.range(node.from, end));
      },
    });
  }
  return Decoration.set(decos, true);
}

export const livePreview = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = build(view);
    }
    update(u: ViewUpdate) {
      if (u.docChanged || u.selectionSet || u.viewportChanged) this.decorations = build(u.view);
    }
  },
  { decorations: (v) => v.decorations },
);
