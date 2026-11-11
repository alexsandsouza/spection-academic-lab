import {
  Student,
  isValidStudentCode,
  isValidStudentCourse,
  isValidStudentName,
  normalizeStudentCode,
  normalizeStudentName,
} from '../domain/students';

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

export interface StudentStoragePort {
  readonly mode: StorageMode;
  loadStudents(): StorageLoadResult;
  saveStudents(students: ReadonlyArray<Student>): StorageResult;
  clearStudents(): StorageResult;
}

export const STORAGE_KEYS = {
  STUDENTS: 'spection_academic_lab_students_v1',
  CONSENT: 'spection_academic_lab_privacy_consent_v1',
} as const;

export class MemoryStorageAdapter implements StudentStoragePort {
  public readonly mode: StorageMode = 'memory';
  private records: Student[] = [];

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

  public clearStudents(): StorageResult {
    this.records = [];
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

export class LocalStorageAdapter implements StudentStoragePort {
  public readonly mode: StorageMode = 'local';
  private readonly isAuthorizedFn: () => boolean;
  private readonly storageGetter: () => Storage | null;
  private fallbackRecords: Student[] = [];

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

  public clearStudents(): StorageResult {
    this.fallbackRecords = [];
    try {
      const storage = this.storageGetter();
      if (storage) {
        storage.removeItem(STORAGE_KEYS.STUDENTS);
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
      storage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(nextState));
    }
    return { state: nextState };
  } catch {
    return { state: nextState, warning: 'LOCAL_STORAGE_CLEAR_ERROR' };
  }
}
