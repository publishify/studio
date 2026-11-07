# ADR-0006: The open-core boundary

- **Status:** accepted
- **Date:** 2026-11-06

## Decision
- Open: the editor, the Tauri shell, `crates/analiz`, the sync protocol, the MCP tool definitions.
- Closed (on the server): the editorial-board package — role instructions, genre criteria, evaluation logic; payments and accounts.

## Consequences
Code can be copied, value (the board, data, platform) cannot. The board's instructions are never sent to the client in full.
