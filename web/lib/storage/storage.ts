import {
  Student,
  isValidStudentCode,
  isValidStudentCourse,
  isValidStudentName,
  normalizeStudentCode,
  normalizeStudentName,
} from '../domain/students';
import {
  AcademicActivity,
  CourseItem,
  Enrollment,
  isValidActivityCode,
  isValidCourseCode,
  isValidEnrollmentCode,
} from '../domain/academic';

export type StorageMode = 'memory' | 'local';

export type PrivacyConsentState = {
  decided: boolean;
  allowLocalStorage: boolean;
  updatedAt: string | null;
};

export type StorageResult = {
  ok: boolean;
  warning?: string;
};

export type StorageLoadResult = {
  students: Student[];
  warning?: string;
};

export type AcademicCollections = {
  courses: CourseItem[];
  enrollments: Enrollment[];
  activities: AcademicActivity[];
};

export interface StudentStoragePort {
  readonly mode: StorageMode;
  loadStudents(): StorageLoadResult;
  saveStudents(students: ReadonlyArray<Student>): StorageResult;
  clearStudents(): StorageResult;
}

export const STORAGE_KEYS = {
  STUDENTS: 'spection_academic_lab_students_v1',
  COURSES: 'spection_academic_lab_courses_v1',
  ENROLLMENTS: 'spection_academic_lab_enrollments_v1',
  ACTIVITIES: 'spection_academic_lab_activities_v1',
  PROGRESS: 'spection_academic_lab_progress_v1',
  CONSENT: 'spection_academic_lab_privacy_consent_v1',
} as const;

export class MemoryStorageAdapter implements StudentStoragePort {
  public readonly mode: StorageMode = 'memory';
  private records: Student[] = [];
  private courses: CourseItem[] = [];
  private enrollments: Enrollment[] = [];
  private activities: AcademicActivity[] = [];

  constructor(initialRecords: ReadonlyArray<Student> = []) {
    this.records = [...initialRecords];
  }

  public loadStudents(): StorageLoadResult {
    return { students: [...this.records] };
  }

  public saveStudents(students: ReadonlyArray<Student>): StorageResult {
    this.records = [...students];
    return { ok: true };
  }

  public loadAcademicCollections(): AcademicCollections {
    return {
      courses: [...this.courses],
      enrollments: [...this.enrollments],
      activities: [...this.activities],
    };
  }

  public saveAcademicCollections(data: AcademicCollections): StorageResult {
    this.courses = [...data.courses];
    this.enrollments = [...data.enrollments];
    this.activities = [...data.activities];
    return { ok: true };
  }

  public clearStudents(): StorageResult {
    this.records = [];
    this.courses = [];
    this.enrollments = [];
    this.activities = [];
    return { ok: true };
  }
}

function isValidStoredStudent(candidate: unknown): candidate is Student {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }
  const obj = candidate as Record<string, unknown>;
  if (
    typeof obj.id !== 'string' ||
    typeof obj.code !== 'string' ||
    typeof obj.name !== 'string' ||
    typeof obj.course !== 'string' ||
    typeof obj.createdAt !== 'string' ||
    typeof obj.updatedAt !== 'string'
  ) {
    return false;
  }

  const code = normalizeStudentCode(obj.code);
  const name = normalizeStudentName(obj.name);
  return (
    isValidStudentCode(code) &&
    isValidStudentName(name) &&
    isValidStudentCourse(obj.course)
  );
}

function isValidStoredCourse(candidate: unknown): candidate is CourseItem {
  if (!candidate || typeof candidate !== 'object') return false;
  const obj = candidate as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    isValidCourseCode(obj.code) &&
    typeof obj.title === 'string' &&
    typeof obj.program === 'string' &&
    typeof obj.workloadHours === 'number'
  );
}

function isValidStoredEnrollment(candidate: unknown): candidate is Enrollment {
  if (!candidate || typeof candidate !== 'object') return false;
  const obj = candidate as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    isValidEnrollmentCode(obj.code) &&
    typeof obj.studentId === 'string' &&
    typeof obj.courseId === 'string' &&
    typeof obj.term === 'string' &&
    typeof obj.status === 'string'
  );
}

