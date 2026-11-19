SELECT department_id, COUNT(*) AS students FROM students
GROUP BY department_id ORDER BY department_id;
