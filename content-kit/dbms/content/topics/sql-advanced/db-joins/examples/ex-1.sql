SELECT s.student_id, s.student_name, d.department_code
FROM students AS s
INNER JOIN departments AS d ON d.department_id = s.department_id
ORDER BY s.student_id;
