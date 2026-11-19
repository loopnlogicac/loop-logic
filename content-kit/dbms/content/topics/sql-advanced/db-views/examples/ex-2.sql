CREATE SQL SECURITY INVOKER VIEW cse_students AS
SELECT student_id, student_name, department_id FROM students
WHERE department_id = 1 WITH CASCADED CHECK OPTION;
UPDATE cse_students SET student_name = 'Ayesha R.' WHERE student_id = 101;
SELECT student_id, student_name FROM students WHERE student_id = 101 ORDER BY student_id;
