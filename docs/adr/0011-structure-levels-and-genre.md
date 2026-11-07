# ADR-0011: Structure levels (part › chapter › scene) and book genre

- **Status:** accepted (for fiction genres); the structure of other genres is open
- **Date:** 2026-11-07

## Context
The author wants to add parts, chapters and scenes for novels, novellas and stories. The structure of other genres such as poetry, essays and academic writing has not been decided yet.

## Decision
- Three levels: **part** (a heading, not a document), **chapter** (a document), **scene** (a document under a chapter). A scene is not a separate kind; it is a document marked `level: 2` (`kind` is still `chapter`), so the editor, versions, narration, trash and Drive files work unchanged. The hierarchy comes from the order in the flat list: a scene belongs to the nearest chapter before it.
- **Genre** (`Book.genre`): `roman` (novel), `novella`, `hikaye` (story), `diger` (other). "Add scene" is visible for novels/novellas/stories. For `diger` the scene level is off; as genre modules arrive, each genre's own levels and names (e.g. academic: chapter › subsection; poetry collection: part › poem) will be defined with this structure. Default: novel.
- In server sync a scene travels as `kind: "scene"` (the client converts it to `chapter + level 2`); the genre travels in the metadata (`meta.genre`). Drive's `kitap.json` carries `level` and `genre`.
- Export: scenes are merged into the chapter with `* * *` between them (if the chapter's own text is only a heading, no separator is placed before the first scene).

## Open questions
- Level names and counts for other genres (poetry, essay, academic, memoir, children's, play/screenplay).
- Chapter ↔ scene conversion and changing levels by dragging were not there yet (the conversion has since been added).
