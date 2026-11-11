import { describe, expect, it } from 'vitest';
import { createStudentRecord } from '../../lib/domain/students';
import {
  AcademicDomainError,
  calculateAcademicSuiteSummary,
  createActivityRecord,
  createCourseRecord,
  createEnrollmentRecord,
  deleteCourseRecord,
  exportActivitiesToCsv,
  exportCoursesToCsv,
  exportEnrollmentsToCsv,
  mergeDemoAcademicSuite,
  updateActivityRecord,
  updateCourseRecord,
  updateEnrollmentStatus,
} from '../../lib/domain/academic';

describe('Academic Suite Domain Layer (FEAT-WEB-002..004)', () => {
  it('creates, updates, validates, and guards deletion of synthetic courses (RF-WEB-015..018)', () => {
    const { courses: c1, created } = createCourseRecord([], {
      code: ' course-01 ',
      title: ' Spec-Driven Architecture ',
      program: 'Software Engineering',
      workloadHours: 60,
    });

    expect(c1).toHaveLength(1);
    expect(created.code).toBe('COURSE-01');
    expect(created.title).toBe('Spec-Driven Architecture');

    expect(() =>
      createCourseRecord(c1, {
        code: 'course-01',
        title: 'Duplicate Course',
        program: 'Software Engineering',
        workloadHours: 60,
      })
    ).toThrowError(AcademicDomainError);

    expect(() =>
      createCourseRecord(c1, {
        code: 'COURSE-02',
        title: 'Invalid Workload',
        program: 'Software Engineering',
        workloadHours: 5,
      })
    ).toThrowError(AcademicDomainError);

    const { courses: c2, updated } = updateCourseRecord(c1, created.id, {
      code: 'COURSE-01',
      title: 'Updated Architecture Course',
      program: 'Computer Science',
      workloadHours: 90,
    });
    expect(updated.title).toBe('Updated Architecture Course');
    expect(updated.workloadHours).toBe(90);

    const { students, created: student } = createStudentRecord([], {
      code: 'DEMO-0001',
      name: 'Helena Costa',
      course: 'Software Engineering',
    });

    const { enrollments } = createEnrollmentRecord([], students, c2, {
      code: 'ENR-0001',
      studentId: student.id,
      courseId: created.id,
      term: '2026.1',
    });

    // Guard deletion while enrollment exists
    expect(() =>
      deleteCourseRecord(c2, enrollments, created.id)
    ).toThrowError(AcademicDomainError);

    const afterDelete = deleteCourseRecord(c2, [], created.id);
    expect(afterDelete).toHaveLength(0);
  });

  it('creates relational enrollments, prevents duplicates, and updates status (RF-WEB-019..022)', () => {
    const { students, created: student } = createStudentRecord([], {
      code: 'DEMO-0001',
      name: 'Helena Costa',
      course: 'Software Engineering',
    });
    const { courses, created: course } = createCourseRecord([], {
      code: 'COURSE-01',
      title: 'Distributed Systems',
      program: 'Computer Science',
      workloadHours: 60,
    });

    const { enrollments, created: enrollment } = createEnrollmentRecord(
      [],
      students,
      courses,
      {
        code: ' enr-0001 ',
        studentId: student.id,
        courseId: course.id,
        term: '2026.1',
        status: 'ACTIVE',
      }
    );

    expect(enrollment.code).toBe('ENR-0001');
    expect(enrollment.studentCode).toBe('DEMO-0001');
    expect(enrollment.courseCode).toBe('COURSE-01');

    // Reject duplicate student + course + term even with a new ENR code
    expect(() =>
      createEnrollmentRecord(enrollments, students, courses, {
        code: 'ENR-0002',
        studentId: student.id,
        courseId: course.id,
        term: '2026.1',
      })
    ).toThrowError(AcademicDomainError);

    const updatedList = updateEnrollmentStatus(
      enrollments,
      enrollment.id,
      'COMPLETED'
    );
    expect(updatedList[0].status).toBe('COMPLETED');
  });

  it('registers academic activities, validates score bounds (0..100), and calculates suite summary (RF-WEB-023..026)', () => {
    const seeded = mergeDemoAcademicSuite([], [], [], []);
    expect(seeded.students).toHaveLength(6);
    expect(seeded.courses).toHaveLength(6);
    expect(seeded.enrollments).toHaveLength(6);
    expect(seeded.activities).toHaveLength(6);

    // Idempotent second call
    const seededAgain = mergeDemoAcademicSuite(
      seeded.students,
      seeded.courses,
      seeded.enrollments,
      seeded.activities
    );
    expect(seededAgain.activities).toHaveLength(6);

    // Reject score > 100
    expect(() =>
      createActivityRecord(seeded.activities, seeded.enrollments, {
        code: 'ACT-0099',
        enrollmentId: seeded.enrollments[0].id,
        title: 'Invalid Score Activity',
        category: 'EXAM',
        score: 105,
        status: 'GRADED',
      })
    ).toThrowError(AcademicDomainError);

    const updatedActs = updateActivityRecord(
      seeded.activities,
      seeded.activities[0].id,
      100,
      'GRADED'
    );
    expect(updatedActs[0].score).toBe(100);

    const summary = calculateAcademicSuiteSummary(
      seeded.courses,
      seeded.enrollments,
      updatedActs
    );
    expect(summary.totalCoursesCatalog).toBe(6);
    expect(summary.totalEnrollments).toBe(6);
    expect(summary.totalActivities).toBe(6);
    expect(summary.averageScore).toBeGreaterThan(90);
  });

  it('exports courses, enrollments, and activities to CSV with formula injection guard (RF-WEB-013, RF-WEB-018, RF-WEB-022, RF-WEB-026)', () => {
    const seeded = mergeDemoAcademicSuite([], [], [], []);
    const coursesCsv = exportCoursesToCsv([
      {
        ...seeded.courses[0],
        title: '=CMD("calc")',
      },
    ]);
    expect(coursesCsv).toContain(`"'=CMD(""calc"")"`);

    const enrollmentsCsv = exportEnrollmentsToCsv(seeded.enrollments);
    expect(enrollmentsCsv).toContain('"ENR-0001"');

    const activitiesCsv = exportActivitiesToCsv(seeded.activities);
    expect(activitiesCsv).toContain('"ACT-0001"');
  });
});
