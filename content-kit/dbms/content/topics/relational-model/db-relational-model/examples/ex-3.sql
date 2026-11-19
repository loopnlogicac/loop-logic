START TRANSACTION;
UPDATE departments SET department_id = 9 WHERE department_id = 3;
SELECT student_id, department_id FROM students WHERE department_id = 9 ORDER BY student_id;
ROLLBACK;
