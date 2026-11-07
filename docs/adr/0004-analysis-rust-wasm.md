# ADR-0004: Text analysis in Rust → WebAssembly

- **Status:** accepted (starts in phase 2)
- **Date:** 2026-11-06

## Decision
`crates/analiz`: Turkish word/sentence statistics, readability, repetitions, dialogue ratio, character names and chapter fingerprints. Built with `wasm-bindgen` (wasm-pack is archived). The same module runs in the browser, the Worker and Tauri. Open source, also published as a separate crate.

## Consequences
The numeric part of the dashboard is offline and instant. If needed, the first version starts in TypeScript and is ported later.
