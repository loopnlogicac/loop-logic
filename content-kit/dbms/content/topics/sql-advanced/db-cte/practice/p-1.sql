WITH enrolled AS (SELECT DISTINCT student_id FROM enrollments)
SELECT e.student_id FROM enrolled AS e
WHERE NOT EXISTS (SELECT 1 FROM results AS r WHERE r.student_id = e.student_id)
ORDER BY e.student_id;
START TRANSACTION;
DELETE FROM results;
WITH enrolled AS (SELECT DISTINCT student_id FROM enrollments)
SELECT e.student_id FROM enrolled AS e
WHERE NOT EXISTS (SELECT 1 FROM results AS r WHERE r.student_id = e.student_id)
ORDER BY e.student_id;
ROLLBACK;
