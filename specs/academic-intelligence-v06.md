# FEAT-005 - Academic Intelligence v0.6

Status: IMPLEMENTED IN SOURCE - build/deploy and human acceptance pending.

## Product Brief
Extend the delivered v0.5 synthetic academic system with attendance, weighted grades and a read-only transcript. The educational objective is to demonstrate implementation driven by specification, domain invariants, testing and traceable evidence. No real student data or official grades.

## PRD
- RF-027: Register a session for an existing course and supported academic term.
- RF-028: Mark presence/absence for a matching enrollment; correction replaces previous record without duplication.
- RF-029: Calculate attendance percentage from eligible sessions and show N/A without sessions.
- RF-030: Configure grade category weights with integers 0-100 and total exactly 100.
- RF-031: Calculate weighted grades from activities marked GRADED; show pending when any weighted category lacks a grade.
- RF-032: Present a read-only synthetic transcript by enrollment and dashboard progress indicators.
- RNF-008: Preserve existing students, courses, enrollments, activities, legacy Python/SQLite baseline, and GitHub Pages static export.
- RNF-009: Default to ephemeral browser memory; use localStorage only after existing opt-in privacy consent, and clear progress on consent revocation or clearing all records.
- RNF-010: Provide responsive, accessible controls, English and Brazilian Portuguese UI, explicit fictitious-data notices, and automated domain tests.

## HLD
Next.js static interface (web/app/progress/page.tsx) -> AcademicProgressContext -> pure domain progress.ts -> memory/local persistence using existing privacy consent. The existing AcademicLabContext remains the source for students, courses, enrollments, and activities. No backend, analytics, or personal data transmission.

## LLD
- AttendanceSession: id, courseId, term, date, title
- AttendanceRecord: sessionId, enrollmentId, present (unique composite key)
- GradeWeights: EXAM, PROJECT, LAB, QUIZ (sum=100)
- Transcript: derived from Enrollment, AcademicActivity, AttendanceSession, AttendanceRecord; not a separate canonical storage table.

## ADR-0007
Retain local-only static architecture and derive the transcript from existing activity records. Separate academic progress from legacy AcademicCollections to avoid modifying existing storage serialization. Use a new versioned progress storage key and extend consent revocation and deletion to purge it. Defer institutional credentials, official certificates, multi-user concurrency, and any cloud storage.

## Acceptance and test traceability
| Acceptance | Rule | Evidence target |
|---|---|---|
| AC-006-01 | Reject sessions without valid existing course or duplicate identity | progress.test.ts |
| AC-006-02 | Reject attendance for mismatched course/term | progress.test.ts |
| AC-006-03 | Corrections replace an attendance record | progress.test.ts |
| AC-006-04 | Missing sessions produce no percentage; recorded attendance correct | progress.test.ts |
| AC-006-05 | Weight totals must equal 100 | progress.test.ts |
| AC-006-06 | Ungraded/incomplete categories cannot produce final weighted grade | progress.test.ts |
| AC-006-07 | Read-only transcript projects attendance, grades and enrollment information | progress.test.ts |
| AC-006-08 | Existing privacy opt-in and purge extend to progress | storage implementation and future E2E |
| AC-006-09 | No official academic validity implied | UI inspection |
| AC-006-10 | Desktop/mobile, keyboard and localization | manual/E2E regression |

## Implementation Tasks
- TASK-005-01: Define progress domain and tests.
- TASK-005-02: Integrate progress state with existing enrollment/activity data and privacy.
- TASK-005-03: Implement accessible attendance, weights and transcript page.
- TASK-005-04: Add menu/dashboard navigation and responsive styles.
- TASK-005-05: Run CI tests, static export, regression and browser review.
- TASK-005-06: Capture actual test evidence and approve release.

## Quality Gates
Source changes alone are not evidence of functionality. Publish only after successful GitHub Actions build/typecheck/tests and after manual validation that previous v0.5 features still work. Mark v0.6 released only after verified deployment and human sign-off.
