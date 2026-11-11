# Low-Level Design (LLD) - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab
- **Maintainer**: Alexsand Farias de Souza
- **Related Documents**: [PRD](prd.md), [HLD](hld.md), [Traceability](traceability.md)

---

## 1. Historical Python LLD (FEAT-001)

Preserved in `students.py`:
- `Registry(db=':memory:')`: Creates table `students(code TEXT PRIMARY KEY, name TEXT NOT NULL)`.
- `add(code, name)`: Trims input, uppercases `code`, validates `DEMO-[0-9]{4}` pattern and `2 <= len(name) <= 80`; executes parameterized `INSERT` inside a transaction; raises `ValueError` on invalid input or duplicate code.
- `list()`: Executes `SELECT code, name FROM students ORDER BY code` and returns a list of tuples.
- `close()`: Releases the SQLite connection.

---

## 2. Web Application Directory Structure (`web/`)

```text
web/
├── app/
│   ├── layout.tsx          # Root layout, metadata, AppProviders, AppShell
│   ├── page.tsx            # Academic Dashboard view
│   ├── students/
│   │   └── page.tsx        # FEAT-WEB-001 Student Registry CRUD view
│   ├── documentation/
│   │   └── page.tsx        # SPECTION Engineering Journey & SDD Documentation
│   ├── roadmap/
│   │   └── page.tsx        # Product & Engineering Roadmap view
│   ├── about/
│   │   └── page.tsx        # About Academic Lab, Legal (Privacy Policy & Terms)
│   └── globals.css         # Design system tokens (Light/Dark) & utility styles
├── components/
│   ├── AppShell.tsx        # Sidebar, Header, Breadcrumbs, Footer, Modals
│   ├── BrandLogo.tsx       # Custom SVG vector brand for Academic Lab
│   ├── PrivacyBanner.tsx   # First-visit LGPD/GDPR notice & Preferences modal
│   ├── ConfirmDialog.tsx   # Accessible confirmation modal for delete/clear
│   └── StudentForm.tsx     # Reusable create/edit student form with validation
├── lib/
│   ├── domain/
│   │   └── students.ts     # Pure TypeScript domain models, validation, CRUD, CSV, metrics
│   ├── storage/
│   │   └── storage.ts      # MemoryStorageAdapter, LocalStorageAdapter, PrivacyConsent
│   ├── context/
│   │   └── AcademicLabContext.tsx # React state orchestration, theme & i18n
│   ├── data/
│   │   └── engineering.ts  # Verifiable Engineering Journey & Traceability metadata
│   └── i18n/
│       └── dictionaries.ts # English (EN) and Brazilian Portuguese (PT-BR) copy
├── public/
│   ├── brand-banner.svg    # Vector banner for README and portal preview
│   └── favicon.svg         # Vector favicon
└── tests/
    ├── unit/
    │   ├── students.test.ts
    │   └── storage.test.ts
    ├── components/
    │   └── academic-lab.test.tsx
    └── e2e/
        └── academic-lab.spec.ts
```

---

## 3. TypeScript Domain Contracts (`web/lib/domain/students.ts`)

### 3.1 Core Models

```typescript
export const DEMO_COURSES = [
  'Software Engineering',
  'Computer Science',
  'Information Systems',
  'Data Science & AI',
  'Cybersecurity',
  'Computational Mathematics',
] as const;

export type DemoCourse = (typeof DEMO_COURSES)[number];

export type Student = {
  id: string;
  code: string;
  name: string;
  course: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentInput = {
  code: string;
  name: string;
  course: string;
};

export type ValidationFieldErrors = {
  code?: string;
  name?: string;
  course?: string;
};

export type ValidationResult = {
  valid: boolean;
  normalized?: StudentInput;
  errors: ValidationFieldErrors;
};

export type SortField = 'code' | 'name' | 'course' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export type DashboardMetrics = {
  totalStudents: number;
  totalCoursesRepresented: number;
  latestStudent: Student | null;
  courseDistribution: Array<{
    course: string;
    count: number;
    percentage: number;
  }>;
};
```

### 3.2 Domain Functions & Business Logic

1. `normalizeStudentCode(rawCode: string): string`
   - Trims leading/trailing whitespace and converts characters to uppercase (`rawCode.trim().toUpperCase()`).
2. ` normalizeStudentName(rawName: string): string`
   - Trims leading/trailing whitespace and collapses internal multiple spaces to a single space.
3. `validateStudentInput(input: StudentInput, existingStudents: Student[], editingId?: string): ValidationResult`
   - Normalizes `code` and `name`.
   - Checks `^DEMO-[0-9]{4}$` on `code` (`RF-WEB-002`).
   - Checks `2 <= name.length <= 80` (`RF-WEB-003`).
   - Checks `DEMO_COURSES.includes(course)` (`RF-WEB-004`).
   - Checks uniqueness of normalized `code` against `existingStudents`, ignoring the record whose `id === editingId` during edits (`RF-WEB-005`).
