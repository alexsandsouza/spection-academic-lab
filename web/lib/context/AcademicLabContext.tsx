'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DashboardMetrics,
  Student,
  StudentDomainError,
  StudentInput,
  ValidationFieldErrors,
  calculateDashboardMetrics,
  createStudentRecord,
  deleteStudentRecord,
  mergeDemoStudents,
  updateStudentRecord,
} from '../domain/students';
import {
  LocalStorageAdapter,
  MemoryStorageAdapter,
  PrivacyConsentState,
  StorageMode,
  loadPrivacyConsent,
  revokePrivacyConsentAndPurge,
  savePrivacyConsent,
} from '../storage/storage';
import { DICTIONARIES, Locale } from '../i18n/dictionaries';

export type ThemeMode = 'dark' | 'light';

export type MutationResult = {
  ok: boolean;
  errors?: ValidationFieldErrors;
  student?: Student;
};

type AcademicLabContextValue = {
  students: Student[];
  metrics: DashboardMetrics;
  storageMode: StorageMode;
  consent: PrivacyConsentState;
  storageWarning: string | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  t: (typeof DICTIONARIES)['en'];
  isPrivacyModalOpen: boolean;
  openPrivacyModal: () => void;
  closePrivacyModal: () => void;
  registerStudent: (input: StudentInput) => MutationResult;
  editStudent: (id: string, input: StudentInput) => MutationResult;
  removeStudent: (id: string) => void;
  loadDemoData: () => { addedCount: number };
  clearAllStudents: () => void;
  chooseEssentialOnly: () => void;
  authorizeLocalStorage: () => void;
  revokeLocalStorageConsent: () => void;
};

const AcademicLabContext = createContext<AcademicLabContextValue | null>(null);

