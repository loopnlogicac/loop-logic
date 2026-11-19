CREATE INDEX idx_student_department_name ON students (department_id, student_name);
SELECT student_id, student_name FROM students
WHERE student_name = 'Rafi Ahmed' ORDER BY student_id;
SELECT student_id, student_name FROM students
WHERE department_id = 2 AND student_name = 'Rafi Ahmed' ORDER BY student_id;
