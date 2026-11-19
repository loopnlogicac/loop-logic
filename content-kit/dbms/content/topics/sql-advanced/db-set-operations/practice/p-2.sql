SELECT student_id FROM students
EXCEPT SELECT student_id FROM enrollments ORDER BY student_id;
START TRANSACTION;
DELETE FROM enrollments;
SELECT student_id FROM students
EXCEPT SELECT student_id FROM enrollments ORDER BY student_id;
ROLLBACK;
