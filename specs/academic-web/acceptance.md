# Acceptance Criteria: FEAT-WEB-001..004 - SPECTION Academic Lab Web (`v0.5.0`)

All scenarios below are verified via automated tests (`tests/test_students.py`, `web/tests/unit/`, `web/tests/components/`, and `web/tests/e2e/`).

---

### Scenario AC-WEB-001..006: Synthetic Student Registry (`RF-WEB-001`..`RF-WEB-010`)
- **Given** the visitor is on `/students`
- **When** registering, searching, sorting, editing, or deleting a fictional student (`DEMO-0001`)
- **Then** codes are normalized, invalid/duplicate codes are rejected, edits update `updatedAt`, and deletions require modal confirmation and clean up dependent enrollments/activities.

### Scenario AC-WEB-007..009: Demo Dataset, Local Clear & Safe CSV Export (`RF-WEB-011`..`RF-WEB-014`)
- **Given** any academic module view
- **When** the visitor loads demo data, exports CSV, or clears local data
- **Then** demo records across Students, Courses, Enrollments, and Activities are merged without duplicates, CSV exports neutralize formula prefixes (`=`, `+`, `-`, `@`, `\t`, `\r`), and dashboard metrics update automatically.

### Scenario AC-WEB-010..011: Privacy Lifecycle & Mobile Accessibility (`RNF-WEB-001`..`RNF-WEB-006`)
- **Given** first visit or *Essential Only* mode
- **When** records are created across any module and the page reloads
- **Then** zero academic records are persisted to `localStorage`; when *Allow Local Storage* is enabled, all four modules persist across reloads and are immediately purged upon consent revocation.

### Scenario AC-WEB-012: Synthetic Courses Catalog & Deletion Guard (`RF-WEB-015`..`RF-WEB-018`)
- **Given** the visitor is on `/courses`
- **When** the visitor registers `" course-01 "` with title `"Software Architecture & SDD"`, program `"Software Engineering"`, and workload `60`
- **Then** `"COURSE-01"` is normalized and listed; if an enrollment references `"COURSE-01"`, attempting to delete `"COURSE-01"` is blocked with an explicit referential integrity alert until the enrollment is removed.

### Scenario AC-WEB-013: Relational Student Enrollments (`RF-WEB-019`..`RF-WEB-022`)
- **Given** student `"DEMO-0001"` and course `"COURSE-01"` exist
- **When** the visitor creates an enrollment on `/enrollments` for term `"2026.1"` with status `"ACTIVE"`
- **Then** the enrollment is registered with code `"ENR-0001"`, duplicate enrollment of `"DEMO-0001"` in `"COURSE-01"` for `"2026.1"` is rejected, and status changes (`COMPLETED`, `DROPPED`) update live indicators.

### Scenario AC-WEB-014: Academic Activities & Gradebook Scores (`RF-WEB-023`..`RF-WEB-026`)
- **Given** an active enrollment `"ENR-0001"` exists
- **When** the visitor registers activity `"ACT-0001"` (`"Specification & Domain Modeling Lab"`, category `"LAB"`, score `95`, status `"GRADED"`) on `/activities`
- **Then** the activity is listed, scores outside `0..100` are rejected, and the academic average score indicator updates on the Dashboard and Activities view.
