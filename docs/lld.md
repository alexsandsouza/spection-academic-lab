# LLD

Registry(db=':memory:'): create table students(code TEXT PRIMARY KEY, name TEXT NOT NULL).
add(code,name): trim, uppercase code, validate pattern and name length; parameterized INSERT in transaction; duplicate raises ValueError.
list(): SELECT ordered by code, return list of tuples.
close(): release database connection.
Errors: invalid input or duplicate raises ValueError. No fabricated approvals or test results.
