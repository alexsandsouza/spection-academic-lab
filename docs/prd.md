# Product Requirements Document (PRD) - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab (`v0.5.0`)
- **Maintainer**: Alexsand Farias de Souza
- **Related Brief**: [docs/product-brief.md](product-brief.md)
- **Traceability Matrix**: [docs/traceability.md](traceability.md)

---

## 1. Python/SQLite Requirements (`FEAT-001`..`FEAT-004`)

Preserved and expanded in `students.py` and verified via `tests/test_students.py`:

| ID | Requirement Description | Feature | Verification |
|---|---|---|---|
| **RF-001** | Register a synthetic student with normalized `DEMO-0001` code and fictional name. | `FEAT-001` | `test_RF001_create` |
| **RF-002** | Reject student codes outside `DEMO-[0-9]{4}` and names outside 2-80 characters. | `FEAT-001` | `test_RF002_invalid` |
| **RF-003** | Reject duplicate student codes without overwriting existing records. | `FEAT-001` | `test_RF003_duplicate` |
| **RF-004** | List student records sorted by code. | `FEAT-001` | `test_RF004_list` |
| **RF-005** | Register and list synthetic courses (`COURSE-[0-9]{2}`, title 3-80 chars, workload 15-240h) without duplicates. | `FEAT-002` | `test_RF005_courses` |
| **RF-006** | Enroll an existing student into an existing course for a valid term (`YYYY.[12]`), rejecting unknown references or duplicate enrollments. | `FEAT-003` | `test_RF006_enrollments` |
| **RF-007** | Record synthetic academic activities (`ACT-[0-9]{4}`) linked to an existing student and course with score `0..100`. | `FEAT-004` | `test_RF007_activities` |
| **RNF-001** | Use parameterized SQL for all tables; perform no network calls. | All Python | `test_RNF001_sql` |
| **RNF-002** | Use in-memory database (`:memory:`) by default; allow no real student data. | All Python | Design & Unit |

---

## 2. Web Application Functional Requirements (`FEAT-WEB-001`..`FEAT-WEB-004`)

### 2.1 Synthetic Student Registry (`FEAT-WEB-001`)

| ID | Requirement Description | Verification |
|---|---|---|
| **RF-WEB-001** | Register a synthetic student containing `id`, `code`, `name`, `course`, `createdAt`, and `updatedAt`. | Unit, Component, E2E |
| **RF-WEB-002** | Validate and normalize the student code to uppercase trimmed format matching `^DEMO-[0-9]{4}$`. | Unit, Component, E2E |
| **RF-WEB-003** | Validate the fictional student name after trimming so its length is between 2 and 80 characters inclusive. | Unit, Component |
| **RF-WEB-004** | Require selecting a course strictly from the allowed demonstration course catalog. | Unit, Component |
| **RF-WEB-005** | Prevent duplicate student codes across records, including after normalization. | Unit, Component, E2E |
| **RF-WEB-006** | List registered synthetic students in a responsive table. | Component, E2E |
| **RF-WEB-007** | Search and filter registered students by name, code, or course. | Unit, Component, E2E |
| **RF-WEB-008** | Sort student records by code, name, course, or registration date (`asc`/`desc`). | Unit, Component |
| **RF-WEB-009** | Edit an existing synthetic student record with validation and `updatedAt` update. | Unit, Component, E2E |
| **RF-WEB-010** | Delete an existing synthetic student record after confirmation (cascading or cleaning related enrollments/activities). | Unit, Component, E2E |
| **RF-WEB-011** | Load curated demonstration records across modules without duplicating existing codes. | Unit, Component, E2E |
| **RF-WEB-012** | Clear all local academic records upon explicit user confirmation. | Unit, Component, E2E |
| **RF-WEB-013** | Export records to CSV with RFC 4180 escaping and spreadsheet formula injection neutralization. | Unit, Component |
| **RF-WEB-014** | Automatically update academic dashboard indicators (students, courses, enrollments, activities, average score, storage mode, and charts). | Unit, Component, E2E |

