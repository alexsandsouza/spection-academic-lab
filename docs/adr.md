# Architecture Decision Records (ADR Index)

This document preserves the original ADR-0001 record and indexes all Architecture Decision Records for SPECTION Academic Lab located in `docs/adr/`.

---

## Historical Baseline Record: ADR-0001 - Python and SQLite

- **Status**: Proposed baseline, implemented locally; human review pending.
- **Context**: Demonstrate requirements and evidence without external services.
- **Options**: Browser-only storage, Python SQLite, full web stack.
- **Decision**: Python standard library and SQLite for deterministic local tests and a small learning surface.
- **Consequences**: No multi-user authentication, production hosting, or concurrent web access. Reassess when adding a web interface.

---

## ADR Catalog (`docs/adr/`)

| ID | Title | Status | Related Requirements |
|---|---|---|---|
| [ADR-0001](adr/0001-python-and-sqlite.md) | Python Standard Library and SQLite Baseline | Implemented (Verified) | RF-001..RF-004, RNF-001, RNF-002 |
| [ADR-0002](adr/0002-nextjs-static-export.md) | Next.js App Router with Static Export for Web Layer | Implemented (Verified) | RNF-WEB-001, RNF-WEB-002, RNF-WEB-007 |
| [ADR-0003](adr/0003-optional-local-storage.md) | Dual Storage Strategy: In-Memory Default and Consent-Gated `localStorage` | Implemented (Verified) | RNF-WEB-003, RNF-WEB-004, RNF-WEB-006 |
| [ADR-0004](adr/0004-preserve-python-implementation.md) | Coexistence and Preservation of the Python/SQLite Implementation | Implemented (Verified) | RF-001..RF-007, RF-WEB-001..RF-WEB-026 |
| [ADR-0005](adr/0005-no-auth-or-backend-v1.md) | Client-Only Architecture Without Backend or Authentication | Implemented (Verified) | RNF-WEB-005, RNF-WEB-007 |
| [ADR-0006](adr/0006-github-pages-publishing.md) | Quality-Gated GitHub Pages Publishing Pipeline | Implemented (Verified) | RNF-WEB-007 |
| [ADR-0007](adr/0007-relational-academic-domain-evolution.md) | Relational Academic Domain Evolution (Courses, Enrollments, Activities) | Implemented (Verified) | RF-005..RF-007, RF-WEB-015..RF-WEB-026 |


## ADR-0008 - Separate Academic Progress Context (v0.6)

Status: Implemented in source, verification pending.

Decision: Keep the v0.5 academic collection shape and introduce a separate progress domain/context for attendance and grade policy. Student transcripts are derived views. Persist progress under a distinct versioned key only after an existing privacy opt-in; purge it with the other academic keys on consent revocation. This enables backward compatibility with the published static GitHub Pages application.

Trade-offs: No server-side audit, authentic attendance, identity verification or multi-user synchronization. Academic Intelligence is suitable for fictional demonstrations only.

References: specs/academic-intelligence-v06.md, web/lib/domain/progress.ts, web/lib/context/AcademicProgressContext.tsx.
