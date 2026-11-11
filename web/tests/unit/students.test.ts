import { describe, expect, it } from 'vitest';
import {
  DEMO_COURSES,
  DEMO_SEED_STUDENTS,
  Student,
  StudentDomainError,
  calculateDashboardMetrics,
  createStudentRecord,
  deleteStudentRecord,
  exportStudentsToCsv,
  filterAndSortStudents,
  mergeDemoStudents,
  normalizeStudentCode,
  normalizeStudentName,
  sanitizeCsvCell,
  updateStudentRecord,
  validateStudentInput,
} from '../../lib/domain/students';

describe('Student Domain Layer (FEAT-WEB-001)', () => {
  it('normalizes student code and name properly (RF-WEB-002, RF-WEB-003)', () => {
    expect(normalizeStudentCode('  demo-0042  ')).toBe('DEMO-0042');
    expect(normalizeStudentName('  Ada   Lovelace   Fictional ')).toBe(
      'Ada Lovelace Fictional'
    );
  });

  it('validates valid input and rejects invalid codes, names, and courses (RF-WEB-002..004)', () => {
    const valid = validateStudentInput(
      {
        code: ' demo-0001 ',
        name: ' Helena Costa ',
        course: 'Software Engineering',
      },
      []
    );
    expect(valid.valid).toBe(true);
    expect(valid.normalized.code).toBe('DEMO-0001');

    const badCode = validateStudentInput(
      { code: 'REAL-0001', name: 'Helena Costa', course: 'Software Engineering' },
      []
    );
    expect(badCode.valid).toBe(false);
    expect(badCode.errors.code).toBe('CODE_INVALID_PATTERN');

    const shortName = validateStudentInput(
      { code: 'DEMO-0001', name: 'A', course: 'Software Engineering' },
      []
    );
    expect(shortName.valid).toBe(false);
    expect(shortName.errors.name).toBe('NAME_LENGTH_OUT_OF_BOUNDS');

    const longName = validateStudentInput(
      { code: 'DEMO-0001', name: 'X'.repeat(81), course: 'Software Engineering' },
      []
    );
    expect(longName.valid).toBe(false);
    expect(longName.errors.name).toBe('NAME_LENGTH_OUT_OF_BOUNDS');

    const badCourse = validateStudentInput(
      { code: 'DEMO-0001', name: 'Helena Costa', course: 'Astrology 101' },
      []
    );
    expect(badCourse.valid).toBe(false);
    expect(badCourse.errors.course).toBe('COURSE_INVALID');
  });

  it('prevents duplicate student codes even after normalization (RF-WEB-005)', () => {
    const first = createStudentRecord([], {
      code: 'DEMO-0001',
      name: 'First Student',
      course: DEMO_COURSES[0],
    });

    expect(() =>
      createStudentRecord(first.students, {
        code: '  demo-0001 ',
        name: 'Second Student',
        course: DEMO_COURSES[1],
      })
    ).toThrowError(StudentDomainError);

    const dupCheck = validateStudentInput(
      {
        code: 'demo-0001',
        name: 'Second Student',
        course: DEMO_COURSES[1],
      },
      first.students
    );
    expect(dupCheck.valid).toBe(false);
    expect(dupCheck.errors.code).toBe('CODE_DUPLICATE');
  });

  it('creates, edits, and deletes student records accurately (RF-WEB-001, RF-WEB-009, RF-WEB-010)', () => {
    const t1 = new Date('2026-11-10T10:00:00.000Z');
    const t2 = new Date('2026-11-10T11:00:00.000Z');

    const { students: list1, created } = createStudentRecord(
      [],
      {
        code: 'demo-0010',
        name: 'Carlos Sintetico',
        course: 'Computer Science',
      },
      t1
    );

    expect(list1).toHaveLength(1);
    expect(created.code).toBe('DEMO-0010');
    expect(created.createdAt).toBe(t1.toISOString());

    const { students: list2, updated } = updateStudentRecord(
      list1,
      created.id,
      {
        code: 'DEMO-0010',
        name: 'Carlos Atualizado',
        course: 'Cybersecurity',
      },
      t2
    );

    expect(list2).toHaveLength(1);
    expect(updated.name).toBe('Carlos Atualizado');
    expect(updated.course).toBe('Cybersecurity');
    expect(updated.createdAt).toBe(t1.toISOString());
    expect(updated.updatedAt).toBe(t2.toISOString());

    const afterDelete = deleteStudentRecord(list2, created.id);
    expect(afterDelete).toHaveLength(0);
  });

  it('searches, filters, and sorts student records deterministically (RF-WEB-007, RF-WEB-008)', () => {
    let list: Student[] = [];
    list = createStudentRecord(
      list,
      { code: 'DEMO-0002', name: 'Bruno Demo', course: 'Cybersecurity' },
      new Date('2026-11-10T10:00:00Z')
    ).students;
    list = createStudentRecord(
      list,
      { code: 'DEMO-0001', name: 'Alice Demo', course: 'Software Engineering' },
      new Date('2026-11-10T11:00:00Z')
    ).students;
    list = createStudentRecord(
      list,
      { code: 'DEMO-0003', name: 'Carla Demo', course: 'Computer Science' },
      new Date('2026-11-10T09:00:00Z')
    ).students;

    const searchByName = filterAndSortStudents(list, 'alice');
    expect(searchByName).toHaveLength(1);
    expect(searchByName[0].code).toBe('DEMO-0001');

    const searchByCode = filterAndSortStudents(list, '0002');
    expect(searchByCode).toHaveLength(1);
    expect(searchByCode[0].name).toBe('Bruno Demo');

    const filterByCourse = filterAndSortStudents(list, '', 'Computer Science');
    expect(filterByCourse).toHaveLength(1);
    expect(filterByCourse[0].code).toBe('DEMO-0003');

    const sortedDescByName = filterAndSortStudents(list, '', 'ALL', 'name', 'desc');
    expect(sortedDescByName.map((s) => s.name)).toEqual([
      'Carla Demo',
      'Bruno Demo',
      'Alice Demo',
    ]);

    const sortedByDateAsc = filterAndSortStudents(
      list,
      '',
      'ALL',
      'createdAt',
      'asc'
    );
    expect(sortedByDateAsc.map((s) => s.code)).toEqual([
      'DEMO-0003',
      'DEMO-0002',
      'DEMO-0001',
    ]);
  });

  it('loads demonstration dataset idempotently without duplicating existing codes (RF-WEB-011)', () => {
    const initial = createStudentRecord([], {
      code: 'DEMO-0001',
      name: 'Custom Existing Student',
      course: 'Software Engineering',
    }).students;

    const firstMerge = mergeDemoStudents(initial);
    expect(firstMerge.students).toHaveLength(DEMO_SEED_STUDENTS.length);
    expect(firstMerge.addedCount).toBe(DEMO_SEED_STUDENTS.length - 1);
    expect(
      firstMerge.students.find((s) => s.code === 'DEMO-0001')?.name
    ).toBe('Custom Existing Student');

    const secondMerge = mergeDemoStudents(firstMerge.students);
    expect(secondMerge.addedCount).toBe(0);
    expect(secondMerge.students).toHaveLength(DEMO_SEED_STUDENTS.length);
  });

  it('calculates dashboard metrics accurately from current records (RF-WEB-014)', () => {
    const emptyMetrics = calculateDashboardMetrics([]);
    expect(emptyMetrics.totalStudents).toBe(0);
    expect(emptyMetrics.totalCoursesRepresented).toBe(0);
    expect(emptyMetrics.latestStudent).toBeNull();

    const seeded = mergeDemoStudents([]).students;
    const metrics = calculateDashboardMetrics(seeded);
    expect(metrics.totalStudents).toBe(DEMO_SEED_STUDENTS.length);
    expect(metrics.totalCoursesRepresented).toBe(5);
    expect(metrics.latestStudent?.code).toBe('DEMO-0006');

    const seDist = metrics.courseDistribution.find(
      (d) => d.course === 'Software Engineering'
    );
    expect(seDist?.count).toBe(2);
    expect(seDist?.percentage).toBe(33);
  });

  it('exports CSV and neutralizes spreadsheet formula injection (RF-WEB-013)', () => {
    expect(sanitizeCsvCell('=CMD("calc")')).toBe(`"'=CMD(""calc"")"`);
    expect(sanitizeCsvCell('+SUM(A1:A2)')).toBe(`"'+SUM(A1:A2)"`);
    expect(sanitizeCsvCell('-1+2')).toBe(`"'-1+2"`);
    expect(sanitizeCsvCell('@HYPERLINK("http://evil")')).toBe(
      `"'@HYPERLINK(""http://evil"")"`
    );
    expect(sanitizeCsvCell('  =malicious')).toBe(`"'  =malicious"`);

    const students: Student[] = [
      {
        id: 'stu-1',
        code: 'DEMO-0001',
        name: '=HYPERLINK("http://malicious.example","Click")',
        course: 'Software Engineering',
        createdAt: '2026-11-10T00:00:00.000Z',
        updatedAt: '2026-11-10T00:00:00.000Z',
      },
    ];

    const csv = exportStudentsToCsv(students);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('id,code,name,course,createdAt,updatedAt');
    expect(lines[1]).toContain(
      `"'=HYPERLINK(""http://malicious.example"",""Click"")"`
    );
  });
});
