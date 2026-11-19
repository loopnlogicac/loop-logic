START TRANSACTION;
INSERT INTO courses VALUES (26, 'CSE 300', 'Design', 3, 1);
SELECT c.course_id, COUNT(se.section_id) AS sections FROM courses AS c
LEFT JOIN sections AS se ON se.course_id = c.course_id
WHERE c.course_id = 26 GROUP BY c.course_id ORDER BY c.course_id;
ROLLBACK;
SELECT COUNT(*) AS courses_after_rollback FROM courses WHERE course_id = 26;
