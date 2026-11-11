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
        for code, name in [('REAL-0001','Nome'),('DEMO-0001',''),('DEMO-0001','X'*81)]:
            with self.subTest(code=code, name=name):
                with self.assertRaises(ValueError):
                    self.r.add(code,name)
        self.assertEqual(self.r.list(), [])
    def test_RF003_duplicate(self):
        self.r.add('DEMO-0001','Nome A')
        with self.assertRaises(ValueError):
            self.r.add('demo-0001','Nome B')
        self.assertEqual(self.r.list(), [('DEMO-0001','Nome A')])
    def test_RF004_list(self):
        self.r.add('DEMO-0002','Nome B')
        self.r.add('DEMO-0001','Nome A')
        self.assertEqual(self.r.list(), [('DEMO-0001','Nome A'),('DEMO-0002','Nome B')])
    def test_RNF001_sql(self):
        self.r.add('DEMO-0001', "X'); DROP TABLE students;--")
        self.assertEqual(len(self.r.list()),1)

if __name__ == '__main__':
    unittest.main()