function isValidStoredActivity(candidate: unknown): candidate is AcademicActivity {
  if (!candidate || typeof candidate !== 'object') return false;
  const obj = candidate as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    isValidActivityCode(obj.code) &&
    typeof obj.enrollmentId === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.score === 'number'
  );
}

export class LocalStorageAdapter implements StudentStoragePort {
  public readonly mode: StorageMode = 'local';
  private readonly isAuthorizedFn: () => boolean;
  private readonly storageGetter: () => Storage | null;
  private fallbackRecords: Student[] = [];
  private fallbackCollections: AcademicCollections = {
    courses: [],
    enrollments: [],
    activities: [],
  };

  constructor(
    isAuthorizedFn: () => boolean,
    storageGetter: () => Storage | null = () =>
      typeof window !== 'undefined' ? window.localStorage : null
  ) {
    this.isAuthorizedFn = isAuthorizedFn;
    this.storageGetter = storageGetter;
  }

  public loadStudents(): StorageLoadResult {
    if (!this.isAuthorizedFn()) {
      return {
        students: [],
        warning: 'LOCAL_STORAGE_NOT_AUTHORIZED',
      };
    }

    try {
      const storage = this.storageGetter();
      if (!storage) {
        return {
          students: [...this.fallbackRecords],
          warning: 'LOCAL_STORAGE_UNAVAILABLE',
        };
      }

      const raw = storage.getItem(STORAGE_KEYS.STUDENTS);
      if (!raw) {
        return { students: [] };
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return {
          students: [],
          warning: 'LOCAL_STORAGE_CORRUPTED',
        };
      }

      const validStudents = parsed.filter(isValidStoredStudent);
      if (validStudents.length !== parsed.length) {
        return {
          students: validStudents,
          warning: 'LOCAL_STORAGE_PARTIAL_CORRUPTION',
        };
      }

      this.fallbackRecords = [...validStudents];
      return { students: validStudents };
    } catch {
      return {
        students: [...this.fallbackRecords],
        warning: 'LOCAL_STORAGE_READ_ERROR',
      };
    }
  }

  public saveStudents(students: ReadonlyArray<Student>): StorageResult {
    if (!this.isAuthorizedFn()) {
      return {
        ok: false,
        warning: 'LOCAL_STORAGE_NOT_AUTHORIZED',
      };
    }

    this.fallbackRecords = [...students];

    try {
      const storage = this.storageGetter();
      if (!storage) {
        return {
          ok: false,
          warning: 'LOCAL_STORAGE_UNAVAILABLE',
        };
      }

      storage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return { ok: true };
    } catch {
      return {
        ok: false,
        warning: 'LOCAL_STORAGE_WRITE_ERROR',
      };
    }
  }

  public loadAcademicCollections(): AcademicCollections {
    if (!this.isAuthorizedFn()) {
      return { courses: [], enrollments: [], activities: [] };
    }
    try {
      const storage = this.storageGetter();
      if (!storage) {
        return { ...this.fallbackCollections };
      }
      const rawCourses = storage.getItem(STORAGE_KEYS.COURSES);
      const rawEnrollments = storage.getItem(STORAGE_KEYS.ENROLLMENTS);
      const rawActivities = storage.getItem(STORAGE_KEYS.ACTIVITIES);

      const parsedCourses = rawCourses ? JSON.parse(rawCourses) : [];
      const parsedEnrollments = rawEnrollments ? JSON.parse(rawEnrollments) : [];
      const parsedActivities = rawActivities ? JSON.parse(rawActivities) : [];

      const courses = Array.isArray(parsedCourses)
        ? parsedCourses.filter(isValidStoredCourse)
        : [];
      const enrollments = Array.isArray(parsedEnrollments)
        ? parsedEnrollments.filter(isValidStoredEnrollment)
        : [];
      const activities = Array.isArray(parsedActivities)
        ? parsedActivities.filter(isValidStoredActivity)
        : [];

      this.fallbackCollections = { courses, enrollments, activities };
      return { courses, enrollments, activities };
    } catch {
      return { ...this.fallbackCollections };
    }
  }

