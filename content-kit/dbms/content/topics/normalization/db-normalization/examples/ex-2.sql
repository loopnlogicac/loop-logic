START TRANSACTION;
UPDATE departments SET department_name = 'CSE renamed' WHERE department_id = 1;
SELECT e.student_id, e.section_id, d.department_name
FROM enrollments AS e
JOIN students AS s ON s.student_id = e.student_id
JOIN departments AS d ON d.department_id = s.department_id
WHERE e.student_id = 101 ORDER BY e.section_id;
ROLLBACK;
