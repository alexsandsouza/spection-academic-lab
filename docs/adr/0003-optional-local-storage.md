# ADR-0003: Dual Storage Strategy - In-Memory Default and Consent-Gated localStorage

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RNF-WEB-003, RNF-WEB-004, RNF-WEB-006

## Context
Educational web demonstrations often write data directly to `window.localStorage` on page load without informing the user. Under privacy-by-design principles (aligned with LGPD and GDPR concepts of data minimization and user control), browser persistence for user-entered demonstration records should be transparent, optional, and revocable.

## Considered Alternatives
1. **Unconditional `localStorage`**: Simpler code, but violates `RNF-WEB-003` and stores data on shared/public machines without user consent.
2. **In-Memory only**: Maximizes privacy, but prevents users from testing reload persistence when they explicitly want to.
3. **Storage Port with `MemoryStorageAdapter` (default) and consent-gated `LocalStorageAdapter` (opt-in)**: Defaults to ephemeral memory storage (`RNF-WEB-003`), activates `localStorage` only after explicit user authorization (`RNF-WEB-004`), and gracefully handles storage exceptions (`RNF-WEB-006`).

## Decision
Implement a `StudentStoragePort` interface with two concrete adapters:
1. `MemoryStorageAdapter` (default on first visit and when `Essential Only` is chosen).
2. `LocalStorageAdapter` (enabled only when the user explicitly selects `Allow Local Storage` in the privacy banner or privacy preferences modal).
Revoking consent immediately deletes persisted student records from `localStorage` and switches back to `MemoryStorageAdapter`.

## Consequences
- **Positive**: Verifiable privacy-by-design behavior; clear separation between consent preferences and student registry records; resilient fallback if browser storage is disabled or full.
- **Negative**: Users in default mode lose unsaved demo records on page reload (explicitly communicated in the UI header, dashboard indicator, and privacy notice).
