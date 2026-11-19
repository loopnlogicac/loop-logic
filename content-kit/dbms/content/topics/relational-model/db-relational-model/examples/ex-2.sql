START TRANSACTION;
DELETE FROM students WHERE student_id = 106;
SELECT COUNT(*) AS remaining FROM enrollments WHERE student_id = 106;
ROLLBACK;
SELECT COUNT(*) AS restored FROM enrollments WHERE student_id = 106;
