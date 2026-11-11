# ADR-0005: Client-Only V1 Architecture Without Backend or Authentication

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RNF-WEB-005, RNF-WEB-007

## Context
SPECTION Academic Lab is an open-source educational environment designed exclusively for fictional student records (`DEMO-0001`). Adding a remote database or user authentication in V1 would create server maintenance obligations, potential data liability if users submitted personal data to a shared server, and barriers to trying the demo.

## Considered Alternatives
1. **Shared cloud database + OAuth login**: High friction for visitors; creates central data storage risk if someone ignores the fictional-data warning.
2. **100% client-side execution with zero backend calls**: Every visitor interacts with an isolated sandbox in their own browser; zero student records ever leave the client device (`RNF-WEB-005`).

## Decision
Do not include a backend server, remote database, authentication system, or third-party analytics in V1. All student registry operations run locally in the browser. Authentication and authorization threat modeling remain scheduled on the roadmap (`v0.4`) as a future architectural study.

## Consequences
- **Positive**: Zero server attack surface; zero external data transmission (`RNF-WEB-005`); instant zero-login access for students and reviewers.
- **Negative**: Data is not shared across devices (users can export/import via CSV if needed).
