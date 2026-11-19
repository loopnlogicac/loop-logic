SELECT s.student_id FROM students AS s WHERE NOT EXISTS (
SELECT 1 FROM enrollments AS target JOIN sections AS ts ON ts.section_id=target.section_id
WHERE target.student_id=102 AND NOT EXISTS (SELECT 1 FROM enrollments AS own
JOIN sections AS os ON os.section_id=own.section_id
WHERE own.student_id=s.student_id AND os.course_id=ts.course_id)) ORDER BY s.student_id;
START TRANSACTION;
DELETE FROM enrollments WHERE student_id=102;
SELECT s.student_id FROM students AS s WHERE NOT EXISTS (
SELECT 1 FROM enrollments AS target JOIN sections AS ts ON ts.section_id=target.section_id
WHERE target.student_id=102 AND NOT EXISTS (SELECT 1 FROM enrollments AS own
JOIN sections AS os ON os.section_id=own.section_id
WHERE own.student_id=s.student_id AND os.course_id=ts.course_id)) ORDER BY s.student_id;
ROLLBACK;
