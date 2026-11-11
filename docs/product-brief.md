# Product Brief - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Author & Maintainer**: Alexsand Farias de Souza
- **Repository**: https://github.com/alexsandsouza/spection-academic-lab
- **Main Framework**: https://github.com/alexsandsouza/spection
- **Official Portal**: https://alexsandsouza.github.io/spection/
- **License**: MIT
- **Status**: Implemented (FEAT-001 CLI/SQLite Baseline + FEAT-WEB-001 Web Application Increment) - Human release approval checkpoint tracked in `docs/evidence.md`.

---

## 1. Historical Baseline (v0.1 - FEAT-001)

- **Problem**: Demonstrate end-to-end specification-driven software engineering with a small academic domain.
- **Users**: Students, professors, and developers learning SPECTION.
- **Goal**: Implement and verify one student registry feature with explicit requirements and traceability.
- **Scope**: Synthetic student codes and fictional names, local registry (`students.py` with Python 3 and SQLite). Excludes real student data, authentication, grades, attendance, and production deployment.

---

## 2. Web Application Increment (v0.3 - FEAT-WEB-001)

### 2.1 Context
SPECTION Academic Lab is the official demonstration project of the SPECTION Framework. While the initial Python/SQLite implementation (`FEAT-001`) proved deterministic domain rules and unit test traceability in a minimal local script, learners, educators, and software engineers evaluating SPECTION need an interactive, accessible, zero-cost web application that demonstrates how Spec-Driven Development (SDD) and Harness Engineering scale to a full client-side web interface deployed on GitHub Pages.

### 2.2 Problem Evidence
1. Many software engineering methodologies show static templates or landing pages rather than working, tested software increments.
2. Learners need to inspect the complete chain of artifacts (Product Brief -> PRD -> HLD -> LLD -> ADR -> Feature Spec -> Tasks -> Tests -> Release Evidence) side by side with the running software that implements them.
3. Public educational demos often neglect privacy-by-design, storing browser data without user consent or failing to warn against entering real personal data.

### 2.3 Target Audience & Actors
- **Software Engineers & Architects**: Evaluating Spec-Driven Development, Agent Skills, and traceability practices.
- **Professors & Students**: Using the lab in academic courses to study requirements engineering, software architecture, quality gates, and privacy controls.
- **Open-Source Contributors & Technical Reviewers**: Auditing code quality, automated test suites (Python unittest, Vitest, React Testing Library, Playwright), and CI/CD pipelines.

### 2.4 Goals
1. Deliver a functional, responsive, accessible web application (`FEAT-WEB-001`) hosted on GitHub Pages (`https://alexsandsouza.github.io/spection-academic-lab/`).
2. Provide a complete synthetic student registry workflow: dashboard metrics, creation, code normalization, validation, duplicate prevention, search, filtering, sorting, editing, deletion with confirmation, demo dataset loading, local data clearing, and CSV export protected against formula injection.
3. Implement explicit privacy-by-design controls aligned with LGPD/GDPR principles for educational demos: in-memory ephemeral storage by default, optional `localStorage` persistence only upon explicit user consent, and immediate revocation with data erasure.
4. Expose an interactive **SPECTION Engineering Journey** view that links every lifecycle stage, requirement, ADR, task, and verification result to real repository artifacts.
5. Preserve the historical Python/SQLite implementation (`students.py` and `tests/test_students.py`) as an active, tested reference implementation of the same core domain rules.

### 2.5 Scope (In-Scope for FEAT-WEB-001)
- Academic Dashboard with real-time calculated indicators, course distribution chart, recent records, and engineering evidence summary.
- Synthetic Student Management (`Students` view) using strictly fictional data (`DEMO-0001` pattern, fictional name, and predefined demonstration course).
- Dual-mode client storage (`MemoryStorageAdapter` default, `LocalStorageAdapter` opt-in).
- First-visit Privacy Notice, Privacy Preferences modal, Privacy Policy, and Terms of Use pages/sections.
- SPECTION Engineering Journey timeline, SDD Documentation explorer, Roadmap view, and About page.
- Bilingual user interface support (English and Brazilian Portuguese) and Light/Dark theme switching.
- Automated verification suite: Python unit tests, TypeScript typecheck, Vitest unit and component tests, and Playwright browser E2E tests.

### 2.6 Out of Scope (Exclusions)
- Real personal data of students or staff (strictly forbidden: no CPF, RG, email, phone, address, birth date, or institutional IDs).
- Backend servers, remote databases, cloud APIs, or paid external services.
- Real user authentication, role-based access control, or multi-tenant sessions (planned for future architectural study in v0.4).
- Full implementation of Courses, Enrollments, and Assignments modules (displayed in the sidebar with explicit `Planned` badges only).
- Advertising, third-party analytics, or behavioral tracking scripts.
- Formal legal certification under LGPD or GDPR (the application is a synthetic educational demonstration; any adaptation for real personal data requires independent legal review).

### 2.7 Measurable Success Metrics
- **M-01 (Requirement Traceability)**: 100% of functional (`RF-001`..`RF-004`, `RF-WEB-001`..`RF-WEB-014`) and non-functional (`RNF-001`..`RNF-002`, `RNF-WEB-001`..`RNF-WEB-007`) requirements mapped to implementation files and automated tests in `docs/traceability.md`.
- **M-02 (Automated Quality Gate)**: 100% pass rate across Python unit tests, Vitest unit/component tests, TypeScript strict typecheck, Next.js static export build, and Playwright E2E scenarios.
- **M-03 (Privacy Default Compliance)**: 0 bytes written to `localStorage` for student records before explicit user opt-in, verified by automated unit and E2E tests.
- **M-04 (Zero External Data Transmission)**: 0 network requests transmitting student registry records to external servers or AI models.

### 2.8 Assumptions, Risks & Human Approval Checkpoints
- **Assumption A-01**: Users have a modern web browser supporting ES2020+, CSS custom properties, and optional `localStorage`.
- **Risk R-01**: Users might attempt to type real names into the demo. *Mitigation*: Enforce `DEMO-0001` code format, restrict courses to a closed list, display persistent Demo Environment banners, default to ephemeral in-memory storage, and warn against entering real data in the form and privacy notice.
- **Risk R-02**: `localStorage` may be blocked or throw quota errors in restricted browser contexts. *Mitigation*: Wrap all storage operations in safe try/catch handlers and fall back gracefully to in-memory storage with a clear user notification (`RNF-WEB-006`).
- **Human Approval Checkpoint**: Final production release sign-off and legal review before any non-synthetic adaptation remain with the repository maintainer (Alexsand Farias de Souza).
