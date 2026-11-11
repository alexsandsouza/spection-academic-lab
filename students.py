"""FEAT-001: synthetic student registry."""
import sqlite3
import re

class Registry:
    def __init__(self, db=':memory:'):
        self.conn = sqlite3.connect(db)
        self.conn.execute('CREATE TABLE IF NOT EXISTS students (code TEXT PRIMARY KEY, name TEXT NOT NULL)')
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
    def close(self):
        self.conn.close()

if __name__ == '__main__':
    registry = Registry()
    registry.add('DEMO-0001', 'Estudante Ficticio')
    print(registry.list())
    registry.close()
