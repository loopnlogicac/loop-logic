START TRANSACTION;
UPDATE courses SET course_title = 'Database Systems' WHERE course_id = 21;
SELECT se.section_id, c.course_title FROM sections AS se
JOIN courses AS c ON c.course_id = se.course_id
WHERE c.course_id = 21 ORDER BY se.section_id;
ROLLBACK;
SELECT course_title FROM courses WHERE course_id = 21 ORDER BY course_id;
