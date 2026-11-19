SELECT se.section_id, COUNT(e.student_id) AS n FROM sections AS se
LEFT JOIN enrollments AS e ON e.section_id=se.section_id
GROUP BY se.section_id ORDER BY se.section_id;
START TRANSACTION;
DELETE FROM enrollments;
SELECT se.section_id, COUNT(e.student_id) AS n FROM sections AS se
LEFT JOIN enrollments AS e ON e.section_id=se.section_id
GROUP BY se.section_id ORDER BY se.section_id;
ROLLBACK;
