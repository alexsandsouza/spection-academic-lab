# Low-Level Design (LLD) - SPECTION Academic Lab

## Document Control

- **Project**: SPECTION Academic Lab (`v0.5.0`)
- **Maintainer**: Alexsand Farias de Souza
- **Related Documents**: [PRD](prd.md), [HLD](hld.md), [Traceability](traceability.md)

---

## 1. Python Reference LLD (`students.py`)

`Registry(db=':memory:')` initializes four SQLite tables with parameterized SQL:
- `students(code TEXT PRIMARY KEY, name TEXT NOT NULL)`
- `courses(code TEXT PRIMARY KEY, title TEXT NOT NULL, workload INTEGER NOT NULL)`
- `enrollments(student_code TEXT NOT NULL, course_code TEXT NOT NULL, term TEXT NOT NULL, PRIMARY KEY (student_code, course_code, term))`
- `activities(code TEXT PRIMARY KEY, student_code TEXT NOT NULL, course_code TEXT NOT NULL, title TEXT NOT NULL, score REAL NOT NULL)`

### Public Methods
- `add(code, name)` & `list()`: Original `FEAT-001` methods preserved with 100% signature and return compatibility.
- `add_course(code, title, workload=60)` & `list_courses()`: Validates `^COURSE-[0-9]{2}$`, `3 <= len(title) <= 80`, and `15 <= int(workload) <= 240`.
- `enroll(student_code, course_code, term='2026.1')` & `list_enrollments()`: Verifies student and course existence, validates `^20[2-9][0-9]\.[12]$` term, and prevents duplicate enrollments.
- `add_activity(code, student_code, course_code, title, score)` & `list_activities()`: Validates `^ACT-[0-9]{4}$`, verifies existing enrollment for `(student_code, course_code)`, validates `3 <= len(title) <= 80` and `0 <= float(score) <= 100`.
- `close()`: Releases database connection.

---

## 2. Web TypeScript Domain Contracts (`web/lib/domain/`)

### 2.1 Student Contract (`web/lib/domain/students.ts`)
- `Student`: `{ id, code, name, course, createdAt, updatedAt }`
- Pattern: `^DEMO-[0-9]{4}$`, name `2..80` chars, course in `DEMO_COURSES`.

### 2.2 Academic Suite Contracts (`web/lib/domain/academic.ts`)

```typescript
export type CourseItem = {
  id: string;
  code: string;          // ^COURSE-[0-9]{2}$ (e.g., COURSE-01)
  title: string;         // 3..80 chars
  program: string;       // Must belong to DEMO_COURSES
  workloadHours: number; // Integer 15..240
  createdAt: string;
  updatedAt: string;
};

export type AcademicTerm = '2026.1' | '2026.2' | '2027.1';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED';

export type Enrollment = {
  id: string;
  code: string;          // ^ENR-[0-9]{4}$ (e.g., ENR-0001)
  studentId: string;
  studentCode: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  term: AcademicTerm;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type ActivityCategory = 'EXAM' | 'PROJECT' | 'LAB' | 'QUIZ';
export type ActivityStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

export type AcademicActivity = {
  id: string;
  code: string;          // ^ACT-[0-9]{4}$ (e.g., ACT-0001)
  enrollmentId: string;
  studentCode: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  title: string;         // 3..80 chars
  category: ActivityCategory;
  score: number;         // 0..100
  maxScore: number;      // 100
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
};
```

### 2.3 Validation & Business Functions (`web/lib/domain/academic.ts`)
- `validateCourseInput`, `createCourseRecord`, `updateCourseRecord`, `deleteCourseRecord` (blocks deletion if referenced by any enrollment: `COURSE_HAS_ENROLLMENTS`).
- `validateEnrollmentInput`, `createEnrollmentRecord`, `updateEnrollmentStatus`, `deleteEnrollmentRecord` (cascades deletion to activities referencing that enrollment).
- `validateActivityInput`, `createActivityRecord`, `updateActivityRecord`, `deleteActivityRecord`.
- `mergeDemoAcademicSuite`: Idempotently seeds demonstration students (`6`), courses (`6`), enrollments (`6`), and activities (`6`) without duplicating existing records.
- `exportCoursesToCsv`, `exportEnrollmentsToCsv`, `exportActivitiesToCsv`: Uses `sanitizeCsvCell` to escape quotes and neutralize formula prefixes (`=`, `+`, `-`, `@`, `\t`, `\r`).

---

## 3. Storage & Privacy Persistence (`web/lib/storage/storage.ts`)

When `consent.allowLocalStorage === true`, `LocalStorageAdapter` persists and validates each collection under versioned keys:
- `spection_academic_lab_students_v1`
- `spection_academic_lab_courses_v1`
- `spection_academic_lab_enrollments_v1`
- `spection_academic_lab_activities_v1`

When `consent.allowLocalStorage === false` (default on first visit or after revocation), all four keys are removed from `window.localStorage` and kept exclusively in `MemoryStorageAdapter`.


## FEAT-005 - Academic Intelligence LLD

- AttendanceSession: id, courseId, term, date, title.
- AttendanceRecord: sessionId + enrollmentId unique composite, present boolean. Correction replaces one record.
- GradeWeights: integer EXAM/PROJECT/LAB/QUIZ percentages that sum to 100.
- weightedGrade: returns null unless every positive-weight category has at least one GRADED activity. Scores are normalized to existing 0-100 scale; result rounds to one decimal place.
- attendanceRate: returns null for zero eligible sessions, otherwise counts present records / eligible sessions as a percentage.
- transcript: derived read projection of existing enrollments and activities plus sessions/records; no official academic validity.
- AcademicProgressContext: context state, browser memory by default, localStorage after consent. Existing AcademicLabContext remains source of truth for enrollment and activity relations.
- Privacy purge: STORAGE_KEYS.PROGRESS is deleted by savePrivacyConsent(false), revokePrivacyConsentAndPurge() and clearStudents().
