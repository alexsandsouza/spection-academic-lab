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

export type ValidationErrorKey =
  | 'CODE_REQUIRED'
  | 'CODE_INVALID_PATTERN'
  | 'CODE_DUPLICATE'
  | 'NAME_REQUIRED'
  | 'NAME_LENGTH_OUT_OF_BOUNDS'
  | 'COURSE_REQUIRED'
  | 'COURSE_INVALID';

export type ValidationFieldErrors = {
  code?: ValidationErrorKey;
  name?: ValidationErrorKey;
  course?: ValidationErrorKey;
};

export type ValidationResult = {
  valid: boolean;
  normalized: StudentInput;
  errors: ValidationFieldErrors;
};

export type SortField = 'code' | 'name' | 'course' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export type CourseDistributionItem = {
  course: string;
  count: number;
  percentage: number;
};

export type DashboardMetrics = {
  totalStudents: number;
  totalCoursesRepresented: number;
  latestStudent: Student | null;
  courseDistribution: CourseDistributionItem[];
};

export const DEMO_SEED_STUDENTS: ReadonlyArray<StudentInput> = [
  {
    code: 'DEMO-0001',
    name: 'Helena Costa Ficticia',
    course: 'Software Engineering',
  },
  {
    code: 'DEMO-0002',
    name: 'Lucas Almeida Sintetico',
    course: 'Computer Science',
  },
  {
    code: 'DEMO-0003',
    name: 'Marina Santos Demo',
    course: 'Data Science & AI',
  },
  {
    code: 'DEMO-0004',
    name: 'Rafael Oliveira Exemplo',
    course: 'Cybersecurity',
  },
  {
    code: 'DEMO-0005',
    name: 'Beatriz Ferreira Lab',
    course: 'Information Systems',
  },
  {
    code: 'DEMO-0006',
    name: 'Gabriel Ribeiro Acad',
    course: 'Software Engineering',
  },
];

const STUDENT_CODE_REGEX = /^DEMO-[0-9]{4}$/;
const FORMULA_PREFIX_REGEX = /^[=+\-@\t\r]/;

export class StudentDomainError extends Error {
  public readonly errors: ValidationFieldErrors;

  constructor(message: string, errors: ValidationFieldErrors = {}) {
    super(message);
    this.name = 'StudentDomainError';
    this.errors = errors;
  }
}

export function normalizeStudentCode(rawCode: string): string {
  return String(rawCode ?? '')
    .trim()
    .toUpperCase();
}

export function normalizeStudentName(rawName: string): string {
  return String(rawName ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function isValidStudentCode(normalizedCode: string): boolean {
  return STUDENT_CODE_REGEX.test(normalizedCode);
}

export function isValidStudentName(normalizedName: string): boolean {
  return normalizedName.length >= 2 && normalizedName.length <= 80;
}

export function isValidStudentCourse(course: string): boolean {
  return (DEMO_COURSES as readonly string[]).includes(course);
}

export function validateStudentInput(
  input: StudentInput,
  existingStudents: ReadonlyArray<Student>,
  editingId?: string
): ValidationResult {
  const normalizedCode = normalizeStudentCode(input.code);
  const normalizedName = normalizeStudentName(input.name);
  const normalizedCourse = String(input.course ?? '').trim();

  const errors: ValidationFieldErrors = {};

  if (!normalizedCode) {
    errors.code = 'CODE_REQUIRED';
  } else if (!isValidStudentCode(normalizedCode)) {
    errors.code = 'CODE_INVALID_PATTERN';
  } else {
    const duplicate = existingStudents.some(
      (student) =>
        student.id !== editingId &&
        normalizeStudentCode(student.code) === normalizedCode
    );
    if (duplicate) {
      errors.code = 'CODE_DUPLICATE';
    }
  }

  if (!normalizedName) {
    errors.name = 'NAME_REQUIRED';
  } else if (!isValidStudentName(normalizedName)) {
    errors.name = 'NAME_LENGTH_OUT_OF_BOUNDS';
  }

  if (!normalizedCourse) {
    errors.course = 'COURSE_REQUIRED';
  } else if (!isValidStudentCourse(normalizedCourse)) {
    errors.course = 'COURSE_INVALID';
  }

  return {
    valid: Object.keys(errors).length === 0,
    normalized: {
      code: normalizedCode,
      name: normalizedName,
      course: normalizedCourse,
    },
    errors,
  };
}

function generateStudentId(code: string, nowIso: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `stu-${code.toLowerCase()}-${ Date.parse(nowIso) || Date.now() }-${randomSuffix}`;
}

export function createStudentRecord(
  existingStudents: ReadonlyArray<Student>,
  input: StudentInput,
  now: Date = new Date()
): { students: Student[]; created: Student } {
  const validation = validateStudentInput(input, existingStudents);
  if (!validation.valid) {
    throw new StudentDomainError(
      'Invalid student input.',
      validation.errors
    );
  }

  const nowIso = now.toISOString();
  const created: Student = {
    id: generateStudentId(validation.normalized.code, nowIso),
    code: validation.normalized.code,
    name: validation.normalized.name,
    course: validation.normalized.course,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const students = [...existingStudents, created].sort((a, b) =>
    a.code.localeCompare(b.code)
  );

  return { students, created };
}

export function updateStudentRecord(
  existingStudents: ReadonlyArray<Student>,
  id: string,
  input: StudentInput,
  now: Date = new Date()
): { students: Student[]; updated: Student } {
  const target = existingStudents.find((item) => item.id === id);
  if (!target) {
    throw new StudentDomainError('Student record not found.');
  }

  const validation = validateStudentInput(input, existingStudents, id);
  if (!validation.valid) {
    throw new StudentDomainError(
      'Invalid student update input.',
      validation.errors
    );
  }

  const updated: Student = {
    ...target,
    code: validation.normalized.code,
    name: validation.normalized.name,
    course: validation.normalized.course,
    updatedAt: now.toISOString(),
  };

  const students = existingStudents
    .map((item) => (item.id === id ? updated : item))
    .sort((a, b) => a.code.localeCompare(b.code));

  return { students, updated };
}

export function deleteStudentRecord(
  existingStudents: ReadonlyArray<Student>,
  id: string
): Student[] {
  return existingStudents.filter((item) => item.id !== id);
}

export function filterAndSortStudents(
  students: ReadonlyArray<Student>,
  query: string = '',
  courseFilter: string = 'ALL',
  sortField: SortField = 'code',
  sortDirection: SortDirection = 'asc'
): Student[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = students.filter((student) => {
    const matchesCourse =
      !courseFilter || courseFilter === 'ALL' || student.course === courseFilter;
    if (!matchesCourse) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      student.code.toLowerCase().includes(normalizedQuery) ||
      student.name.toLowerCase().includes(normalizedQuery) ||
      student.course.toLowerCase().includes(normalizedQuery)
    );
  });

  const multiplier = sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'createdAt') {
      comparison = a.createdAt.localeCompare(b.createdAt);
    } else {
      comparison = a[sortField].localeCompare(b[sortField], undefined, {
        sensitivity: 'base',
      });
    }

    if (comparison === 0) {
      comparison = a.code.localeCompare(b.code);
    }

    return comparison * multiplier;
  });
}

