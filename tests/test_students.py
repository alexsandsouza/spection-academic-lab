import unittest
from students import Registry


class StudentTests(unittest.TestCase):
    def setUp(self):
        self.r = Registry()

    def tearDown(self):
        self.r.close()

    def test_RF001_create(self):
        self.r.add(' demo-0001 ', ' Estudante Ficticio ')
        self.assertEqual(self.r.list(), [('DEMO-0001', 'Estudante Ficticio')])

    def test_RF002_invalid(self):
        for code, name in [('REAL-0001', 'Nome'), ('DEMO-0001', ''), ('DEMO-0001', 'X' * 81)]:
            with self.subTest(code=code, name=name):
                with self.assertRaises(ValueError):
                    self.r.add(code, name)
        self.assertEqual(self.r.list(), [])

    def test_RF003_duplicate(self):
        self.r.add('DEMO-0001', 'Nome A')
        with self.assertRaises(ValueError):
            self.r.add('demo-0001', 'Nome B')
        self.assertEqual(self.r.list(), [('DEMO-0001', 'Nome A')])

    def test_RF004_list(self):
        self.r.add('DEMO-0002', 'Nome B')
        self.r.add('DEMO-0001', 'Nome A')
        self.assertEqual(self.r.list(), [('DEMO-0001', 'Nome A'), ('DEMO-0002', 'Nome B')])

    def test_RF005_courses(self):
        self.r.add_course(' course-01 ', ' Engenharia de Software ', 60)
        self.assertEqual(
            self.r.list_courses(), [('COURSE-01', 'Engenharia de Software', 60)]
        )
        with self.assertRaises(ValueError):
            self.r.add_course('course-01', 'Duplicada', 60)
        with self.assertRaises(ValueError):
            self.r.add_course('BAD-01', 'Valida', 60)
        with self.assertRaises(ValueError):
            self.r.add_course('COURSE-02', 'Valida', 10)

    def test_RF006_enrollments(self):
        self.r.add('DEMO-0001', 'Estudante A')
        self.r.add_course('COURSE-01', 'Arquitetura Limpa', 60)
        self.r.enroll(' demo-0001 ', ' course-01 ', '2026.1')
        self.assertEqual(
            self.r.list_enrollments(), [('DEMO-0001', 'COURSE-01', '2026.1')]
        )
        with self.assertRaises(ValueError):
            self.r.enroll('DEMO-0001', 'COURSE-01', '2026.1')
        with self.assertRaises(ValueError):
            self.r.enroll('DEMO-9999', 'COURSE-01', '2026.1')

    def test_RF007_activities(self):
        self.r.add('DEMO-0001', 'Estudante A')
        self.r.add_course('COURSE-01', 'Arquitetura Limpa', 60)
        self.r.enroll('DEMO-0001', 'COURSE-01', '2026.1')
        self.r.add_activity(
            ' act-0001 ', 'demo-0001', 'course-01', ' Projeto Pratico ', 92.5
        )
        self.assertEqual(
            self.r.list_activities(),
            [('ACT-0001', 'DEMO-0001', 'COURSE-01', 'Projeto Pratico', 92.5)],
        )
        with self.assertRaises(ValueError):
            self.r.add_activity('ACT-0002', 'DEMO-0001', 'COURSE-01', 'Nota Invalida', 105)
        with self.assertRaises(ValueError):
            self.r.add_activity('ACT-0003', 'DEMO-0002', 'COURSE-01', 'Sem Matricula', 80)

    def test_RNF001_sql(self):
        self.r.add('DEMO-0001', "X'); DROP TABLE students;--")
        self.assertEqual(len(self.r.list()), 1)


if __name__ == '__main__':
    unittest.main()
