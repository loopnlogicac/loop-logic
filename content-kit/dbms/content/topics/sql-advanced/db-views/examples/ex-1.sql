CREATE SQL SECURITY INVOKER VIEW student_directory AS
SELECT student_id, student_name, department_id FROM students;
SELECT student_id, student_name FROM student_directory
WHERE department_id = 2 ORDER BY student_id;