export function mergeDemoStudents(
  existingStudents: ReadonlyArray<Student>,
  now: Date = new Date()
): { students: Student[]; addedCount: number } {
  let current = [...existingStudents];
  let addedCount = 0;

  DEMO_SEED_STUDENTS.forEach((seed, index) => {
    const normalizedSeedCode = normalizeStudentCode(seed.code);
    const alreadyExists = current.some(
      (student) => normalizeStudentCode(student.code) === normalizedSeedCode
    );

    if (!alreadyExists) {
      const seedDate = new Date(now.getTime() + index * 1000);
      const result = createStudentRecord(current, seed, seedDate);
      current = result.students;
      addedCount += 1;
    }
  });

  return { students: current, addedCount };
}

export function calculateDashboardMetrics(
  students: ReadonlyArray<Student>
): DashboardMetrics {
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      totalCoursesRepresented: 0,
      latestStudent: null,
      courseDistribution: DEMO_COURSES.map((course) => ({
        course,
        count: 0,
        percentage: 0,
      })),
    };
  }

  const courseCounts = new Map<string, number>();
  DEMO_COURSES.forEach((course) => courseCounts.set(course, 0));

  let latestStudent: Student | null = null;

  for (const student of students) {
    courseCounts.set(student.course, (courseCounts.get(student.course) ?? 0) + 1);
    if (
      !latestStudent ||
      student.createdAt > latestStudent.createdAt ||
      (student.createdAt === latestStudent.createdAt &&
        student.updatedAt > latestStudent.updatedAt)
    ) {
      latestStudent = student;
    }
  }

  const totalCoursesRepresented = Array.from(courseCounts.values()).filter(
    (count) => count > 0
  ).length;

  const courseDistribution: CourseDistributionItem[] = DEMO_COURSES.map(
    (course) => {
      const count = courseCounts.get(course) ?? 0;
      const percentage = Math.round((count / totalStudents) * 100);
      return {
        course,
        count,
        percentage,
      };
    }
  );

  return {
    totalStudents,
    totalCoursesRepresented,
    latestStudent,
    courseDistribution,
  };
}

export function sanitizeCsvCell(rawValue: string): string {
  const str = String(rawValue ?? '');
  const trimmed = str.trimStart();
  const needsFormulaGuard =
    FORMULA_PREFIX_REGEX.test(str) || FORMULA_PREFIX_REGEX.test(trimmed);
  const safeValue = needsFormulaGuard ? `'${str}` : str;
  const escaped = safeValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function exportStudentsToCsv(students: ReadonlyArray<Student>): string {
  const headers = ['id', 'code', 'name', 'course', 'createdAt', 'updatedAt'];
  const headerRow = headers.join(',');

  const rows = students.map((student) =>
    [
      sanitizeCsvCell(student.id),
      sanitizeCsvCell(student.code),
      sanitizeCsvCell(student.name),
      sanitizeCsvCell(student.course),
      sanitizeCsvCell(student.createdAt),
      sanitizeCsvCell(student.updatedAt),
    ].join(',')
  );

  return [headerRow, ...rows].join('\r\n');
}
