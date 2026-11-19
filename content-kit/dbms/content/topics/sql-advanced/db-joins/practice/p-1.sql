SELECT d.department_code, COUNT(s.student_id) AS students
FROM departments AS d LEFT JOIN students AS s ON s.department_id = d.department_id
GROUP BY d.department_id, d.department_code ORDER BY d.department_code;
START TRANSACTION;
DELETE FROM students WHERE student_id = 108;
SELECT d.department_code, COUNT(s.student_id) AS students
FROM departments AS d LEFT JOIN students AS s ON s.department_id = d.department_id
GROUP BY d.department_id, d.department_code ORDER BY d.department_code;
ROLLBACK;
