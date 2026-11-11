# Traceability Matrix - SPECTION Academic Lab (`v0.5.0`)

## Document Control

- **Project**: SPECTION Academic Lab
- **Maintainer**: Alexsand Farias de Souza
- **Related Documents**: [PRD](prd.md), [Feature 001](../specs/feature-001.md), [Web Spec](../specs/academic-web/spec.md), [Evidence](evidence.md)

---

## 1. Python/SQLite Traceability (`FEAT-001`..`FEAT-004`)

| Requirement ID | Summary | Spec / ADR | Implementation | Automated Test | Verification Status |
|---|---|---|---|---|---|
| **RF-001** | Register synthetic student (`DEMO-0001` + name) | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF001_create` | PASS |
| **RF-002** | Reject invalid code pattern or name length | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF002_invalid` | PASS |
| **RF-003** | Reject duplicate student codes | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF003_duplicate` | PASS |
| **RF-004** | List students ordered by code | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.list`) | `tests/test_students.py::test_RF004_list` | PASS |
| **RF-005** | Register and list synthetic courses (`COURSE-01`) | `ADR-0007` | `students.py` (`Registry.add_course`, `list_courses`) | `tests/test_students.py::test_RF005_courses` | PASS |
| **RF-006** | Relational student-course enrollment (`2026.1`) | `ADR-0007` | `students.py` (`Registry.enroll`, `list_enrollments`) | `tests/test_students.py::test_RF006_enrollments` | PASS |
| **RF-007** | Synthetic academic activities & scores (`0..100`) | `ADR-0007` | `students.py` (`Registry.add_activity`, `list_activities`) | `tests/test_students.py::test_RF007_activities` | PASS |
| **RNF-001** | Parameterized SQL; no network calls | `specs/feature-001.md`, `ADR-0001` | `students.py` | `tests/test_students.py::test_RNF001_sql` | PASS |
| **RNF-002** | In-memory DB default; fictional data only | `specs/feature-001.md`, `ADR-0001` | `students.py` (`db=':memory:'`) | `tests/test_students.py` | PASS |

---

## 2. Web Application Functional Traceability (`FEAT-WEB-001`..`FEAT-WEB-004`)

| Requirement ID | Summary | Feature / Task | Implementation Files | Unit / Component Tests | E2E Playwright Test | Status |
|---|---|---|---|---|---|---|
| **RF-WEB-001..005** | Student registration, `DEMO-0001` normalization, validation & anti-duplication | `FEAT-WEB-001`, `TASK-WEB-003`, `TASK-WEB-005` | `web/lib/domain/students.ts`, `web/components/StudentForm.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-006..010** | Student listing, search, sort, edit & confirmed deletion | `FEAT-WEB-001`, `TASK-WEB-006`, `TASK-WEB-007` | `web/app/students/page.tsx`, `ConfirmDialog.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-011..014** | Idempotent demo seed, confirmed local clear, safe CSV export & live dashboard metrics | `FEAT-WEB-001`, `TASK-WEB-008` | `web/lib/domain/students.ts`, `web/app/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-015..018** | Synthetic Courses CRUD (`COURSE-01`), workload bounds (`15..240h`), deletion guard when enrolled & CSV export | `FEAT-WEB-002`, `TASK-WEB-013` | `web/lib/domain/academic.ts`, `web/app/courses/page.tsx` | `academic.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-019..022** | Relational Enrollments CRUD (`ENR-0001`), student+course+term uniqueness, status update & CSV export | `FEAT-WEB-003`, `TASK-WEB-014` | `web/lib/domain/academic.ts`, `web/app/enrollments/page.tsx` | `academic.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-023..026** | Academic Activities & Assessments (`ACT-0001`), score validation (`0..100`), status tracking, average calculation & CSV export | `FEAT-WEB-004`, `TASK-WEB-015` | `web/lib/domain/academic.ts`, `web/app/activities/page.tsx` | `academic.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |

---

## 3. Web Application Non-Functional Traceability (`RNF-WEB-001`..`RNF-WEB-007`)

| Requirement ID | Summary | ADR / Task | Implementation Files | Automated Verification | Status |
|---|---|---|---|---|---|
| **RNF-WEB-001** | Responsive desktop & mobile layout across all modules | `ADR-0002`, `TASK-WEB-002` | `web/app/globals.css`, `web/components/AppShell.tsx` | `academic-lab.spec.ts` (mobile navigation test) | PASS |
| **RNF-WEB-002** | Keyboard & screen reader accessibility | `ADR-0002`, `TASK-WEB-005` | `web/components/*.tsx`, `web/app/**/*.tsx` | `academic-lab.test.tsx`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-003** | Ephemeral in-memory storage by default for all entities | `ADR-0003`, `TASK-WEB-004` | `web/lib/storage/storage.ts` (`MemoryStorageAdapter`) | `storage.test.ts`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-004** | Local persistence only when authorized + multi-entity revocation purge | `ADR-0003`, `TASK-WEB-009` | `web/lib/storage/storage.ts` (`LocalStorageAdapter`), `PrivacyBanner.tsx` | `storage.test.ts`, `academic-lab.test.tsx`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-005** | Zero external transmission of academic records | `ADR-0005`, `TASK-WEB-004` | Client-only architecture (`web/lib/`) | Static code audit & E2E check | PASS |
| **RNF-WEB-006** | Graceful handling of `localStorage` failures | `ADR-0003`, `TASK-WEB-004` | `web/lib/storage/storage.ts` (`try/catch` fallback) | `storage.test.ts` | PASS |
| **RNF-WEB-007** | Static application export for GitHub Pages | `ADR-0002`, `ADR-0006`, `TASK-WEB-011` | `web/next.config.mjs`, `.github/workflows/academic-lab.yml` | `npm run build` (`web/out` generated) | PASS |


## FEAT-005 v0.6 - Academic Intelligence (release gate pending)

| Requirement | Component | Test/evidence path | Status |
|---|---|---|---|
| RF-WEB-027 | web/lib/domain/progress.ts / addSession | web/tests/unit/progress.test.ts | Source implemented; CI pending |
| RF-WEB-028 | web/lib/domain/progress.ts / setAttendance | web/tests/unit/progress.test.ts | Source implemented; CI pending |
| RF-WEB-029 | web/lib/domain/progress.ts / attendanceRate | web/tests/unit/progress.test.ts | Source implemented; CI pending |
| RF-WEB-030 | web/lib/domain/progress.ts / validateWeights | web/tests/unit/progress.test.ts | Source implemented; CI pending |
| RF-WEB-031 | web/lib/domain/progress.ts / weightedGrade | web/tests/unit/progress.test.ts | Source implemented; CI pending |
| RF-WEB-032 | web/app/progress/page.tsx / transcript view | web/tests/e2e/academic-lab.spec.ts | Source implemented; browser verification pending |
| RNF-WEB-009 | web/lib/storage/storage.ts / privacy key purge | web/tests/unit/storage.test.ts | Source implemented; CI pending |

Reference: specs/academic-intelligence-v06.md. This table intentionally does not mark the new tests PASS before the final workflow and deployed browser are verified.
