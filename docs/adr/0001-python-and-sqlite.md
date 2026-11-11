# ADR-0001: Python Standard Library and SQLite Baseline

- **Status**: Implemented (Verified via `tests/test_students.py`)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza

## Context
The initial release of SPECTION Academic Lab (`FEAT-001`) needed a minimal, zero-dependency implementation to demonstrate Spec-Driven Development (SDD), requirements traceability, and automated verification without requiring cloud services or external package managers.

## Considered Alternatives
1. **Browser-only storage**: Immediate visual UI, but requires a frontend build toolchain for the initial proof of concept.
2. **Python Standard Library + SQLite (`:memory:`)**: Deterministic, zero external dependencies, runs anywhere Python 3 is installed, and demonstrates parameterized SQL safety.
3. **Full client-server web stack**: Over-engineered for the initial baseline increment.

## Decision
Use Python 3 standard library (`sqlite3`, `re`, `unittest`) with an in-memory SQLite database by default in `students.py` and `tests/test_students.py`.

## Consequences
- **Positive**: Fast, deterministic execution (`5 tests in ~0.01s`); clear demonstration of `RF-001`..`RF-004` and `RNF-001`..`RNF-002`.
- **Negative**: CLI/library-only interface; requires a complementary web client (`FEAT-WEB-001`) for interactive browser exploration.
