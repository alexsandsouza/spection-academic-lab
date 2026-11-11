# Traceability Matrix - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Maintainer**: Alexsand Farias de Souza
- **Related Documents**: [PRD](prd.md), [Feature 001](../specs/feature-001.md), [Web Spec](../specs/academic-web/spec.md), [Evidence](evidence.md)

---

## 1. Python Baseline Traceability (`FEAT-001`)

| Requirement ID | Summary | Spec / ADR | Implementation | Automated Test | Verification Status |
|---|---|---|---|---|---|
| **RF-001** | Register synthetic student (`DEMO-0001` + name) | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF001_create` | PASS |
| **RF-002** | Reject invalid code pattern or name length | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF002_invalid` | PASS |
| **RF-003** | Reject duplicate student codes | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RF003_duplicate` | PASS |
| **RF-004** | List students ordered by code | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.list`) | `tests/test_students.py::test_RF004_list` | PASS |
| **RNF-001** | Parameterized SQL; no network calls | `specs/feature-001.md`, `ADR-0001` | `students.py` (`Registry.add`) | `tests/test_students.py::test_RNF001_sql` | PASS |
| **RNF-002** | In-memory DB default; fictional data only | `specs/feature-001.md`, `ADR-0001` | `students.py` (`db=':memory:'`) | `tests/test_students.py` | PASS (Design Constraint) |

---

## 2. Web Application Functional Traceability (`FEAT-WEB-001`)

| Requirement ID | Summary | Feature Spec / Task | Implementation Files | Unit / Component Tests | E2E Playwright Test | Status |
|---|---|---|---|---|---|---|
| **RF-WEB-001** | Register synthetic student | `specs/academic-web/spec.md` (AC-WEB-001), `TASK-WEB-005` | `web/lib/domain/students.ts`, `web/components/StudentForm.tsx`, `web/app/students/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` (register student) | PASS |
| **RF-WEB-002** | Validate & normalize `DEMO-0001` code | `specs/academic-web/spec.md` (AC-WEB-002), `TASK-WEB-003` | `web/lib/domain/students.ts` (`normalizeStudentCode`, `validateStudentInput`) | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-003** | Validate fictional name (2-80 chars) | `specs/academic-web/spec.md` (AC-WEB-003), `TASK-WEB-003` | `web/lib/domain/students.ts` (`validateStudentInput`) | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-004** | Select course from demo catalog | `specs/academic-web/spec.md` (AC-WEB-004), `TASK-WEB-003` | `web/lib/domain/students.ts` (`DEMO_COURSES`), `web/components/StudentForm.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-005** | Prevent duplicate normalized codes | `specs/academic-web/spec.md` (AC-WEB-005), `TASK-WEB-003` | `web/lib/domain/students.ts` (`validateStudentInput`) | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` (reject duplicate) | PASS |
| **RF-WEB-006** | List registered students in table | `specs/academic-web/spec.md` (AC-WEB-006), `TASK-WEB-006` | `web/app/students/page.tsx` | `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-007** | Search by name, code, or course | `specs/academic-web/spec.md` (AC-WEB-007), `TASK-WEB-006` | `web/lib/domain/students.ts` (`filterAndSortStudents`), `web/app/students/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` (search student) | PASS |
| **RF-WEB-008** | Sort student records | `specs/academic-web/spec.md` (AC-WEB-008), `TASK-WEB-006` | `web/lib/domain/students.ts` (`filterAndSortStudents`), `web/app/students/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-009** | Edit existing student record | `specs/academic-web/spec.md` (AC-WEB-009), `TASK-WEB-007` | `web/lib/domain/students.ts` (`updateStudentRecord`), `web/app/students/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` (edit record) | PASS |
| **RF-WEB-010** | Delete student with confirmation | `specs/academic-web/spec.md` (AC-WEB-010), `TASK-WEB-007` | `web/lib/domain/students.ts` (`deleteStudentRecord`), `web/components/ConfirmDialog.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` (delete record) | PASS |
| **RF-WEB-011** | Load demo dataset without duplicates | `specs/academic-web/spec.md` (AC-WEB-011), `TASK-WEB-008` | `web/lib/domain/students.ts` (`mergeDemoStudents`) | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-012** | Clear local records with confirmation | `specs/academic-web/spec.md` (AC-WEB-012), `TASK-WEB-007` | `web/lib/context/AcademicLabContext.tsx`, `web/components/ConfirmDialog.tsx` | `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-013** | Export records to CSV safely | `specs/academic-web/spec.md` (AC-WEB-013), `TASK-WEB-003` | `web/lib/domain/students.ts` (`exportStudentsToCsv`) | `students.test.ts` | `academic-lab.spec.ts` | PASS |
| **RF-WEB-014** | Auto-update dashboard indicators | `specs/academic-web/spec.md` (AC-WEB-014), `TASK-WEB-008` | `web/lib/domain/students.ts` (`calculateDashboardMetrics`), `web/app/page.tsx` | `students.test.ts`, `academic-lab.test.tsx` | `academic-lab.spec.ts` | PASS |

---

## 3. Web Application Non-Functional Traceability (`FEAT-WEB-001`)

| Requirement ID | Summary | ADR / Task | Implementation Files | Automated Verification | Status |
|---|---|---|---|---|---|
| **RNF-WEB-001** | Responsive desktop & mobile layout | `ADR-0002`, `TASK-WEB-002` | `web/app/globals.css`, `web/components/AppShell.tsx` | `academic-lab.spec.ts` (mobile navigation test) | PASS |
| **RNF-WEB-002** | Keyboard & screen reader accessibility | `ADR-0002`, `TASK-WEB-005` | `web/components/*.tsx`, `web/app/**/*.tsx` | `academic-lab.test.tsx`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-003** | Ephemeral in-memory storage by default | `ADR-0003`, `TASK-WEB-004` | `web/lib/storage/storage.ts` (`MemoryStorageAdapter`) | `storage.test.ts`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-004** | Local persistence only when authorized + revocation | `ADR-0003`, `TASK-WEB-009` | `web/lib/storage/storage.ts` (`LocalStorageAdapter`), `web/components/PrivacyBanner.tsx` | `storage.test.ts`, `academic-lab.test.tsx`, `academic-lab.spec.ts` | PASS |
| **RNF-WEB-005** | Zero external transmission of student records | `ADR-0005`, `TASK-WEB-004` | Client-only architecture (`web/lib/`) | Static code audit & E2E network check | PASS |
| **RNF-WEB-006** | Graceful handling of `localStorage` failures | `ADR-0003`, `TASK-WEB-004` | `web/lib/storage/storage.ts` (`try/catch` fallback) | `storage.test.ts` (simulated storage errors) | PASS |
| **RNF-WEB-007** | Static application export for GitHub Pages | `ADR-0002`, `ADR-0006`, `TASK-WEB-011` | `web/next.config.mjs`, `.github/workflows/academic-lab.yml` | `npm run build` (`web/out` generated) | PASS |
