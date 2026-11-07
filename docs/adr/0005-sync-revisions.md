# ADR-0005: Chapter-level, revision-based sync; CRDT postponed

- **Status:** accepted
- **Date:** 2026-11-06

## Decision
Local first. The unit is the chapter; every chapter has a revision number and a hash. On conflict both copies are kept and the author chooses. Sync sits behind an interface; Yjs or Loro (a Rust CRDT) can be added later.

## Consequences
Simple and testable; conflicts are rare with a single author. Real-time multi-device/multi-author editing comes later.
