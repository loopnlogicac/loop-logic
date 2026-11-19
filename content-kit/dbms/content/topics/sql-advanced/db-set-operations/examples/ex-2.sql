SELECT student_id FROM enrollments
INTERSECT SELECT student_id FROM results ORDER BY student_id;
SELECT DISTINCT e.student_id FROM enrollments AS e
WHERE EXISTS (SELECT 1 FROM results AS r WHERE r.student_id = e.student_id)
ORDER BY e.student_id;