4. `createStudentRecord(existing: Student[], input: StudentInput, now?: Date): { students: Student[]; created: Student }`
   - Invokes `validateStudentInput`. Throws `StudentValidationError` if invalid.
   - Generates a deterministic/UUID identifier, sets `createdAt` and `updatedAt` ISO timestamps, appends the record, and returns the sorted list.
5. `updateStudentRecord(existing: Student[], id: string, input: StudentInput, now?: Date): { students: Student[]; updated: Student }`
   - Locates target record by `id` (throws error if not found).
   - Validates input with `editingId = id`.
   - Updates `code`, `name`, `course`, and `updatedAt`, preserving `createdAt` (`RF-WEB-009`).
6. `deleteStudentRecord(existing: Student[], id: string): Student[]`
   - Removes the student matching `id` (`RF-WEB-010`).
7. `filterAndSortStudents(students: Student[], query: string, courseFilter: string, sortField: SortField, sortDirection: SortDirection): Student[]`
   - Filters by case-insensitive substring on `code`, `name`, or `course` (`RF-WEB-007`) and optional exact `courseFilter`.
   - Sorts deterministically by `sortField` and `sortDirection` (`RF-WEB-008`), using `code` as tie-breaker.
8. `mergeDemoStudents(existing: Student[], now?: Date): { students: Student[]; addedCount: number }`
   - Iterates over the curated `DEMO_SEED_STUDENTS` dataset and inserts only records whose normalized `code` is not already present (`RF-WEB-011`).
9. `calculateDashboardMetrics(students: Student[]): DashboardMetrics`
   - Computes `totalStudents`, count of distinct courses with at least 1 student, most recently created/updated record (`latestStudent`), and per-course counts and percentages (`RF-WEB-014`).
10. `exportStudentsToCsv(students: Student[]): string`
    - Generates header `id,code,name,course,createdAt,updatedAt`.
    - Sanitizes each cell: if the value or trimmed value starts with `=`, `+`, `-`, `@`, `\t`, or `\r`, prefixes with `'`. Wraps fields in double quotes and escapes internal `"` as `""` (`RF-WEB-013`).

---

## 4. Storage & Privacy Contracts (`web/lib/storage/storage.ts`)

```typescript
export type StorageMode = 'memory' | 'local';

export type PrivacyConsentState = {
  decided: boolean;
  allowLocalStorage: boolean;
  updatedAt: string | null;
};

export interface StudentStoragePort {
  readonly mode: StorageMode;
  loadStudents(): { students: Student[]; warning?: string };
  saveStudents(students: Student[]): { ok: boolean; warning?: string };
  clearStudents(): { ok: boolean; warning?: string };
}
```

### Error Handling & Persistence Rules
- **Blocked Persistence Without Consent**: `LocalStorageAdapter.saveStudents` verifies that `allowLocalStorage` is active before writing. If not authorized, it refuses to write to `window.localStorage` and returns `{ ok: false, warning: '...' }`.
- **Storage Failure Resilience (`RNF-WEB-006`)**: If `window.localStorage.getItem`, `setItem`, or `removeItem` throws `QuotaExceededError` or `SecurityError` (e.g., private browsing restriction), the controller catches the exception, logs a structured warning message in state, and continues operating in memory mode without crashing the UI.

---

## 5. Testing Strategy

1. **Python Baseline Tests (`tests/test_students.py`)**:
   - Executed via `python -m unittest discover -s tests -v`. Verifies `RF-001` through `RNF-001`.
2. **Unit Tests (`web/tests/unit/`)**:
   - Executed via Vitest (`npm test`). Covers code normalization, input validation bounds, duplicate prevention, CRUD operations, search, sorting, demo seed idempotency, dashboard metrics calculation, CSV export formula sanitization, consent enforcement, and `localStorage` exception handling.
3. **Component Tests (`web/tests/components/`)**:
   - Executed via Vitest + React Testing Library (`jsdom`). Covers valid/invalid form submissions, validation error alerts, table rendering, empty states, delete confirmation dialog, live dashboard indicator updates, and privacy consent controls.
4. **End-to-End Browser Tests (`web/tests/e2e/`)**:
   - Executed via Playwright against the production static build. Verifies full user journeys: visiting the app, rejecting optional storage, creating/searching/editing/deleting a student, duplicate error handling, authorizing local storage across page reloads, revoking consent and verifying `localStorage` erasure, and mobile navigation menu interaction.
