import {
  DEMO_COURSES,
  Student,
  mergeDemoStudents,
  normalizeStudentName,
  sanitizeCsvCell,
} from './students';

export const ACADEMIC_TERMS = ['2026.1', '2026.2', '2027.1'] as const;
export type AcademicTerm = (typeof ACADEMIC_TERMS)[number];

export const ENROLLMENT_STATUSES = ['ACTIVE', 'COMPLETED', 'DROPPED'] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export const ACTIVITY_CATEGORIES = ['EXAM', 'PROJECT', 'LAB', 'QUIZ'] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const ACTIVITY_STATUSES = ['PENDING', 'SUBMITTED', 'GRADED'] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export type CourseItem = {
  id: string;
  code: string;
  title: string;
  program: string;
  workloadHours: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseInput = {
  code: string;
  title: string;
  program: string;
  workloadHours: number;
};

export type Enrollment = {
  id: string;
  code: string;
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

export type EnrollmentInput = {
  code?: string;
  studentId: string;
  courseId: string;
  term: string;
  status?: string;
};

export type AcademicActivity = {
  id: string;
  code: string;
  enrollmentId: string;
  studentCode: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  category: ActivityCategory;
  score: number;
  maxScore: number;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
};

export type ActivityInput = {
  code: string;
  enrollmentId: string;
  title: string;
  category: string;
  score: number;
  status: string;
};

export type AcademicErrorKey =
  | 'COURSE_CODE_REQUIRED'
  | 'COURSE_CODE_INVALID'
  | 'COURSE_CODE_DUPLICATE'
  | 'COURSE_TITLE_INVALID'
  | 'COURSE_PROGRAM_INVALID'
  | 'COURSE_WORKLOAD_INVALID'
  | 'COURSE_HAS_ENROLLMENTS'
  | 'ENROLLMENT_CODE_INVALID'
  | 'ENROLLMENT_CODE_DUPLICATE'
  | 'ENROLLMENT_STUDENT_REQUIRED'
  | 'ENROLLMENT_COURSE_REQUIRED'
  | 'ENROLLMENT_TERM_INVALID'
  | 'ENROLLMENT_STATUS_INVALID'
  | 'ENROLLMENT_DUPLICATE_RELATION'
  | 'ACTIVITY_CODE_INVALID'
  | 'ACTIVITY_CODE_DUPLICATE'
  | 'ACTIVITY_ENROLLMENT_REQUIRED'
  | 'ACTIVITY_TITLE_INVALID'
  | 'ACTIVITY_CATEGORY_INVALID'
  | 'ACTIVITY_STATUS_INVALID'
  | 'ACTIVITY_SCORE_INVALID';

export class AcademicDomainError extends Error {
  public readonly errorKey: AcademicErrorKey;

  constructor(errorKey: AcademicErrorKey, message?: string) {
    super(message ?? errorKey);
    this.name = 'AcademicDomainError';
    this.errorKey = errorKey;
  }
}

const COURSE_CODE_REGEX = /^COURSE-[0-9]{2}$/;
const ENROLLMENT_CODE_REGEX = /^ENR-[0-9]{4}$/;
const ACTIVITY_CODE_REGEX = /^ACT-[0-9]{4}$/;

export function normalizeCode(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toUpperCase();
}

export function isValidCourseCode(code: string): boolean {
  return COURSE_CODE_REGEX.test(code);
}

export function isValidEnrollmentCode(code: string): boolean {
  return ENROLLMENT_CODE_REGEX.test(code);
}

export function isValidActivityCode(code: string): boolean {
  return ACTIVITY_CODE_REGEX.test(code);
}

export const DEMO_SEED_COURSES: ReadonlyArray<CourseInput> = [
  {
    code: 'COURSE-01',
    title: 'Spec-Driven Software Architecture',
    program: 'Software Engineering',
    workloadHours: 60,
  },
  {
    code: 'COURSE-02',
    title: 'Algorithms & Distributed Systems',
    program: 'Computer Science',
    workloadHours: 80,
  },
  {
    code: 'COURSE-03',
    title: 'Applied Machine Learning & Evaluation',
    program: 'Data Science & AI',
    workloadHours: 60,
  },
  {
    code: 'COURSE-04',
    title: 'Application Security & Threat Modeling',
    program: 'Cybersecurity',
    workloadHours: 45,
  },
  {
    code: 'COURSE-05',
    title: 'Enterprise Information Governance',
    program: 'Information Systems',
    workloadHours: 60,
  },
  {
    code: 'COURSE-06',
    title: 'Formal Verification & Logic',
    program: 'Computational Mathematics',
    workloadHours: 45,
  },
];

export function createCourseRecord(
  existingCourses: ReadonlyArray<CourseItem>,
  input: CourseInput,
  now: Date = new Date()
): { courses: CourseItem[]; created: CourseItem } {
  const code = normalizeCode(input.code);
  const title = normalizeStudentName(input.title);
  const program = String(input.program ?? '').trim();
  const workload = Number(input.workloadHours);

  if (!code) {
    throw new AcademicDomainError('COURSE_CODE_REQUIRED');
  }
  if (!isValidCourseCode(code)) {
    throw new AcademicDomainError('COURSE_CODE_INVALID');
  }
  if (
    existingCourses.some((item) => normalizeCode(item.code) === code)
  ) {
    throw new AcademicDomainError('COURSE_CODE_DUPLICATE');
  }
  if (title.length < 3 || title.length > 80) {
    throw new AcademicDomainError('COURSE_TITLE_INVALID');
  }
  if (!(DEMO_COURSES as readonly string[]).includes(program)) {
    throw new AcademicDomainError('COURSE_PROGRAM_INVALID');
  }
  if (!Number.isInteger(workload) || workload < 15 || workload > 240) {
    throw new AcademicDomainError('COURSE_WORKLOAD_INVALID');
  }

  const nowIso = now.toISOString();
  const created: CourseItem = {
    id: `crs-${code.toLowerCase()}-${Date.parse(nowIso) || Date.now()}`,
    code,
    title,
    program,
    workloadHours: workload,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const courses = [...existingCourses, created].sort((a, b) =>
    a.code.localeCompare(b.code)
  );
  return { courses, created };
}

export function updateCourseRecord(
  existingCourses: ReadonlyArray<CourseItem>,
  id: string,
  input: CourseInput,
  now: Date = new Date()
): { courses: CourseItem[]; updated: CourseItem } {
  const target = existingCourses.find((c) => c.id === id);
  if (!target) {
    throw new AcademicDomainError('COURSE_CODE_INVALID');
  }

  const code = normalizeCode(input.code);
  const title = normalizeStudentName(input.title);
  const program = String(input.program ?? '').trim();
  const workload = Number(input.workloadHours);

  if (!isValidCourseCode(code)) {
    throw new AcademicDomainError('COURSE_CODE_INVALID');
  }
  if (
    existingCourses.some(
      (item) => item.id !== id && normalizeCode(item.code) === code
    )
  ) {
    throw new AcademicDomainError('COURSE_CODE_DUPLICATE');
  }
  if (title.length < 3 || title.length > 80) {
    throw new AcademicDomainError('COURSE_TITLE_INVALID');
  }
  if (!(DEMO_COURSES as readonly string[]).includes(program)) {
    throw new AcademicDomainError('COURSE_PROGRAM_INVALID');
  }
  if (!Number.isInteger(workload) || workload < 15 || workload > 240) {
    throw new AcademicDomainError('COURSE_WORKLOAD_INVALID');
  }

  const updated: CourseItem = {
    ...target,
    code,
    title,
    program,
    workloadHours: workload,
    updatedAt: now.toISOString(),
  };

  const courses = existingCourses
    .map((item) => (item.id === id ? updated : item))
    .sort((a, b) => a.code.localeCompare(b.code));

  return { courses, updated };
}

export function deleteCourseRecord(
  existingCourses: ReadonlyArray<CourseItem>,
  existingEnrollments: ReadonlyArray<Enrollment>,
  courseId: string
): CourseItem[] {
  const hasEnrollment = existingEnrollments.some(
    (enr) => enr.courseId === courseId
  );
  if (hasEnrollment) {
    throw new AcademicDomainError('COURSE_HAS_ENROLLMENTS');
  }
  return existingCourses.filter((item) => item.id !== courseId);
}

export function nextEnrollmentCode(
  existingEnrollments: ReadonlyArray<Enrollment>
): string {
  const maxNum = existingEnrollments.reduce((acc, item) => {
    const match = /^ENR-([0-9]{4})$/.exec(item.code);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > acc ? num : acc;
  }, 0);
  return `ENR-${String(maxNum + 1).padStart(4, '0')}`;
}

export function createEnrollmentRecord(
  existingEnrollments: ReadonlyArray<Enrollment>,
  students: ReadonlyArray<Student>,
  courses: ReadonlyArray<CourseItem>,
  input: EnrollmentInput,
  now: Date = new Date()
): { enrollments: Enrollment[]; created: Enrollment } {
  const code = input.code
    ? normalizeCode(input.code)
    : nextEnrollmentCode(existingEnrollments);

  if (!isValidEnrollmentCode(code)) {
    throw new AcademicDomainError('ENROLLMENT_CODE_INVALID');
  }
  if (existingEnrollments.some((e) => normalizeCode(e.code) === code)) {
    throw new AcademicDomainError('ENROLLMENT_CODE_DUPLICATE');
  }

  const student = students.find((s) => s.id === input.studentId);
  if (!student) {
    throw new AcademicDomainError('ENROLLMENT_STUDENT_REQUIRED');
  }

  const course = courses.find((c) => c.id === input.courseId);
  if (!course) {
    throw new AcademicDomainError('ENROLLMENT_COURSE_REQUIRED');
  }

  const term = String(input.term ?? '').trim() as AcademicTerm;
  if (!(ACADEMIC_TERMS as readonly string[]).includes(term)) {
    throw new AcademicDomainError('ENROLLMENT_TERM_INVALID');
  }

  const status = (
    input.status ? String(input.status).trim().toUpperCase() : 'ACTIVE'
  ) as EnrollmentStatus;
  if (!(ENROLLMENT_STATUSES as readonly string[]).includes(status)) {
    throw new AcademicDomainError('ENROLLMENT_STATUS_INVALID');
  }

  const duplicateRelation = existingEnrollments.some(
    (e) =>
      e.studentId === student.id &&
      e.courseId === course.id &&
      e.term === term
  );
  if (duplicateRelation) {
    throw new AcademicDomainError('ENROLLMENT_DUPLICATE_RELATION');
  }

  const nowIso = now.toISOString();
  const created: Enrollment = {
    id: `enr-${code.toLowerCase()}-${Date.parse(nowIso) || Date.now()}`,
    code,
    studentId: student.id,
    studentCode: student.code,
    studentName: student.name,
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    term,
    status,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const enrollments = [...existingEnrollments, created].sort((a, b) =>
    a.code.localeCompare(b.code)
  );
  return { enrollments, created };
}

export function updateEnrollmentStatus(
  existingEnrollments: ReadonlyArray<Enrollment>,
  enrollmentId: string,
  status: EnrollmentStatus,
  now: Date = new Date()
): Enrollment[] {
  if (!(ENROLLMENT_STATUSES as readonly string[]).includes(status)) {
    throw new AcademicDomainError('ENROLLMENT_STATUS_INVALID');
  }
  return existingEnrollments.map((item) =>
    item.id === enrollmentId
      ? { ...item, status, updatedAt: now.toISOString() }
      : item
  );
}

export function nextActivityCode(
  existingActivities: ReadonlyArray<AcademicActivity>
): string {
  const maxNum = existingActivities.reduce((acc, item) => {
    const match = /^ACT-([0-9]{4})$/.exec(item.code);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > acc ? num : acc;
  }, 0);
  return `ACT-${String(maxNum + 1).padStart(4, '0')}`;
}

export function createActivityRecord(
  existingActivities: ReadonlyArray<AcademicActivity>,
  enrollments: ReadonlyArray<Enrollment>,
  input: ActivityInput,
  now: Date = new Date()
): { activities: AcademicActivity[]; created: AcademicActivity } {
  const code = normalizeCode(input.code);
  if (!isValidActivityCode(code)) {
    throw new AcademicDomainError('ACTIVITY_CODE_INVALID');
  }
  if (existingActivities.some((a) => normalizeCode(a.code) === code)) {
    throw new AcademicDomainError('ACTIVITY_CODE_DUPLICATE');
  }

  const enrollment = enrollments.find((e) => e.id === input.enrollmentId);
  if (!enrollment) {
    throw new AcademicDomainError('ACTIVITY_ENROLLMENT_REQUIRED');
  }

  const title = normalizeStudentName(input.title);
  if (title.length < 3 || title.length > 80) {
    throw new AcademicDomainError('ACTIVITY_TITLE_INVALID');
  }

  const category = normalizeCode(input.category) as ActivityCategory;
  if (!(ACTIVITY_CATEGORIES as readonly string[]).includes(category)) {
    throw new AcademicDomainError('ACTIVITY_CATEGORY_INVALID');
  }

  const status = normalizeCode(input.status) as ActivityStatus;
  if (!(ACTIVITY_STATUSES as readonly string[]).includes(status)) {
    throw new AcademicDomainError('ACTIVITY_STATUS_INVALID');
  }

  const score = Number(input.score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new AcademicDomainError('ACTIVITY_SCORE_INVALID');
  }

  const nowIso = now.toISOString();
  const created: AcademicActivity = {
    id: `act-${code.toLowerCase()}-${Date.parse(nowIso) || Date.now()}`,
    code,
    enrollmentId: enrollment.id,
    studentCode: enrollment.studentCode,
    studentName: enrollment.studentName,
    courseCode: enrollment.courseCode,
    courseTitle: enrollment.courseTitle,
    title,
    category,
    score: Math.round(score * 10) / 10,
    maxScore: 100,
    status,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const activities = [...existingActivities, created].sort((a, b) =>
    a.code.localeCompare(b.code)
  );
  return { activities, created };
}

export function updateActivityRecord(
  existingActivities: ReadonlyArray<AcademicActivity>,
  activityId: string,
  score: number,
  status: ActivityStatus,
  now: Date = new Date()
): AcademicActivity[] {
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new AcademicDomainError('ACTIVITY_SCORE_INVALID');
  }
  if (!(ACTIVITY_STATUSES as readonly string[]).includes(status)) {
    throw new AcademicDomainError('ACTIVITY_STATUS_INVALID');
  }
  return existingActivities.map((item) =>
    item.id === activityId
      ? {
          ...item,
          score: Math.round(score * 10) / 10,
          status,
          updatedAt: now.toISOString(),
        }
      : item
  );
}

export function mergeDemoAcademicSuite(
  existingStudents: ReadonlyArray<Student>,
  existingCourses: ReadonlyArray<CourseItem>,
  existingEnrollments: ReadonlyArray<Enrollment>,
  existingActivities: ReadonlyArray<AcademicActivity>,
  now: Date = new Date()
): {
  students: Student[];
  courses: CourseItem[];
  enrollments: Enrollment[];
  activities: AcademicActivity[];
} {
  const mergedStu = mergeDemoStudents(existingStudents, now);
  let courses = [...existingCourses];

  DEMO_SEED_COURSES.forEach((seed, idx) => {
    const exists = courses.some((c) => c.code === seed.code);
    if (!exists) {
      courses = createCourseRecord(
        courses,
        seed,
        new Date(now.getTime() + idx * 1000)
      ).courses;
    }
  });

  let enrollments = [...existingEnrollments];
  const pairs: Array<{
    enrCode: string;
    stuCode: string;
    crsCode: string;
    term: AcademicTerm;
    status: EnrollmentStatus;
  }> = [
    {
      enrCode: 'ENR-0001',
      stuCode: 'DEMO-0001',
      crsCode: 'COURSE-01',
      term: '2026.1',
      status: 'ACTIVE',
    },
    {
      enrCode: 'ENR-0002',
      stuCode: 'DEMO-0002',
      crsCode: 'COURSE-02',
      term: '2026.1',
      status: 'ACTIVE',
    },
    {
      enrCode: 'ENR-0003',
      stuCode: 'DEMO-0003',
      crsCode: 'COURSE-03',
      term: '2026.1',
      status: 'COMPLETED',
    },
    {
      enrCode: 'ENR-0004',
      stuCode: 'DEMO-0004',
      crsCode: 'COURSE-04',
      term: '2026.1',
      status: 'ACTIVE',
    },
    {
      enrCode: 'ENR-0005',
      stuCode: 'DEMO-0005',
      crsCode: 'COURSE-05',
      term: '2026.2',
      status: 'ACTIVE',
    },
    {
      enrCode: 'ENR-0006',
      stuCode: 'DEMO-0006',
      crsCode: 'COURSE-01',
      term: '2026.2',
      status: 'COMPLETED',
    },
  ];

  pairs.forEach((p, idx) => {
    const stu = mergedStu.students.find((s) => s.code === p.stuCode);
    const crs = courses.find((c) => c.code === p.crsCode);
    if (stu && crs) {
      const already = enrollments.some(
        (e) =>
          e.code === p.enrCode ||
          (e.studentId === stu.id && e.courseId === crs.id && e.term === p.term)
      );
      if (!already) {
        enrollments = createEnrollmentRecord(
          enrollments,
          mergedStu.students,
          courses,
          {
            code: p.enrCode,
            studentId: stu.id,
            courseId: crs.id,
            term: p.term,
            status: p.status,
          },
          new Date(now.getTime() + idx * 1000)
        ).enrollments;
      }
    }
  });

  let activities = [...existingActivities];
  const actSeeds: Array<{
    code: string;
    enrCode: string;
    title: string;
    category: ActivityCategory;
    score: number;
    status: ActivityStatus;
  }> = [
    {
      code: 'ACT-0001',
      enrCode: 'ENR-0001',
      title: 'Product Brief & PRD Specification Lab',
      category: 'LAB',
      score: 96,
      status: 'GRADED',
    },
    {
      code: 'ACT-0002',
      enrCode: 'ENR-0002',
      title: 'Distributed Consensus Project',
      category: 'PROJECT',
      score: 89,
      status: 'GRADED',
    },
    {
      code: 'ACT-0003',
      enrCode: 'ENR-0003',
      title: 'Model Evaluation & Safety Benchmark',
      category: 'EXAM',
      score: 94,
      status: 'GRADED',
    },
    {
      code: 'ACT-0004',
      enrCode: 'ENR-0004',
      title: 'STRIDE Threat Modeling & CSV Guard Quiz',
      category: 'QUIZ',
      score: 91,
      status: 'GRADED',
    },
    {
      code: 'ACT-0005',
      enrCode: 'ENR-0005',
      title: 'LGPD & GDPR Privacy by Design Workshop',
      category: 'LAB',
      score: 85,
      status: 'SUBMITTED',
    },
    {
      code: 'ACT-0006',
      enrCode: 'ENR-0006',
      title: 'Quality Gate & Traceability Capstone',
      category: 'PROJECT',
      score: 98,
      status: 'GRADED',
    },
  ];

  actSeeds.forEach((seed, idx) => {
    const enr = enrollments.find((e) => e.code === seed.enrCode);
    const exists = activities.some((a) => a.code === seed.code);
    if (enr && !exists) {
      activities = createActivityRecord(
        activities,
        enrollments,
        {
          code: seed.code,
          enrollmentId: enr.id,
          title: seed.title,
          category: seed.category,
          score: seed.score,
          status: seed.status,
        },
        new Date(now.getTime() + idx * 1000)
      ).activities;
    }
  });

  return {
    students: mergedStu.students,
    courses,
    enrollments,
    activities,
  };
}

export function calculateAcademicSuiteSummary(
  courses: ReadonlyArray<CourseItem>,
  enrollments: ReadonlyArray<Enrollment>,
  activities: ReadonlyArray<AcademicActivity>
): {
  totalCoursesCatalog: number;
  totalEnrollments: number;
  activeEnrollments: number;
  totalActivities: number;
  gradedActivities: number;
  averageScore: number;
} {
  const activeEnrollments = enrollments.filter(
    (e) => e.status === 'ACTIVE'
  ).length;
  const graded = activities.filter((a) => a.status === 'GRADED');
  const averageScore =
    graded.length === 0
      ? 0
      : Math.round(
          (graded.reduce((sum, a) => sum + a.score, 0) / graded.length) * 10
        ) / 10;

  return {
    totalCoursesCatalog: courses.length,
    totalEnrollments: enrollments.length,
    activeEnrollments,
    totalActivities: activities.length,
    gradedActivities: graded.length,
    averageScore,
  };
}

export function exportCoursesToCsv(courses: ReadonlyArray<CourseItem>): string {
  const header = 'id,code,title,program,workloadHours,createdAt,updatedAt';
  const rows = courses.map((c) =>
    [
      sanitizeCsvCell(c.id),
      sanitizeCsvCell(c.code),
      sanitizeCsvCell(c.title),
      sanitizeCsvCell(c.program),
      sanitizeCsvCell(String(c.workloadHours)),
      sanitizeCsvCell(c.createdAt),
      sanitizeCsvCell(c.updatedAt),
    ].join(',')
  );
  return [header, ...rows].join('\r\n');
}

export function exportEnrollmentsToCsv(
  enrollments: ReadonlyArray<Enrollment>
): string {
  const header =
    'id,code,studentCode,studentName,courseCode,courseTitle,term,status,createdAt,updatedAt';
  const rows = enrollments.map((e) =>
    [
      sanitizeCsvCell(e.id),
      sanitizeCsvCell(e.code),
      sanitizeCsvCell(e.studentCode),
      sanitizeCsvCell(e.studentName),
      sanitizeCsvCell(e.courseCode),
      sanitizeCsvCell(e.courseTitle),
      sanitizeCsvCell(e.term),
      sanitizeCsvCell(e.status),
      sanitizeCsvCell(e.createdAt),
      sanitizeCsvCell(e.updatedAt),
    ].join(',')
  );
  return [header, ...rows].join('\r\n');
}

export function exportActivitiesToCsv(
  activities: ReadonlyArray<AcademicActivity>
): string {
  const header =
    'id,code,studentCode,courseCode,title,category,score,maxScore,status,createdAt,updatedAt';
  const rows = activities.map((a) =>
    [
      sanitizeCsvCell(a.id),
      sanitizeCsvCell(a.code),
      sanitizeCsvCell(a.studentCode),
      sanitizeCsvCell(a.courseCode),
      sanitizeCsvCell(a.title),
      sanitizeCsvCell(a.category),
      sanitizeCsvCell(String(a.score)),
      sanitizeCsvCell(String(a.maxScore)),
      sanitizeCsvCell(a.status),
      sanitizeCsvCell(a.createdAt),
      sanitizeCsvCell(a.updatedAt),
    ].join(',')
  );
  return [header, ...rows].join('\r\n');
}
