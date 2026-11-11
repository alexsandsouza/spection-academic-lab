# Feature Specification: FEAT-WEB-001 - Synthetic Student Management Web Application

## 1. Overview

- **Feature ID**: `FEAT-WEB-001`
- **Title**: Synthetic Student Management, Academic Dashboard, Privacy Controls, and SPECTION Engineering Journey
- **Requirements Covered**: `RF-WEB-001` through `RF-WEB-014`, `RNF-WEB-001` through `RNF-WEB-007`
- **Related ADRs**: `ADR-0002`, `ADR-0003`, `ADR-0004`, `ADR-0005`, `ADR-0006`
- **Dependencies**: Preserves `FEAT-001` (`students.py` and `tests/test_students.py`) without modification.

## 2. User Stories

1. **As a learner or evaluator of SPECTION**, I want an interactive academic dashboard that displays real-time indicators calculated from synthetic student records so I can observe an authentic software increment.
2. **As an instructor or student**, I want to create, search, filter, sort, edit, delete, seed, clear, and export fictional student records (`DEMO-0001`) with strict validation so I can verify how domain invariants are enforced in the browser.
3. **As a privacy-conscious visitor**, I want the application to keep demonstration records in temporary memory by default and only persist to `localStorage` if I explicitly opt in, with the ability to revoke consent and purge persisted data at any time.
4. **As a software engineer studying Spec-Driven Development**, I want an **Engineering Journey** view that maps Product Brief, PRD, HLD, LLD, ADRs, Feature Specs, Tasks, Quality Gates, and Release Evidence to real repository artifacts and verifiable states.

## 3. Data Contract

```typescript
export type Student = {
  id: string;
  code: string;      // Normalized uppercase matching ^DEMO-[0-9]{4}$
  name: string;      // Trimmed fictional name, 2 to 80 characters
  course: string;    // Must belong to DEMO_COURSES
  createdAt: string; // ISO-8601 timestamp
  updatedAt: string; // ISO-8601 timestamp
};
```

Strictly excluded fields: CPF, RG, national ID, address, phone number, birth date, or email address.

## 4. Scenario-Based Acceptance Criteria Summary

Full Given/When/Then acceptance criteria are detailed in [specs/academic-web/acceptance.md](acceptance.md):

- **AC-WEB-001**: Valid student creation normalizes `code` and updates table and dashboard indicators (`RF-WEB-001`, `RF-WEB-002`, `RF-WEB-014`).
- **AC-WEB-002**: Invalid `code` pattern, out-of-range `name`, or invalid `course` displays accessible validation errors and prevents creation (`RF-WEB-002`, `RF-WEB-003`, `RF-WEB-004`).
- **AC-WEB-003**: Duplicate student code (even with lowercase or extra spaces) is rejected (`RF-WEB-005`).
- **AC-WEB-004**: Search by name/code/course and multi-field sorting update the displayed rows accurately (`RF-WEB-006`, `RF-WEB-007`, `RF-WEB-008`).
- **AC-WEB-005**: Editing a student updates fields and `updatedAt` while enforcing validation and uniqueness (`RF-WEB-009`).
- **AC-WEB-006**: Deleting a student or clearing all records requires explicit modal confirmation (`RF-WEB-010`, `RF-WEB-012`).
- **AC-WEB-007**: Loading demonstration data adds curated records idempotently without duplicating existing codes (`RF-WEB-011`).
- **AC-WEB-008**: Exporting to CSV escapes quotes/delimiters and neutralizes formula injection prefixes (`RF-WEB-013`).
- **AC-WEB-009**: Privacy consent defaults to ephemeral memory storage, supports opt-in `localStorage` persistence across reloads, and purges stored data upon revocation (`RNF-WEB-003`, `RNF-WEB-004`, `RNF-WEB-006`).
- **AC-WEB-010**: Desktop and mobile navigation, theme toggle, language switch (EN/PT-BR), and keyboard accessibility operate cleanly (`RNF-WEB-001`, `RNF-WEB-002`).
