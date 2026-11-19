SELECT department_id, COUNT(*) AS students, COUNT(hometown) AS known_towns
FROM students GROUP BY department_id ORDER BY department_id;
SELECT COUNT(*) AS n, AVG(marks) AS mean_mark FROM results WHERE section_id = 36;
