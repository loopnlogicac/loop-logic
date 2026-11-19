START TRANSACTION;
DELETE FROM enrollments WHERE section_id = 31;
SELECT course_id, course_code, course_title FROM courses
WHERE course_id = 21 ORDER BY course_id;
SELECT COUNT(*) AS remaining_registrations FROM enrollments WHERE section_id = 31;
ROLLBACK;
