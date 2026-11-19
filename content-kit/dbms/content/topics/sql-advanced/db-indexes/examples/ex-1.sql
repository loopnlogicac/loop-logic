CREATE INDEX idx_student_department_name ON students (department_id, student_name);
SELECT student_id, student_name FROM students
WHERE department_id = 1 ORDER BY student_name, student_id;
