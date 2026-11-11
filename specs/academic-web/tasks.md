# Tasks Breakdown: FEAT-WEB-001 - SPECTION Academic Lab Web

| Task ID | Title | Description | Related Requirements | Status |
|---|---|---|---|---|
| **TASK-WEB-001** | Initial Web Project Structure | Configure `web/package.json`, `tsconfig.json` (`strict: true`), `next.config.mjs` (`output: 'export'`), Vitest, and Playwright configs while preserving Python files. | RNF-WEB-007 | Completed |
| **TASK-WEB-002** | Design System & Brand Identity | Create CSS design tokens (`globals.css`) for dark/light themes, responsive grid/table styles, vector logo (`BrandLogo.tsx`), `favicon.svg`, and `brand-banner.svg`. | RNF-WEB-001, RNF-WEB-002 | Completed |
| **TASK-WEB-003** | Domain Layer & Validations | Implement `web/lib/domain/students.ts` with `DEMO-0001` normalization, name/course validation, duplicate prevention, search, sort, demo seed merge, dashboard metrics, and safe CSV export. | RF-WEB-001..RF-WEB-014 | Completed |
| **TASK-WEB-004** | Storage & Privacy Adapters | Implement `MemoryStorageAdapter`, consent-gated `LocalStorageAdapter`, and graceful error handling in `web/lib/storage/storage.ts`. | RNF-WEB-003, RNF-WEB-004, RNF-WEB-005, RNF-WEB-006 | Completed |
| **TASK-WEB-005** | Student Registration Form | Build accessible `StudentForm.tsx` with field validation messages, success feedback, and fictional data guidance. | RF-WEB-001..RF-WEB-005, RNF-WEB-002 | Completed |
| **TASK-WEB-006** | Student Listing, Search & Sorting | Build responsive student table on `/students` with search bar, course filter, column sorting, CSV export trigger, and empty state CTA. | RF-WEB-006, RF-WEB-007, RF-WEB-008, RF-WEB-013 | Completed |
| **TASK-WEB-007** | Student Editing, Deletion & Local Clear | Add inline/form editing mode and accessible `ConfirmDialog.tsx` for single-record deletion and clearing all local records. | RF-WEB-009, RF-WEB-010, RF-WEB-012 | Completed |
| **TASK-WEB-008** | Academic Dashboard & Engineering View | Implement `/` dashboard (metrics cards, computed course distribution chart, recent students, demo seed button, engineering progress) and `/documentation` Engineering Journey view. | RF-WEB-011, RF-WEB-014 | Completed |
| **TASK-WEB-009** | Privacy Notice, Preferences & Legal Views | Implement first-visit privacy banner, privacy preferences modal (Essential Only vs Allow Local Storage + Revoke), Privacy Policy, and Terms of Use on `/about`. | RNF-WEB-003, RNF-WEB-004, RNF-WEB-005 | Completed |
| **TASK-WEB-010** | Automated Tests & Evidence Capture | Write and execute Vitest unit tests, React Testing Library component tests, Playwright E2E tests, and Python unit tests; capture screenshots and update `docs/evidence.md`. | All RF & RNF | Completed |
| **TASK-WEB-011** | CI/CD & GitHub Pages Workflow | Update `.github/workflows/academic-lab.yml` to run Python tests, typecheck, Vitest, static build, Playwright E2E, and deploy `web/out` to GitHub Pages. | RNF-WEB-007 | Completed |
| **TASK-WEB-012** | Publication & Main Portal Integration | Reformulate `README.md`, publish changes to GitHub, verify live GitHub Pages deployment, and integrate Academic Lab into the `alexsandsouza/spection` portal. | Release & Integration | Completed |
