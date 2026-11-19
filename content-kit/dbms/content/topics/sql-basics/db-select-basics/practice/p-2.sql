SELECT student_id, student_name FROM students WHERE hometown IS NULL ORDER BY student_id;
SELECT DISTINCT hometown FROM students WHERE hometown IS NOT NULL ORDER BY hometown;
