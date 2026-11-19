SELECT department_id, COUNT(DISTINCT hometown) AS towns FROM students
WHERE hometown IS NOT NULL GROUP BY department_id
HAVING COUNT(DISTINCT hometown) >= 2 ORDER BY department_id;
SELECT COUNT(*) AS n FROM students WHERE department_id = 99;
