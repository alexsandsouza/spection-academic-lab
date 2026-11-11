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
  updateStudentRecord,
} from '../domain/students';
import {
  AcademicActivity,
  AcademicDomainError,
  AcademicErrorKey,
  ActivityInput,
  ActivityStatus,
  CourseInput,
  CourseItem,
  Enrollment,
  EnrollmentInput,
  EnrollmentStatus,
  calculateAcademicSuiteSummary,
  createActivityRecord,
  createCourseRecord,
  createEnrollmentRecord,
  deleteCourseRecord,
  mergeDemoAcademicSuite,
  updateActivityRecord,
  updateCourseRecord,
  updateEnrollmentStatus,
} from '../domain/academic';
import {
  AcademicCollections,
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

export type AcademicMutationResult<T> = {
  ok: boolean;
  errorKey?: AcademicErrorKey;
  record?: T;
};

type AcademicLabContextValue = {
  students: Student[];
  courses: CourseItem[];
  enrollments: Enrollment[];
  activities: AcademicActivity[];
  metrics: DashboardMetrics;
  suiteSummary: ReturnType<typeof calculateAcademicSuiteSummary>;
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
  registerCourse: (input: CourseInput) => AcademicMutationResult<CourseItem>;
  editCourse: (id: string, input: CourseInput) => AcademicMutationResult<CourseItem>;
  removeCourse: (id: string) => AcademicMutationResult<null>;
  registerEnrollment: (input: EnrollmentInput) => AcademicMutationResult<Enrollment>;
  changeEnrollmentStatus: (
    id: string,
    status: EnrollmentStatus
  ) => AcademicMutationResult<null>;
  removeEnrollment: (id: string) => void;
  registerActivity: (input: ActivityInput) => AcademicMutationResult<AcademicActivity>;
  editActivityScore: (
    id: string,
    score: number,
    status: ActivityStatus
  ) => AcademicMutationResult<null>;
  removeActivity: (id: string) => void;
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
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activities, setActivities] = useState<AcademicActivity[]>([]);

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
      const loadedSuite = localAdapterRef.current.loadAcademicCollections();
      setStudents(loaded.students);
      setCourses(loadedSuite.courses);
      setEnrollments(loadedSuite.enrollments);
      setActivities(loadedSuite.activities);
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
      setCourses([]);
      setEnrollments([]);
      setActivities([]);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const persistWorkspace = useCallback(
    (
      nextStudents: Student[],
      nextSuite: AcademicCollections
    ) => {
      memoryAdapterRef.current.saveStudents(nextStudents);
      memoryAdapterRef.current.saveAcademicCollections(nextSuite);
      if (allowLocalRef.current) {
        const resStu = localAdapterRef.current.saveStudents(nextStudents);
        const resSuite = localAdapterRef.current.saveAcademicCollections(nextSuite);
        const warn = resStu.warning || resSuite.warning;
        if ((!resStu.ok || !resSuite.ok) && warn) {
          setStorageWarning(warn);
          setStorageMode('memory');
        } else {
          setStorageWarning(null);
        }
      }
    },
    []
  );

  const registerStudent = useCallback(
    (input: StudentInput): MutationResult => {
      try {
        const result = createStudentRecord(students, input);
        setStudents(result.students);
        persistWorkspace(result.students, { courses, enrollments, activities });
        return { ok: true, student: result.created };
      } catch (err) {
        if (err instanceof StudentDomainError) {
          return { ok: false, errors: err.errors };
        }
        return { ok: false, errors: { code: 'CODE_INVALID_PATTERN' } };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const editStudent = useCallback(
    (id: string, input: StudentInput): MutationResult => {
      try {
        const result = updateStudentRecord(students, id, input);
        const nextEnrollments = enrollments.map((e) =>
          e.studentId === id
            ? {
                ...e,
                studentCode: result.updated.code,
                studentName: result.updated.name,
              }
            : e
        );
        const nextActivities = activities.map((a) => {
          const enr = nextEnrollments.find((e) => e.id === a.enrollmentId);
          return enr
            ? {
                ...a,
                studentCode: enr.studentCode,
                studentName: enr.studentName,
              }
            : a;
        });
        setStudents(result.students);
        setEnrollments(nextEnrollments);
        setActivities(nextActivities);
        persistWorkspace(result.students, {
          courses,
          enrollments: nextEnrollments,
          activities: nextActivities,
        });
        return { ok: true, student: result.updated };
      } catch (err) {
        if (err instanceof StudentDomainError) {
          return { ok: false, errors: err.errors };
        }
        return { ok: false, errors: { code: 'CODE_INVALID_PATTERN' } };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const removeStudent = useCallback(
    (id: string) => {
      const nextStudents = deleteStudentRecord(students, id);
      const removedEnrollmentIds = new Set(
        enrollments.filter((e) => e.studentId === id).map((e) => e.id)
      );
      const nextEnrollments = enrollments.filter((e) => e.studentId !== id);
      const nextActivities = activities.filter(
        (a) => !removedEnrollmentIds.has(a.enrollmentId)
      );
      setStudents(nextStudents);
      setEnrollments(nextEnrollments);
      setActivities(nextActivities);
      persistWorkspace(nextStudents, {
        courses,
        enrollments: nextEnrollments,
        activities: nextActivities,
      });
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const registerCourse = useCallback(
    (input: CourseInput): AcademicMutationResult<CourseItem> => {
      try {
        const result = createCourseRecord(courses, input);
        setCourses(result.courses);
        persistWorkspace(students, {
          courses: result.courses,
          enrollments,
          activities,
        });
        return { ok: true, record: result.created };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'COURSE_CODE_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const editCourse = useCallback(
    (id: string, input: CourseInput): AcademicMutationResult<CourseItem> => {
      try {
        const result = updateCourseRecord(courses, id, input);
        const nextEnrollments = enrollments.map((e) =>
          e.courseId === id
            ? {
                ...e,
                courseCode: result.updated.code,
                courseTitle: result.updated.title,
              }
            : e
        );
        const nextActivities = activities.map((a) => {
          const enr = nextEnrollments.find((e) => e.id === a.enrollmentId);
          return enr
            ? {
                ...a,
                courseCode: enr.courseCode,
                courseTitle: enr.courseTitle,
              }
            : a;
        });
        setCourses(result.courses);
        setEnrollments(nextEnrollments);
        setActivities(nextActivities);
        persistWorkspace(students, {
          courses: result.courses,
          enrollments: nextEnrollments,
          activities: nextActivities,
        });
        return { ok: true, record: result.updated };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'COURSE_CODE_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const removeCourse = useCallback(
    (id: string): AcademicMutationResult<null> => {
      try {
        const nextCourses = deleteCourseRecord(courses, enrollments, id);
        setCourses(nextCourses);
        persistWorkspace(students, {
          courses: nextCourses,
          enrollments,
          activities,
        });
        return { ok: true };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'COURSE_HAS_ENROLLMENTS' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const registerEnrollment = useCallback(
    (input: EnrollmentInput): AcademicMutationResult<Enrollment> => {
      try {
        const result = createEnrollmentRecord(
          enrollments,
          students,
          courses,
          input
        );
        setEnrollments(result.enrollments);
        persistWorkspace(students, {
          courses,
          enrollments: result.enrollments,
          activities,
        });
        return { ok: true, record: result.created };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'ENROLLMENT_CODE_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const changeEnrollmentStatus = useCallback(
    (id: string, status: EnrollmentStatus): AcademicMutationResult<null> => {
      try {
        const nextEnrollments = updateEnrollmentStatus(enrollments, id, status);
        setEnrollments(nextEnrollments);
        persistWorkspace(students, {
          courses,
          enrollments: nextEnrollments,
          activities,
        });
        return { ok: true };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'ENROLLMENT_STATUS_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const removeEnrollment = useCallback(
    (id: string) => {
      const nextEnrollments = enrollments.filter((e) => e.id !== id);
      const nextActivities = activities.filter((a) => a.enrollmentId !== id);
      setEnrollments(nextEnrollments);
      setActivities(nextActivities);
      persistWorkspace(students, {
        courses,
        enrollments: nextEnrollments,
        activities: nextActivities,
      });
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const registerActivity = useCallback(
    (input: ActivityInput): AcademicMutationResult<AcademicActivity> => {
      try {
        const result = createActivityRecord(activities, enrollments, input);
        setActivities(result.activities);
        persistWorkspace(students, {
          courses,
          enrollments,
          activities: result.activities,
        });
        return { ok: true, record: result.created };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'ACTIVITY_CODE_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const editActivityScore = useCallback(
    (
      id: string,
      score: number,
      status: ActivityStatus
    ): AcademicMutationResult<null> => {
      try {
        const nextActivities = updateActivityRecord(
          activities,
          id,
          score,
          status
        );
        setActivities(nextActivities);
        persistWorkspace(students, {
          courses,
          enrollments,
          activities: nextActivities,
        });
        return { ok: true };
      } catch (err) {
        if (err instanceof AcademicDomainError) {
          return { ok: false, errorKey: err.errorKey };
        }
        return { ok: false, errorKey: 'ACTIVITY_SCORE_INVALID' };
      }
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const removeActivity = useCallback(
    (id: string) => {
      const nextActivities = activities.filter((a) => a.id !== id);
      setActivities(nextActivities);
      persistWorkspace(students, {
        courses,
        enrollments,
        activities: nextActivities,
      });
    },
    [students, courses, enrollments, activities, persistWorkspace]
  );

  const loadDemoData = useCallback(() => {
    const prevCount = students.length;
    const merged = mergeDemoAcademicSuite(
      students,
      courses,
      enrollments,
      activities
    );
    setStudents(merged.students);
    setCourses(merged.courses);
    setEnrollments(merged.enrollments);
    setActivities(merged.activities);
    persistWorkspace(merged.students, {
      courses: merged.courses,
      enrollments: merged.enrollments,
      activities: merged.activities,
    });
    return { addedCount: merged.students.length - prevCount };
  }, [students, courses, enrollments, activities, persistWorkspace]);

  const clearAllStudents = useCallback(() => {
    setStudents([]);
    setCourses([]);
    setEnrollments([]);
    setActivities([]);
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
    const writeStu = localAdapterRef.current.saveStudents(students);
    const writeSuite = localAdapterRef.current.saveAcademicCollections({
      courses,
      enrollments,
      activities,
    });
    const warn = writeStu.warning || writeSuite.warning;
    if ((!writeStu.ok || !writeSuite.ok) && warn) {
      setStorageWarning(warn);
      setStorageMode('memory');
    } else {
      setStorageWarning(null);
      setStorageMode('local');
    }
  }, [students, courses, enrollments, activities]);

  const revokeLocalStorageConsent = useCallback(() => {
    allowLocalRef.current = false;
    const revoked = revokePrivacyConsentAndPurge();
    localAdapterRef.current.clearStudents();
    memoryAdapterRef.current.clearStudents();
    setStudents([]);
    setCourses([]);
    setEnrollments([]);
    setActivities([]);
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
  const suiteSummary = useMemo(
    () => calculateAcademicSuiteSummary(courses, enrollments, activities),
    [courses, enrollments, activities]
  );
  const t = DICTIONARIES[locale] as unknown as (typeof DICTIONARIES)['en'];

  const value = useMemo<AcademicLabContextValue>(
    () => ({
      students,
      courses,
      enrollments,
      activities,
      metrics,
      suiteSummary,
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
      registerCourse,
      editCourse,
      removeCourse,
      registerEnrollment,
      changeEnrollmentStatus,
      removeEnrollment,
      registerActivity,
      editActivityScore,
      removeActivity,
      loadDemoData,
      clearAllStudents,
      chooseEssentialOnly,
      authorizeLocalStorage,
      revokeLocalStorageConsent,
    }),
    [
      students,
      courses,
      enrollments,
      activities,
      metrics,
      suiteSummary,
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
      registerCourse,
      editCourse,
      removeCourse,
      registerEnrollment,
      changeEnrollmentStatus,
      removeEnrollment,
      registerActivity,
      editActivityScore,
      removeActivity,
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
