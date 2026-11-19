SELECT student_id FROM enrollments WHERE section_id = 31
UNION
SELECT student_id FROM enrollments WHERE section_id = 32
ORDER BY student_id;
SELECT DISTINCT a.student_id FROM enrollments AS a
WHERE a.section_id = 31 AND EXISTS (
    SELECT 1 FROM enrollments AS b WHERE b.section_id = 33 AND b.student_id = a.student_id
) ORDER BY a.student_id;
SELECT DISTINCT a.student_id FROM enrollments AS a
WHERE a.section_id = 33 AND NOT EXISTS (
    SELECT 1 FROM enrollments AS b WHERE b.section_id = 31 AND b.student_id = a.student_id
) ORDER BY a.student_id;
