# ADR-0004: Coexistence and Preservation of the Python/SQLite Implementation

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RF-001..RF-004, RF-WEB-001..RF-WEB-014

## Context
The repository already contains `students.py`, `tests/test_students.py`, and `specs/feature-001.md` representing the first SPECTION engineering increment (`FEAT-001`). Replacing or deleting the Python implementation when introducing the web application would break historical traceability and remove a valuable polyglot demonstration.

## Considered Alternatives
1. **Delete Python files and replace with TypeScript**: Loses git history coherence and breaks existing documentation references.
2. **Preserve Python/SQLite at root and place Next.js web app in `web/`**: Maintains both implementations of the synthetic student domain and executes both test suites in CI.

## Decision
Keep `students.py`, `tests/test_students.py`, and `specs/feature-001.md` intact at the repository root. Place the new web client inside `web/` and its feature specifications inside `specs/academic-web/`. Run both Python `unittest` and Web `Vitest`/`Playwright` suites in GitHub Actions.

## Consequences
- **Positive**: Demonstrates how multiple technical implementations (Python/SQLite and TypeScript/React) trace back to shared domain invariants (`DEMO-0001` normalization, 2-80 char name validation, duplicate prevention).
- **Negative**: Domain rules must be kept aligned across `students.py` and `web/lib/domain/students.ts`.
