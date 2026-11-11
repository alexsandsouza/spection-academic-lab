# Product Requirements Document (PRD) - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Maintainer**: Alexsand Farias de Souza
- **Related Brief**: [docs/product-brief.md](product-brief.md)
- **Traceability Matrix**: [docs/traceability.md](traceability.md)

---

## 1. Baseline Requirements (FEAT-001 - Python/SQLite Implementation)

Preserved from the initial release and continuously verified via `tests/test_students.py`:

- **RF-001**: Register a synthetic student with normalized `DEMO-0001` code and fictional name.
- **RF-002**: Reject codes outside `DEMO-[0-9]{4}` and names outside 2-80 characters.
- **RF-003**: Reject duplicate codes without overwriting existing records.
- **RF-004**: List records sorted by code.
- **RNF-001**: Use parameterized SQL; perform no network calls.
- **RNF-002**: Use in-memory database by default; allow no real student data.
- **Baseline Acceptance**: All five automated tests in `tests/test_students.py` pass; human review required before release.

---

## 2. Web Application Functional Requirements (FEAT-WEB-001)

| ID | Requirement Description | Priority | Verification Method |
|---|---|---|---|
| **RF-WEB-001** | Register a synthetic student containing `id`, `code`, `name`, `course`, `createdAt`, and `updatedAt`. | Must | Unit, Component, E2E |
| **RF-WEB-002** | Validate and normalize the student code to uppercase trimmed format matching `^DEMO-[0-9]{4}$` (e.g., `DEMO-0001`). | Must | Unit, Component, E2E |
| **RF-WEB-003** | Validate the fictional student name after trimming so its length is between 2 and 80 characters inclusive. | Must | Unit, Component |
| **RF-WEB-004** | Require selecting a course strictly from the allowed demonstration course catalog. | Must | Unit, Component |
| **RF-WEB-005** | Prevent duplicate student codes across records, including after whitespace removal and uppercase normalization. | Must | Unit, Component, E2E |
| **RF-WEB-006** | List registered synthetic students in a responsive table showing code, name, course, registration date, and actions. | Must | Component, E2E |
| **RF-WEB-007** | Search and filter registered students by name, code, or course (case-insensitive substring match and course filter). | Must | Unit, Component, E2E |
| **RF-WEB-008** | Sort student records by code, name, course, or registration date in ascending or descending order. | Must | Unit, Component |
| **RF-WEB-009** | Edit an existing synthetic student record with full validation, duplicate checking, and `updatedAt` timestamp update. | Must | Unit, Component, E2E |
| **RF-WEB-010** | Delete an existing synthetic student record only after explicit user confirmation. | Must | Unit, Component, E2E |
| **RF-WEB-011** | Load a curated set of synthetic demonstration students without duplicating codes that already exist in the current state. | Must | Unit, Component, E2E |
| **RF-WEB-012** | Clear all local student records upon explicit user confirmation. | Must | Unit, Component, E2E |
| **RF-WEB-013** | Export the current synthetic student records to a valid CSV file with proper escaping of quotes/delimiters and neutralization of spreadsheet formula prefixes (`=`, `+`, `-`, `@`, `\t`, `\r`). | Must | Unit, Component |
| **RF-WEB-014** | Automatically update academic dashboard indicators (total students, represented courses, latest registration, storage mode, and course distribution chart) whenever records or storage preferences change. | Must | Unit, Component, E2E |

---

## 3. Web Application Non-Functional Requirements (FEAT-WEB-001)

