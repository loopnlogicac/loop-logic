CREATE INDEX ix_dept_home ON students(department_id, hometown);
EXPLAIN SELECT department_id, hometown, student_id FROM students
WHERE department_id = 1 ORDER BY hometown, student_id;
SELECT department_id, hometown, student_id FROM students
WHERE department_id = 1 ORDER BY hometown, student_id;
SELECT department_id, hometown, student_id FROM students
WHERE department_id = 99 ORDER BY hometown, student_id;
