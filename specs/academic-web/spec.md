# Feature Specification: FEAT-WEB-001..004 - Complete Academic Workspace Web Application

## 1. Overview

- **Feature IDs**:
  - `FEAT-WEB-001`: Synthetic Student Registry & Academic Dashboard (`RF-WEB-001`..`RF-WEB-014`)
  - `FEAT-WEB-002`: Synthetic Courses Catalog (`RF-WEB-015`..`RF-WEB-018`)
  - `FEAT-WEB-003`: Relational Student Enrollments (`RF-WEB-019`..`RF-WEB-022`)
  - `FEAT-WEB-004`: Academic Activities & Synthetic Assessments (`RF-WEB-023`..`RF-WEB-026`)
- **Non-Functional Requirements**: `RNF-WEB-001` through `RNF-WEB-007`
- **Related ADRs**: `ADR-0001` through `ADR-0007`
- **Polyglot Parity**: Synchronized with `FEAT-001`..`FEAT-004` in `students.py` and `tests/test_students.py`.

## 2. User Stories

1. **As a learner or evaluator of SPECTION**, I want an interactive academic dashboard that displays real-time indicators calculated from synthetic students, courses, enrollments, and graded activities so I can inspect a complete multi-entity software system.
2. **As an instructor or student**, I want to manage fictional students (`DEMO-0001`), courses (`COURSE-01`), enrollments (`ENR-0001`), and academic activities (`ACT-0001`) with relational integrity and formula-safe CSV export.
3. **As a privacy-conscious visitor**, I want all four entity collections kept in temporary memory by default and persisted to `localStorage` only upon explicit opt-in, with immediate revocation and erasure.
4. **As a software engineer studying Spec-Driven Development**, I want the **Engineering Journey** view to map all 10 lifecycle stages and requirements to real repository files and automated tests.

## 3. Data Contracts

- `Student`: `{ id, code, name, course, createdAt, updatedAt }` (`^DEMO-[0-9]{4}$`)
- `CourseItem`: `{ id, code, title, program, workloadHours, createdAt, updatedAt }` (`^COURSE-[0-9]{2}$`, `15..240` hours)
- `Enrollment`: `{ id, code, studentId, studentCode, studentName, courseId, courseCode, courseTitle, term, status, createdAt, updatedAt }` (`^ENR-[0-9]{4}$`)
- `AcademicActivity`: `{ id, code, enrollmentId, studentCode, studentName, courseCode, courseTitle, title, category, score, maxScore, status, createdAt, updatedAt }` (`^ACT-[0-9]{4}$`, score `0..100`)

Strictly excluded fields: CPF, RG, national ID, address, phone number, birth date, or email address.
