# Roadmap - SPECTION Academic Lab

## Historical & Current Releases

- **v0.1 (Completed - Verified)**: `FEAT-001` - Synthetic student registry in Python 3 and SQLite (`students.py`) with automated unit tests (`tests/test_students.py`) and initial SDD documentation.
- **v0.2 (Planned)**: Courses and enrollment relational constraints (`FEAT-002`). Currently represented in the web UI via the predefined demonstration course catalog (`RF-WEB-004`) and planned module indicators.
- **v0.3 (Completed - Current Release)**: `FEAT-WEB-001` - Interactive Web Application built with Next.js (Static Export), React, and TypeScript (`strict`). Includes:
  - Academic Dashboard with live indicators and course distribution chart.
  - Full synthetic student CRUD (create, normalize, validate, search, filter, sort, edit, delete with confirmation, demo dataset loader, local clear, safe CSV export).
  - Privacy-by-design controls (ephemeral memory default, optional `localStorage` consent, revocation, Privacy Policy, and Terms of Use).
  - SPECTION Engineering Journey timeline and live traceability explorer.
  - Bilingual interface (EN / PT-BR) and Light/Dark themes.
  - Automated verification with Python `unittest`, Vitest, React Testing Library, and Playwright E2E.
- **v0.4 (Planned)**: Authentication and authorization architecture study, role-based access control simulation, and formal threat model.
- **v0.5 (Planned)**: Academic assignments, activities, and gradebook simulation using synthetic datasets.
- **Future (Exploratory)**: Optional AI-assisted specification and academic analytics sandbox with strict privacy review and human-in-the-loop approval gates.
