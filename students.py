"""FEAT-001..004: synthetic academic registry (students, courses, enrollments, activities)."""
import sqlite3
import re


class Registry:
    def __init__(self, db=':memory:'):
        self.conn = sqlite3.connect(db)
        self.conn.execute(
            'CREATE TABLE IF NOT EXISTS students (code TEXT PRIMARY KEY, name TEXT NOT NULL)'
        )
        self.conn.execute(
            'CREATE TABLE IF NOT EXISTS courses (code TEXT PRIMARY KEY, title TEXT NOT NULL, workload INTEGER NOT NULL)'
        )
        self.conn.execute(
            'CREATE TABLE IF NOT EXISTS enrollments ('
            'student_code TEXT NOT NULL, '
            'course_code TEXT NOT NULL, '
            'term TEXT NOT NULL, '
            'PRIMARY KEY (student_code, course_code, term))'
        )
        self.conn.execute(
            'CREATE TABLE IF NOT EXISTS activities ('
            'code TEXT PRIMARY KEY, '
            'student_code TEXT NOT NULL, '
            'course_code TEXT NOT NULL, '
            'title TEXT NOT NULL, '
            'score REAL NOT NULL)'
        )

    def add(self, code, name):
        code, name = code.strip().upper(), name.strip()
        if not re.fullmatch(r'DEMO-[0-9]{4}', code) or not 2 <= len(name) <= 80:
            raise ValueError('Use DEMO-0001 and a fictional name (2-80 characters).')
        try:
            with self.conn:
                self.conn.execute('INSERT INTO students VALUES (?, ?)', (code, name))
        except sqlite3.IntegrityError as exc:
            raise ValueError('Duplicate student code.') from exc

    def list(self):
        return self.conn.execute('SELECT code, name FROM students ORDER BY code').fetchall()

    def add_course(self, code, title, workload=60):
        code, title = code.strip().upper(), title.strip()
        if not isinstance(workload, int) or isinstance(workload, bool):
            raise ValueError('Workload must be an integer between 15 and 240.')
        if (
            not re.fullmatch(r'COURSE-[0-9]{2}', code)
            or not 3 <= len(title) <= 80
            or not 15 <= workload <= 240
        ):
            raise ValueError('Use COURSE-01, title (3-80 chars) and workload (15-240).')
        try:
            with self.conn:
                self.conn.execute(
                    'INSERT INTO courses VALUES (?, ?, ?)', (code, title, workload)
                )
        except sqlite3.IntegrityError as exc:
            raise ValueError('Duplicate course code.') from exc

    def list_courses(self):
        return self.conn.execute(
            'SELECT code, title, workload FROM courses ORDER BY code'
        ).fetchall()

    def enroll(self, student_code, course_code, term='2026.1'):
        student_code = student_code.strip().upper()
        course_code = course_code.strip().upper()
        term = term.strip()
        if not re.fullmatch(r'20[2-9][0-9]\.[12]', term):
            raise ValueError('Use academic term format YYYY.1 or YYYY.2.')
        student_exists = self.conn.execute(
            'SELECT 1 FROM students WHERE code = ?', (student_code,)
        ).fetchone()
        course_exists = self.conn.execute(
            'SELECT 1 FROM courses WHERE code = ?', (course_code,)
        ).fetchone()
        if not student_exists or not course_exists:
            raise ValueError('Student and course must exist before enrollment.')
        try:
            with self.conn:
                self.conn.execute(
                    'INSERT INTO enrollments VALUES (?, ?, ?)',
                    (student_code, course_code, term),
                )
        except sqlite3.IntegrityError as exc:
            raise ValueError('Duplicate enrollment for student, course and term.') from exc

    def list_enrollments(self):
        return self.conn.execute(
            'SELECT student_code, course_code, term FROM enrollments '
            'ORDER BY student_code, course_code, term'
        ).fetchall()

    def add_activity(self, code, student_code, course_code, title, score):
        code = code.strip().upper()
        student_code = student_code.strip().upper()
        course_code = course_code.strip().upper()
        title = title.strip()
        if isinstance(score, bool) or not isinstance(score, (int, float)):
            raise ValueError('Score must be a number between 0 and 100.')
        score_val = float(score)
        if (
            not re.fullmatch(r'ACT-[0-9]{4}', code)
            or not 3 <= len(title) <= 80
            or not 0.0 <= score_val <= 100.0
        ):
            raise ValueError('Use ACT-0001, title (3-80 chars) and score (0-100).')
        enrolled = self.conn.execute(
            'SELECT 1 FROM enrollments WHERE student_code = ? AND course_code = ?',
            (student_code, course_code),
        ).fetchone()
        if not enrolled:
            raise ValueError('Student must be enrolled in course before adding activity.')
        try:
            with self.conn:
                self.conn.execute(
                    'INSERT INTO activities VALUES (?, ?, ?, ?, ?)',
                    (code, student_code, course_code, title, score_val),
                )
        except sqlite3.IntegrityError as exc:
            raise ValueError('Duplicate activity code.') from exc

    def list_activities(self):
        return self.conn.execute(
            'SELECT code, student_code, course_code, title, score FROM activities ORDER BY code'
        ).fetchall()

    def close(self):
        self.conn.close()


if __name__ == '__main__':
    registry = Registry()
    registry.add('DEMO-0001', 'Estudante Ficticio')
    registry.add_course('COURSE-01', 'Engenharia de Software SDD', 60)
    registry.enroll('DEMO-0001', 'COURSE-01', '2026.1')
    registry.add_activity('ACT-0001', 'DEMO-0001', 'COURSE-01', 'Laboratorio SDD', 95.0)
    print(registry.list())
    registry.close()