export function AcademicLabProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [consent, setConsent] = useState<PrivacyConsentState>({
    decided: false,
    allowLocalStorage: false,
    updatedAt: null,
  });
  const [storageMode, setStorageMode] = useState<StorageMode>('memory');
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  const allowLocalRef = useRef<boolean>(false);
  const memoryAdapterRef = useRef<MemoryStorageAdapter>(new MemoryStorageAdapter());
  const localAdapterRef = useRef<LocalStorageAdapter>(
    new LocalStorageAdapter(() => allowLocalRef.current)
  );

  useEffect(() => {
    const initialConsent = loadPrivacyConsent();
    allowLocalRef.current = initialConsent.allowLocalStorage;
    setConsent(initialConsent);

    if (initialConsent.allowLocalStorage) {
      setStorageMode('local');
      const loaded = localAdapterRef.current.loadStudents();
      setStudents(loaded.students);
      if (loaded.warning) {
        setStorageWarning(loaded.warning);
        if (
          loaded.warning === 'LOCAL_STORAGE_UNAVAILABLE' ||
          loaded.warning === 'LOCAL_STORAGE_READ_ERROR'
        ) {
          setStorageMode('memory');
        }
      }
    } else {
      setStorageMode('memory');
      memoryAdapterRef.current.clearStudents();
      setStudents([]);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const persistCurrentStudents = useCallback((nextStudents: Student[]) => {
    memoryAdapterRef.current.saveStudents(nextStudents);
    if (allowLocalRef.current) {
      const res = localAdapterRef.current.saveStudents(nextStudents);
      if (!res.ok && res.warning) {
        setStorageWarning(res.warning);
        setStorageMode('memory');
      } else {
        setStorageWarning(null);
      }
    }
  }, []);

  const registerStudent = useCallback(
    (input: StudentInput): MutationResult => {
      try {
        const result = createStudentRecord(students, input);
        setStudents(result.students);
        persistCurrentStudents(result.students);
        return { ok: true, student: result.created };
      } catch (err) {
        if (err instanceof StudentDomainError) {
          return { ok: false, errors: err.errors };
        }
        return { ok: false, errors: { code: 'CODE_INVALID_PATTERN' } };
      }
    },
    [students, persistCurrentStudents]
  );

  const editStudent = useCallback(
    (id: string, input: StudentInput): MutationResult => {
      try {
        const result = updateStudentRecord(students, id, input);
        setStudents(result.students);
        persistCurrentStudents(result.students);
        return { ok: true, student: result.updated };
      } catch (err) {
        if (err instanceof StudentDomainError) {
          return { ok: false, errors: err.errors };
        }
        return { ok: false, errors: { code: 'CODE_INVALID_PATTERN' } };
      }
    },
    [students, persistCurrentStudents]
  );

  const removeStudent = useCallback(
    (id: string) => {
      const nextStudents = deleteStudentRecord(students, id);
      setStudents(nextStudents);
      persistCurrentStudents(nextStudents);
    },
    [students, persistCurrentStudents]
  );

  const loadDemoData = useCallback(() => {
    const result = mergeDemoStudents(students);
    setStudents(result.students);
    persistCurrentStudents(result.students);
    return { addedCount: result.addedCount };
  }, [students, persistCurrentStudents]);

  const clearAllStudents = useCallback(() => {
    setStudents([]);
    memoryAdapterRef.current.clearStudents();
    if (allowLocalRef.current) {
      localAdapterRef.current.clearStudents();
    }
  }, []);

  const chooseEssentialOnly = useCallback(() => {
    allowLocalRef.current = false;
    const saved = savePrivacyConsent(false);
    setConsent(saved.state);
    setStorageMode('memory');
    localAdapterRef.current.clearStudents();
    if (saved.warning) {
      setStorageWarning(saved.warning);
    } else {
      setStorageWarning(null);
    }
  }, []);

  const authorizeLocalStorage = useCallback(() => {
    allowLocalRef.current = true;
    const saved = savePrivacyConsent(true);
    setConsent(saved.state);
    if (saved.warning) {
      setStorageWarning(saved.warning);
      setStorageMode('memory');
      return;
    }
    const writeRes = localAdapterRef.current.saveStudents(students);
    if (!writeRes.ok && writeRes.warning) {
      setStorageWarning(writeRes.warning);
      setStorageMode('memory');
    } else {
      setStorageWarning(null);
      setStorageMode('local');
    }
  }, [students]);

  const revokeLocalStorageConsent = useCallback(() => {
    allowLocalRef.current = false;
    const revoked = revokePrivacyConsentAndPurge();
    localAdapterRef.current.clearStudents();
    memoryAdapterRef.current.clearStudents();
    setStudents([]);
    setConsent(revoked.state);
    setStorageMode('memory');
    setStorageWarning(revoked.warning ?? null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const openPrivacyModal = useCallback(() => setIsPrivacyModalOpen(true), []);
  const closePrivacyModal = useCallback(() => setIsPrivacyModalOpen(false), []);

  const metrics = useMemo(() => calculateDashboardMetrics(students), [students]);
  const t = DICTIONARIES[locale] as unknown as (typeof DICTIONARIES)['en'];

  const value = useMemo<AcademicLabContextValue>(
    () => ({
      students,
      metrics,
      storageMode,
      consent,
      storageWarning,
      locale,
      setLocale,
      theme,
      toggleTheme,
      t,
      isPrivacyModalOpen,
      openPrivacyModal,
      closePrivacyModal,
      registerStudent,
      editStudent,
      removeStudent,
      loadDemoData,
      clearAllStudents,
      chooseEssentialOnly,
      authorizeLocalStorage,
      revokeLocalStorageConsent,
    }),
    [
      students,
      metrics,
      storageMode,
      consent,
      storageWarning,
      locale,
      theme,
      toggleTheme,
      t,
      isPrivacyModalOpen,
      openPrivacyModal,
      closePrivacyModal,
      registerStudent,
      editStudent,
      removeStudent,
      loadDemoData,
      clearAllStudents,
      chooseEssentialOnly,
      authorizeLocalStorage,
      revokeLocalStorageConsent,
    ]
  );

  return (
    <AcademicLabContext.Provider value={value}>
      {children}
    </AcademicLabContext.Provider>
  );
}

export function useAcademicLab(): AcademicLabContextValue {
  const ctx = useContext(AcademicLabContext);
  if (!ctx) {
    throw new Error('useAcademicLab must be used inside AcademicLabProvider');
  }
  return ctx;
}
