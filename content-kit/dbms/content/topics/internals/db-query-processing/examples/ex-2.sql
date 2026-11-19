EXPLAIN FORMAT=TREE SELECT e.student_id, s.student_name FROM enrollments AS e
JOIN students AS s ON s.student_id = e.student_id
WHERE e.section_id = 31 ORDER BY e.student_id;
SELECT e.student_id, s.student_name FROM enrollments AS e
JOIN students AS s ON s.student_id = e.student_id
WHERE e.section_id = 31 ORDER BY e.student_id;
