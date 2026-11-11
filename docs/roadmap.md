# SPECTION Academic Lab - Roadmap 2026

> Proposed milestones. Current delivered baseline: v0.5.0. All student and academic information is synthetic. Dates and releases are not promised.

## Vision

An open-source academic system that teaches the complete SPECTION journey: Product Brief, PRD, HLD, LLD, ADR, feature specification, Agent Skills, tasks, test evidence, human review and release. Each milestone must provide a usable demonstration and traceable proof.

## Delivered and preserved: v0.5.0

- Python/SQLite registry and unit tests as historical baseline.
- Next.js/React/TypeScript web app, GitHub Pages, synthetic students, courses, relational enrollments and activities with scores.
- Dashboard indicators, search and filtering, CSV exports, themes and language options.
- Memory-only storage by default, optional local persistence and privacy controls.
- SDD documentation, tests, CI/CD and evidence.

These functions are NOT new deliverables. All future releases must preserve them.

## Prioritized milestones

| Milestone | Focus | Demonstration | Required gate |
|---|---|---|---|
| v0.6 | Academic Intelligence | Attendance sessions, presence records, weighted gradebook and fictional student transcript | Domain invariants, calculations, unit/E2E tests, traceability |
| v0.7 | Reports & Data | Consolidated PDF/CSV reports and JSON/CSV bulk-import preview with conflict handling | Safe exports/import validation and round-trip evidence |
| v0.8 | Roles & Security | Simulated Registrar/Professor/Student experiences and STRIDE threat-model explorer | Explicit disclaimer: client-only roles are not real authorization |
| v0.9 | Connected Architecture | Optional REST API, PostgreSQL, migrations and integration tests | Separate deployment; retain original static Pages demo |
| v1.0 | Verified Release | Stable, reviewed open-source milestone with accessibility, security and reproducible releases | CI, E2E, human-reviewed Quality Gates and evidence |
| v1.1 | AI Academic Assistant | Optional suggestions for teaching activities and feedback drafts | Human approval, evaluation, provenance and privacy review |

## v0.6 - FEAT-005 - next development target

### Product goal
Help users simulate academic progress from enrollment through grades and attendance without entering real student information.

### Core data and design
- AttendanceSession: id, courseId, term, sessionDate and title.
- AttendanceRecord: id, sessionId, enrollmentId and presence flag.
- GradePolicy: courseId, activity category and weight. Enabled weights must total 100 percent.
- SyntheticTranscript: read-only projection of enrollment, attendance and graded activities. Existing activity data is authoritative; do not duplicate it in a second score table.

### Requirements / Acceptance criteria
- AC-006-01: Only an enrollment for the chosen course and term can receive attendance.
- AC-006-02: Reject duplicate attendance for one enrollment in a single session.
- AC-006-03: Compute attendance percentage correctly and show no data if no sessions exist.
- AC-006-04: Allow an attendance correction without creating an extra attendance record.
- AC-006-05: Compute weighted grades with defined and tested rounding.
- AC-006-06: Pending or ungraded activities must not be counted as completed grades.
- AC-006-07: Dashboard, student progress and transcript must update consistently.
- AC-006-08: Preserve temporary storage as default and optional local storage, export and erasure.
- AC-006-09: Every transcript must be labeled as fictional and without official validity.
- AC-006-10: Mobile layout, keyboard navigation, accessible feedback and EN/PT-BR/ES UI review.

### SPECTION implementation checklist
1. Update Product Brief and PRD with traceable requirement IDs.
2. Create feature spec and acceptance tests before implementation.
3. Update HLD, LLD and ADR for academic grade and attendance business rules.
4. Add pure domain functions, unit tests and documented storage adapters.
5. Implement attendance, grade policy, transcript and dashboard screens.
6. Execute E2E, accessibility, privacy and regression tests.
7. Record actual evidence, human review and release notes.

The v0.6 label remains PLANNED until its gates and browser deployment are verified.

## v0.7 - Reports and imports

Extend existing CSV exports. Add accessible PDF reports, a consolidated student progress report, JSON/CSV schema validation, dry-run preview, duplicate/conflict strategies (skip, update or reject) and injection-safe CSV. Require malformed-file, privacy and round-trip tests.

## v0.8 - Demo access roles and threat modeling

Simulate Registrar, Professor and Student role-based views while prominently explaining that local role selection is NOT real authentication or access control. Retain the previously planned STRIDE explorer, with documented transition requirements for server-enforced security.

## v0.9 - Optional backend

Add a separately deployable REST API, PostgreSQL, schema migration and integration tests. Protect operations with appropriate server-side controls. The GitHub Pages demo stays entirely synthetic and static, with no new data collection required.

## v1.0 - Release verification

Document evidence for functional tests, accessibility, CI deployment, dependency risks, threat model, manual Quality Gate review, changelog and reproducible release. Never claim certifications without independent grounds.

## v1.1 - Optional AI

Prototype educator-focused activity and feedback suggestions, not automated consequential student decisions. Require human approval, generated-content labeling, no real student profiling, privacy impact assessment and benchmark/evaluation evidence.

## Premium UX direction

- Sidebar grouped as Academic Management, Academic Intelligence and SPECTION Engineering.
- Dashboard with synthetic KPIs, attendance trends, grade distribution and workflow shortcuts.
- Responsive accessible tables and charts with empty, loading and error states.
- Read-only learner journey from enrollment to attendance, activities and grades.
- Dark/light themes, consistent typography, clear labels and reduced-motion support.
- Engineering Journey cards linked to actual specs, decisions, tests and release evidence.
- Permanent notice: Demonstration - Synthetic Data Only.

## Traceability / Quality Gates for every release

Discover (brief) -> Specify (PRD) -> Design (HLD, LLD, ADR) -> Plan (tasks) -> Implement (tested code) -> Verify (actual evidence) -> Release (human approval + deployed site). A completed task alone never implies a verified requirement.

## Roadmap revision

2026-11-10: Prioritized attendance and grades for v0.6, moved the original planned RBAC/STRIDE scope to v0.8, and kept bulk-import validation in v0.7 alongside reporting. No planned functionality is represented as already implemented.