  public saveAcademicCollections(data: AcademicCollections): StorageResult {
    if (!this.isAuthorizedFn()) {
      return { ok: false, warning: 'LOCAL_STORAGE_NOT_AUTHORIZED' };
    }
    this.fallbackCollections = {
      courses: [...data.courses],
      enrollments: [...data.enrollments],
      activities: [...data.activities],
    };
    try {
      const storage = this.storageGetter();
      if (!storage) {
        return { ok: false, warning: 'LOCAL_STORAGE_UNAVAILABLE' };
      }
      storage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
      storage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(data.enrollments));
      storage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
      return { ok: true };
    } catch {
      return { ok: false, warning: 'LOCAL_STORAGE_WRITE_ERROR' };
    }
  }

  public clearStudents(): StorageResult {
    this.fallbackRecords = [];
    this.fallbackCollections = { courses: [], enrollments: [], activities: [] };
    try {
      const storage = this.storageGetter();
      if (storage) {
        storage.removeItem(STORAGE_KEYS.STUDENTS);
        storage.removeItem(STORAGE_KEYS.COURSES);
        storage.removeItem(STORAGE_KEYS.ENROLLMENTS);
        storage.removeItem(STORAGE_KEYS.ACTIVITIES);
        storage.removeItem(STORAGE_KEYS.PROGRESS);
      }
      return { ok: true };
    } catch {
      return {
        ok: false,
        warning: 'LOCAL_STORAGE_CLEAR_ERROR',
      };
    }
  }
}

export function loadPrivacyConsent(
  storageGetter: () => Storage | null = () =>
    typeof window !== 'undefined' ? window.localStorage : null
): PrivacyConsentState {
  try {
    const storage = storageGetter();
    if (!storage) {
      return { decided: false, allowLocalStorage: false, updatedAt: null };
    }

    const raw = storage.getItem(STORAGE_KEYS.CONSENT);
    if (!raw) {
      return { decided: false, allowLocalStorage: false, updatedAt: null };
    }

    const parsed = JSON.parse(raw) as Partial<PrivacyConsentState>;
    if (
      typeof parsed.decided === 'boolean' &&
      typeof parsed.allowLocalStorage === 'boolean'
    ) {
      return {
        decided: parsed.decided,
        allowLocalStorage: parsed.allowLocalStorage,
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
      };
    }
    return { decided: false, allowLocalStorage: false, updatedAt: null };
  } catch {
    return { decided: false, allowLocalStorage: false, updatedAt: null };
  }
}

export function savePrivacyConsent(
  allowLocalStorage: boolean,
  storageGetter: () => Storage | null = () =>
    typeof window !== 'undefined' ? window.localStorage : null
): { state: PrivacyConsentState; warning?: string } {
  const nextState: PrivacyConsentState = {
    decided: true,
    allowLocalStorage,
    updatedAt: new Date().toISOString(),
  };

  try {
    const storage = storageGetter();
    if (!storage) {
      return { state: nextState, warning: 'LOCAL_STORAGE_UNAVAILABLE' };
    }

    if (!allowLocalStorage) {
      storage.removeItem(STORAGE_KEYS.STUDENTS);
      storage.removeItem(STORAGE_KEYS.COURSES);
      storage.removeItem(STORAGE_KEYS.ENROLLMENTS);
      storage.removeItem(STORAGE_KEYS.ACTIVITIES);
        storage.removeItem(STORAGE_KEYS.PROGRESS);
    }
    storage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(nextState));
    return { state: nextState };
  } catch {
    return { state: nextState, warning: 'LOCAL_STORAGE_WRITE_ERROR' };
  }
}

export function revokePrivacyConsentAndPurge(
  storageGetter: () => Storage | null = () =>
    typeof window !== 'undefined' ? window.localStorage : null
): { state: PrivacyConsentState; warning?: string } {
  const nextState: PrivacyConsentState = {
    decided: true,
    allowLocalStorage: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    const storage = storageGetter();
    if (storage) {
      storage.removeItem(STORAGE_KEYS.STUDENTS);
      storage.removeItem(STORAGE_KEYS.COURSES);
      storage.removeItem(STORAGE_KEYS.ENROLLMENTS);
      storage.removeItem(STORAGE_KEYS.ACTIVITIES);
        storage.removeItem(STORAGE_KEYS.PROGRESS);
      storage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(nextState));
    }
    return { state: nextState };
  } catch {
    return { state: nextState, warning: 'LOCAL_STORAGE_CLEAR_ERROR' };
  }
}
