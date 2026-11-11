# Verification Evidence - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Maintainer**: Alexsand Farias de Souza
- **Verification Date**: 2026-11-10
- **Related Documents**: [PRD](prd.md), [Traceability Matrix](traceability.md), [Web Acceptance Criteria](../specs/academic-web/acceptance.md)

---

## 1. Historical Python Baseline Verification (`FEAT-001`)

Command executed at repository root:

```sh
python -m unittest discover -s tests -v
```

Actual output:

```text
test_RF001_create (test_students.StudentTests.test_RF001_create) ... ok
test_RF002_invalid (test_students.StudentTests.test_RF002_invalid) ... ok
test_RF003_duplicate (test_students.StudentTests.test_RF003_duplicate) ... ok
test_RF004_list (test_students.StudentTests.test_RF004_list) ... ok
test_RNF001_sql (test_students.StudentTests.test_RNF001_sql) ... ok

----------------------------------------------------------------------
Ran 5 tests in 0.013s

OK
```

| Requirement | Test | Local Result |
|---|---|---|
| RF-001 | `test_RF001_create` | PASS |
| RF-002 | `test_RF002_invalid` | PASS |
| RF-003 | `test_RF003_duplicate` | PASS |
| RF-004 | `test_RF004_list` | PASS |
| RNF-001 | `test_RNF001_sql` | PASS |

`RNF-002` is a design constraint (`:memory:` default and fictional data policy), not a proof that arbitrary names are fictional.

---

## 2. Web Application TypeScript Strict Verification (`FEAT-WEB-001`)

Command executed in `web/`:

```sh
npm run typecheck
```

Actual output:

```text
> spection-academic-lab-web@0.3.0 typecheck
> tsc --noEmit
(Exit code: 0 - 0 errors)
```

---

## 3. Web Unit & Component Verification (`Vitest + React Testing Library`)

Command executed in `web/`:

```sh
npm test
```

Actual output:

```text
 RUN  v2.1.9 C:/spection-academic-lab/web

 ✓ tests/unit/storage.test.ts (4 tests) 16ms
 ✓ tests/unit/students.test.ts (8 tests) 45ms
 ✓ tests/components/academic-lab.test.tsx (5 tests) 4011ms

 Test Files  3 passed (3)
      Tests  17 passed (17)
```

### Detailed Unit & Component Test Mapping

| Test Suite | Test Case | Requirements Verified | Result |
|---|---|---|---|
| `tests/unit/students.test.ts` | `normalizes student code and name properly` | RF-WEB-002, RF-WEB-003 | PASS |
| `tests/unit/students.test.ts` | `validates valid input and rejects invalid codes, names, and courses` | RF-WEB-002, RF-WEB-003, RF-WEB-004 | PASS |
| `tests/unit/students.test.ts` | `prevents duplicate student codes even after normalization` | RF-WEB-005 | PASS |
| `tests/unit/students.test.ts` | `creates, edits, and deletes student records accurately` | RF-WEB-001, RF-WEB-009, RF-WEB-010 | PASS |
| `tests/unit/students.test.ts` | `searches, filters, and sorts student records deterministically` | RF-WEB-007, RF-WEB-008 | PASS |
| `tests/unit/students.test.ts` | `loads demonstration dataset idempotently without duplicating existing codes` | RF-WEB-011 | PASS |
| `tests/unit/students.test.ts` | `calculates dashboard metrics accurately from current records` | RF-WEB-014 | PASS |
| `tests/unit/students.test.ts` | `exports CSV and neutralizes spreadsheet formula injection` | RF-WEB-013 | PASS |
| `tests/unit/storage.test.ts` | `stores records only in memory by default without touching localStorage` | RNF-WEB-003 | PASS |
| `tests/unit/storage.test.ts` | `blocks localStorage persistence when user has not authorized consent` | RNF-WEB-004 | PASS |
| `tests/unit/storage.test.ts` | `revokes consent and immediately purges persisted student records` | RNF-WEB-004 | PASS |
| `tests/unit/storage.test.ts` | `handles localStorage exceptions and corrupted payloads gracefully` | RNF-WEB-006 | PASS |
| `tests/components/academic-lab.test.tsx` | `renders empty state initially and registers a valid synthetic student` | RF-WEB-001..006 | PASS |
| `tests/components/academic-lab.test.tsx` | `displays validation errors for invalid form inputs and duplicate codes` | RF-WEB-002..005 | PASS |
| `tests/components/academic-lab.test.tsx` | `confirms deletion before removing a student record` | RF-WEB-010 | PASS |
| `tests/components/academic-lab.test.tsx` | `updates dashboard indicators dynamically when demo data is loaded` | RF-WEB-011, RF-WEB-014 | PASS |
| `tests/components/academic-lab.test.tsx` | `manages privacy preferences and revokes localStorage persistence` | RNF-WEB-003, RNF-WEB-004 | PASS |

---

## 4. Static Export Build Verification (`RNF-WEB-007`)

Command executed in `web/`:

```sh
npm run build
```

Actual output:

```text
Route (app)                              Size     First Load JS
┌ ○ /                                    5.49 kB         109 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ○ /about                               4.45 kB        99.9 kB
├ ○ /documentation                       5.62 kB         101 kB
├ ○ /roadmap                             3.22 kB        98.6 kB
└ ○ /students                            4.62 kB         100 kB
○  (Static)  prerendered as static content
```

---

## 5. End-to-End Browser Verification (`Playwright`)

Command executed in `web/`:

```sh
npm run test:e2e
```

Actual output:

```text
Running 4 tests using 1 worker

  ok 1 [chromium] › tests\e2e\academic-lab.spec.ts:7:3 › 1. Access dashboard, refuse optional storage, and verify ephemeral memory default (7.9s)
  ok 2 [chromium] › tests\e2e\academic-lab.spec.ts:43:3 › 2. Register, reject duplicate, search, edit, and delete synthetic student (2.0s)
  ok 3 [chromium] › tests\e2e\academic-lab.spec.ts:102:3 › 3. Authorize local storage, persist across reload, and revoke consent to purge data (1.8s)
  ok 4 [chromium] › tests\e2e\academic-lab.spec.ts:132:3 › 4. Verify Engineering Journey view and mobile navigation drawer (2.3s)

  4 passed (26.4s)
```

### Real Captured Screenshots
- `docs/screenshots/dashboard-dark.png`: Academic Dashboard with live metrics and course distribution chart.
- `docs/screenshots/students-crud.png`: Synthetic Student Management form, validation feedback, and table.
- `docs/screenshots/engineering-journey.png`: 10-stage SPECTION Engineering Journey timeline and visual traceability matrix.
- `docs/screenshots/mobile-view.png`: Responsive mobile viewport (`375x667`) with accessible navigation drawer.

---

## 6. Limitations, Legal Disclaimer & Human Review Checkpoint

1. **Synthetic Data Only**: The application enforces `DEMO-0001` code patterns and displays persistent warnings, but cannot semantically verify whether a user types a real person's name into the free-text name field. By default, records remain in temporary memory (`MemoryStorageAdapter`).
2. **Legal Review Requirement**: This project is an open-source educational demonstration and does not claim certified legal compliance with LGPD or GDPR. Any institutional adaptation involving real personal data requires an independent legal, privacy (DPO), and security review.
3. **Human Release Checkpoint**: All automated checks (5 Python unit tests, 12 Vitest unit tests, 5 RTL component tests, 4 Playwright E2E browser journeys, TypeScript strict check, and Next.js static export build) have been executed and passed. Final human governance review is assigned to the project maintainer, Alexsand Farias de Souza.
