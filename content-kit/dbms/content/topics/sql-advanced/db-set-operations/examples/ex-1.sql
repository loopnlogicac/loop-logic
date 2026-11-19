SELECT department_id FROM students
UNION SELECT department_id FROM teachers ORDER BY department_id;
SELECT department_id FROM students
UNION ALL SELECT department_id FROM teachers ORDER BY department_id;
