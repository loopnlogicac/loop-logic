SELECT student_id AS first_id FROM students ORDER BY student_id LIMIT 1;
SELECT student_id AS last_id FROM students ORDER BY student_id DESC LIMIT 1;
SELECT COUNT(*) AS n FROM students WHERE student_id < 0;
