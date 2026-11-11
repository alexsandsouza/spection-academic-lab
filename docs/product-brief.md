# Product Brief - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Author & Maintainer**: Alexsand Farias de Souza
- **Repository**: https://github.com/alexsandsouza/spection-academic-lab
- **Main Framework**: https://github.com/alexsandsouza/spection
- **Official Portal**: https://alexsandsouza.github.io/spection/
- **License**: MIT
- **Status**: Implemented (`v0.5.0` - `FEAT-001`..`FEAT-004` Python/SQLite + `FEAT-WEB-001`..`FEAT-WEB-004` Web Application) - Human release approval checkpoint tracked in `docs/evidence.md`.

---

## 1. Historical Baseline (`v0.1` - `FEAT-001`)

- **Problem**: Demonstrate end-to-end specification-driven software engineering with a small academic domain.
- **Users**: Students, professors, and developers learning SPECTION.
- **Goal**: Implement and verify one student registry feature with explicit requirements and traceability.
- **Scope**: Synthetic student codes and fictional names, local registry (`students.py` with Python 3 and SQLite). Excludes real student data, authentication, grades, attendance, and production deployment.

---

## 2. Web Application Increment (`v0.3` - `FEAT-WEB-001`)

Delivered the initial interactive Next.js static web application on GitHub Pages with synthetic student CRUD (`DEMO-0001`), real-time dashboard indicators, privacy-by-design storage controls (in-memory default, opt-in `localStorage`), CSV export with formula injection protection, and the 10-stage SPECTION Engineering Journey view.

---

## 3. Complete Academic Suite Evolution (`v0.5` - `FEAT-002..004` & `FEAT-WEB-002..004`)

### 3.1 Context & Problem Evidence
After establishing the synthetic student registry (`FEAT-001` and `FEAT-WEB-001`), the sidebar navigation still held three planned academic modules: **Courses (`Disciplinas`)**, **Enrollments (`Matrículas`)**, and **Activities (`Atividades`)**. To demonstrate how the SPECTION Framework manages relational domain rules, cross-entity integrity constraints, and multi-feature evolution without breaking backward compatibility, the lab evolves into a complete synthetic academic workspace (`v0.5.0`).

### 3.2 Goals of the `v0.5.0` Increment
1. **Synthetic Courses Catalog (`FEAT-002` / `FEAT-WEB-002`)**: Allow registering, validating, searching, editing, deleting, and exporting fictional academic courses (`COURSE-01` pattern, title, workload hours `15..240`, and program area), while preventing deletion of courses that have active enrollments.
2. **Relational Student Enrollments (`FEAT-003` / `FEAT-WEB-003`)**: Link registered synthetic students (`DEMO-0001`) to registered courses (`COURSE-01`) for a given academic term (`2026.1`, `2026.2`, `2027.1`) and status (`ACTIVE`, `COMPLETED`, `DROPPED`), enforcing referential integrity and preventing duplicate student-course-term enrollments.
3. **Academic Activities & Synthetic Assessments (`FEAT-004` / `FEAT-WEB-004`)**: Manage course activities and synthetic student scores (`ACT-0001` pattern, enrollment reference, activity title, score `0..100`, and status `PENDING`, `SUBMITTED`, `GRADED`), calculating real-time average scores and completion rates on the dashboard.
4. **Polyglot Domain Parity**: Evolve `students.py` (Python/SQLite) and `web/lib/domain/` (TypeScript strict) in lockstep so both implementations verify relational integrity, cascade/referential rules, and deterministic sorting.

### 3.3 Scope & Exclusions
- **In-Scope**: Synthetic students, courses, enrollments, and activities in both Python/SQLite and Next.js Web UI; relational validation; unified demo dataset seeding; CSV export for all modules; privacy-by-design storage (memory default, opt-in `localStorage`); full automated test coverage.
- **Out of Scope**: Real personal data of students or instructors; backend servers or cloud databases; real authentication/login (kept as architectural documentation and threat model study); third-party tracking or paid APIs.

### 3.4 Measurable Success Metrics
- **M-01 (Requirement Traceability)**: 100% of baseline and new requirements (`RF-001`..`RF-007`, `RF-WEB-001`..`RF-WEB-026`, `RNF-WEB-001`..`RNF-WEB-007`) mapped to code and automated tests in `docs/traceability.md`.
- **M-02 (Automated Quality Gate)**: 100% pass rate across Python `unittest`, Vitest unit/component tests, TypeScript strict check, Next.js static export build, and Playwright E2E browser journeys.
- **M-03 (Privacy Default Compliance)**: 0 bytes written to `localStorage` for any academic entity (students, courses, enrollments, activities) prior to explicit user opt-in.
- **M-04 (Referential Integrity)**: 100% rejection of orphan enrollments, duplicate enrollments, or out-of-range activity scores (`0..100`).