### 2.2 Synthetic Courses Module (`FEAT-WEB-002`)

| ID | Requirement Description | Verification |
|---|---|---|
| **RF-WEB-015** | Register a synthetic academic course containing `id`, `code`, `title`, `program`, `workloadHours`, `createdAt`, and `updatedAt`. | Unit, Component, E2E |
| **RF-WEB-016** | Normalize and validate course code matching `^COURSE-[0-9]{2}$` (e.g., `COURSE-01`), title (`3..80` chars), valid program from `DEMO_COURSES`, and workload (`15..240` integer hours). | Unit, Component |
| **RF-WEB-017** | Prevent duplicate course codes after normalization and block deletion of a course that has active enrollments unless enrollments are removed first. | Unit, Component |
| **RF-WEB-018** | Search, filter by program, sort, edit, delete (with confirmation), and export courses to CSV safely. | Unit, Component, E2E |

### 2.3 Relational Enrollments Module (`FEAT-WEB-003`)

| ID | Requirement Description | Verification |
|---|---|---|
| **RF-WEB-019** | Create a synthetic enrollment (`id`, `code`, `studentId`, `studentCode`, `courseId`, `courseCode`, `term`, `status`, `createdAt`, `updatedAt`) linking an existing student and an existing course. | Unit, Component, E2E |
| **RF-WEB-020** | Validate enrollment code `^ENR-[0-9]{4}$` (or auto-generate), academic term (`2026.1`, `2026.2`, `2027.1`), and status (`ACTIVE`, `COMPLETED`, `DROPPED`). | Unit, Component |
| **RF-WEB-021** | Prevent duplicate enrollment of the same student in the same course and term, as well as duplicate `ENR-####` codes. | Unit, Component |
| **RF-WEB-022** | List, search, filter by status/term, update enrollment status, delete with confirmation, and export enrollments to CSV safely. | Unit, Component, E2E |

### 2.4 Academic Activities & Assessments Module (`FEAT-WEB-004`)

| ID | Requirement Description | Verification |
|---|---|---|
| **RF-WEB-023** | Register a synthetic academic activity (`id`, `code`, `enrollmentId`, `studentCode`, `courseCode`, `title`, `category`, `score`, `maxScore`, `status`, `createdAt`, `updatedAt`). | Unit, Component, E2E |
| **RF-WEB-024** | Validate activity code `^ACT-[0-9]{4}$`, title (`3..80` chars), category (`EXAM`, `PROJECT`, `LAB`, `QUIZ`), status (`PENDING`, `SUBMITTED`, `GRADED`), and numeric score (`0 <= score <= 100`). | Unit, Component |
| **RF-WEB-025** | Prevent duplicate `ACT-####` codes and verify that the referenced enrollment exists. | Unit, Component |
| **RF-WEB-026** | List, search, filter by status/category, edit score/status, delete with confirmation, calculate average score metrics, and export activities to CSV safely. | Unit, Component, E2E |

---

## 3. Non-Functional Requirements (`RNF-WEB-001`..`RNF-WEB-007`)

- **RNF-WEB-001**: Responsive desktop and mobile interface across all academic modules (`/`, `/students`, `/courses`, `/enrollments`, `/activities`, `/documentation`, `/roadmap`, `/about`).
- **RNF-WEB-002**: Keyboard and screen-reader accessibility (semantic landmarks, labeled controls, `aria-live` status updates, modal dialogs).
- **RNF-WEB-003**: Ephemeral in-memory storage by default for all entities (students, courses, enrollments, activities).
- **RNF-WEB-004**: Consent-gated `localStorage` persistence across reloads only when authorized, with immediate multi-entity erasure upon revocation.
- **RNF-WEB-005**: Zero external transmission of academic records to backend servers, analytics, or AI models.
- **RNF-WEB-006**: Graceful fallback to in-memory mode if `localStorage` throws quota, security, or JSON corruption errors.
- **RNF-WEB-007**: Static export (`output: 'export'`) published via quality-gated GitHub Actions to GitHub Pages.
