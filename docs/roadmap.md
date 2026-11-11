# Roadmap - SPECTION Academic Lab

## Historical & Delivered Releases

- **v0.1 (Completed - Verified)**: `FEAT-001` - Synthetic student registry in Python 3 and SQLite (`students.py`) with automated unit tests (`tests/test_students.py`) and initial SDD documentation.
- **v0.3 (Completed - Verified)**: `FEAT-WEB-001` - Interactive Web Application built with Next.js (Static Export), React, and TypeScript (`strict`). Delivered Academic Dashboard, Student CRUD, Privacy-by-Design storage (`Memory` default + opt-in `localStorage`), safe CSV export, and the 10-stage SPECTION Engineering Journey view.
- **v0.5 (Completed - Current Release)**: `FEAT-002..004` & `FEAT-WEB-002..004` - Complete Academic Workspace Evolution:
  - **Courses Module (`/courses` - `FEAT-002` / `FEAT-WEB-002`)**: Synthetic course catalog (`COURSE-01`), workload hours (`15..240h`), program classification, referential deletion protection, and CSV export.
  - **Enrollments Module (`/enrollments` - `FEAT-003` / `FEAT-WEB-003`)**: Relational student-to-course enrollment (`ENR-0001`), academic term validation (`2026.1`, `2026.2`, `2027.1`), duplicate enrollment prevention, status lifecycle (`ACTIVE`, `COMPLETED`, `DROPPED`), and CSV export.
  - **Activities & Assessments Module (`/activities` - `FEAT-004` / `FEAT-WEB-004`)**: Academic activities and synthetic gradebook (`ACT-0001`), category classification (`EXAM`, `PROJECT`, `LAB`, `QUIZ`), score validation (`0..100`), status tracking (`PENDING`, `SUBMITTED`, `GRADED`), and live dashboard average score indicators.
  - **Polyglot Parity**: Expanded `students.py` and `tests/test_students.py` with SQLite relational tables and unit tests for courses, enrollments, and activities.

## Planned Future Explorations

- **v0.6 (Planned)**: Authentication, Role-Based Access Control (RBAC) simulation (Registrar, Professor, Student personas), and interactive STRIDE threat model explorer.
- **v0.7 (Planned)**: JSON/CSV batch import with schema validation and conflict resolution preview.
- **Future (Exploratory)**: Optional local AI specification assistant with strict privacy review and human-in-the-loop approval gates.
