# Implementation Plan: FEAT-WEB-001 - SPECTION Academic Lab Web

## 1. Execution Phases

Following the SPECTION Framework workflow defined in `AGENTS.md`:

### Phase A - Discovery (Completed)
- Inspect existing repository structure, git commit history, `AGENTS.md`, and `.agents/skills/`.
- Execute baseline Python test suite (`python -m unittest discover -s tests -v`) to confirm 5/5 passing tests.

### Phase B - Specification (Completed)
- Update `docs/product-brief.md` and `docs/prd.md` with `RF-WEB-001`..`RF-WEB-014` and `RNF-WEB-001`..`RNF-WEB-007`.
- Create `specs/academic-web/spec.md`, `specs/academic-web/acceptance.md`, `specs/academic-web/plan.md`, `specs/academic-web/tasks.md`, and `docs/traceability.md`.

### Phase C - Architecture (Completed)
- Update `docs/hld.md`, `docs/lld.md`, `docs/adr.md`, and `docs/roadmap.md`.
- Record `ADR-0001` through `ADR-0006` in `docs/adr/`.

### Phase D - Implementation
- **Increment 1 (`TASK-WEB-001`, `TASK-WEB-002`)**: Initialize `web/` Next.js project with TypeScript `strict`, static export config, vector brand assets (`BrandLogo`, `favicon.svg`, `brand-banner.svg`), and CSS design tokens (dark/light themes).
- **Increment 2 (`TASK-WEB-003`, `TASK-WEB-004`)**: Implement pure domain layer (`web/lib/domain/students.ts`) and storage/privacy abstraction (`web/lib/storage/storage.ts`).
- **Increment 3 (`TASK-WEB-005`..`TASK-WEB-009`)**: Implement React state provider, i18n (EN/PT-BR), AppShell (Sidebar, Header, Footer), Privacy Banner & Preferences modal, Dashboard page, Students CRUD page, Engineering Journey & Documentation page, Roadmap page, and About/Legal page.

### Phase E - Quality Gate
- **Increment 4 (`TASK-WEB-010`)**: Implement and run Vitest unit tests, React Testing Library component tests, Playwright E2E browser tests, TypeScript `tsc --noEmit`, Next.js static export build, and Python `unittest`. Capture real screenshots and record command outputs in `docs/evidence.md`.

### Phase F - Release & CI/CD
- **Increment 5 (`TASK-WEB-011`, `TASK-WEB-012`)**: Configure `.github/workflows/academic-lab.yml` for full CI + gated GitHub Pages deployment, craft the bilingual README with real screenshots, push to GitHub, and verify CI and live GitHub Pages publication.

### Phase G - Portal Integration
- Inspect `https://github.com/alexsandsouza/spection`, validate its build, and update the Live Project section with SPECTION Academic Lab links, documentation, test evidence, roadmap, and version status.
