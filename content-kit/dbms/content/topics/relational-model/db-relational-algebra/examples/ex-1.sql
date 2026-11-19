SELECT DISTINCT hometown FROM students
WHERE department_id = 1 AND hometown IS NOT NULL ORDER BY hometown;
