SELECT s.student_id, e.section_id
FROM enrollments AS e
RIGHT JOIN students AS s ON s.student_id = e.student_id
WHERE s.student_id >= 107
ORDER BY s.student_id, e.section_id;