| ID | Requirement Description | Category | Verification Method |
|---|---|---|---|
| **RNF-WEB-001** | Provide a responsive user interface across desktop and mobile viewports, including collapsible desktop sidebar and accessible mobile navigation drawer. | Usability / UI | Component, E2E (mobile viewport) |
| **RNF-WEB-002** | Ensure keyboard navigation and screen reader accessibility (semantic landmarks, explicit form labels, `aria-live` feedback, dialog roles, and visible focus states). | Accessibility | Component, E2E |
| **RNF-WEB-003** | Operate in ephemeral in-memory storage mode by default on first visit so no student records persist across reloads without authorization. | Privacy by Design | Unit, Component, E2E |
| **RNF-WEB-004** | Persist student records in `localStorage` only when explicitly authorized by the user, and allow revoking authorization at any time with immediate removal of persisted records. | Privacy / LGPD & GDPR principles | Unit, Component, E2E |
| **RNF-WEB-005** | Transmit zero student records to backend servers, third-party analytics, or AI models; operate 100% client-side. | Security & Privacy | Static analysis, Architecture review |
| **RNF-WEB-006** | Gracefully handle `localStorage` unavailability, quota exceeded errors, or corrupted JSON payloads by falling back to in-memory storage and notifying the user without crashing. | Reliability | Unit |
| **RNF-WEB-007** | Build and publish as a static export (`output: 'export'`) compatible with GitHub Pages under `/spection-academic-lab`. | Portability / DevOps | Static build, CI/CD workflow |

---

## 4. Business Rules & Domain Constraints

1. **Data Minimization (BR-01)**: The `Student` model must strictly contain `id`, `code`, `name`, `course`, `createdAt`, and `updatedAt`. No sensitive or personally identifiable fields (CPF, RG, email, phone, address, birth date) are permitted.
2. **Code Normalization (BR-02)**: Input codes are trimmed (`trim()`) and converted to uppercase (`toUpperCase()`) prior to pattern validation and uniqueness checks.
3. **Allowed Demonstration Courses (BR-03)**: Only courses from the predefined academic catalog are accepted:
   - `Software Engineering`
   - `Computer Science`
   - `Information Systems`
   - `Data Science & AI`
   - `Cybersecurity`
   - `Computational Mathematics`
4. **CSV Injection Prevention (BR-04)**: Any exported field whose value (or trimmed value) begins with `=`, `+`, `-`, `@`, tab (`\t`), or carriage return (`\r`) must be prefixed with a single quote (`'`) and wrapped in double quotes with internal double quotes doubled (`""`).
5. **Separation of Concerns in Storage (BR-05)**: Privacy consent state and UI preferences (theme, language) are managed distinctly from student registry data. Revoking local storage authorization immediately purges persisted student records from `localStorage` and switches the registry adapter to `memory`.
6. **Honest Engineering Status (BR-06)**: Planned modules (`Courses`, `Enrollments`, `Assignments`) must be visibly marked as `Planned` in navigation and never disguised as active features. Lifecycle stages in the Engineering Journey view must reflect real verification status.

---

## 5. Security & Privacy Review Summary

- **Data Classification**: Synthetic educational demonstration data only.
- **Attack Surfaces & Mitigations**:
  - *Cross-Site Scripting (XSS)*: React JSX automatic escaping; no `dangerouslySetInnerHTML` used with user inputs; strict input validation.
  - *CSV Formula Injection*: Explicit sanitization in `exportStudentsToCsv` (`RF-WEB-013`).
  - *SQL Injection (Python baseline)*: Parameterized SQL queries verified by `test_RNF001_sql`.
  - *Unconsented Local Persistence*: Blocked by default via `MemoryStorageAdapter` (`RNF-WEB-003`, `RNF-WEB-004`).
  - *Storage Tampering / Corruption*: Schema validation on `localStorage` read; corrupted entries are rejected safely (`RNF-WEB-006`).
- **Legal Disclaimer**: This project does not claim certified legal compliance with LGPD or GDPR. Any institutional deployment using real personal data requires an independent legal, DPO, and security assessment.

---

## 6. Outstanding Questions & Decisions Log

- **Q-01 (Resolved in ADR-0002 & ADR-0005)**: How should the app be hosted without server costs? *Decision*: Next.js static export (`web/out`) deployed to GitHub Pages.
- **Q-02 (Resolved in ADR-0003)**: How should browser persistence respect privacy? *Decision*: Ephemeral in-memory storage by default; opt-in `localStorage` controlled by a dedicated privacy consent banner and preferences modal.
- **Q-03 (Resolved in ADR-0004)**: What happens to `students.py`? *Decision*: Preserved at repository root and tested in CI alongside the web application.
