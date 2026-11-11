# ADR-0007: Relational Academic Domain Evolution (Courses, Enrollments, Activities)

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RF-005..RF-007, RF-WEB-015..RF-WEB-026

## Context
Following the delivery of `FEAT-001` (Python student registry) and `FEAT-WEB-001` (Web student registry and dashboard), the project roadmap called for evolving the system to support Courses (`Disciplinas`), Enrollments (`Matrículas`), and Academic Activities (`Atividades`) while preserving client-only privacy guarantees and full backward compatibility with existing tests.

## Considered Alternatives
1. **Unrelated flat lists without relational validation**: Easier to code, but fails to demonstrate real-world domain invariants such as referential integrity, duplicate enrollment prevention, and course deletion guards.
2. **Synchronized relational domain layer in both Python/SQLite and TypeScript/React**: Enforces referential constraints (`Student <-> Course` via `Enrollment`, and `Activity -> Enrollment`) in both `students.py` and `web/lib/domain/academic.ts`, backed by consent-gated `localStorage` and CSV export protection.

## Decision
Implement `FEAT-002..004` in `students.py` (preserving the original `add` and `list` methods untouched) and `FEAT-WEB-002..004` in `web/` (`/courses`, `/enrollments`, `/activities`) with strict relational validation, course deletion protection when enrollments exist, cascade cleanup when a student or enrollment is removed, and unified demonstration seeding.

## Consequences
- **Positive**: Completes the core academic workspace in the sidebar; demonstrates relational Spec-Driven Development across Python and TypeScript; enriches dashboard analytics with real enrollment and gradebook metrics.
- **Negative**: Slightly larger client state footprint, mitigated by keeping the default storage in ephemeral memory (`RNF-WEB-003`).
