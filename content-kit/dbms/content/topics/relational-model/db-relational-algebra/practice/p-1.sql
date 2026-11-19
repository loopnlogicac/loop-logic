SELECT e.student_id FROM enrollments AS e
WHERE e.section_id = 33 AND NOT EXISTS (
    SELECT 1 FROM enrollments AS other
    WHERE other.section_id = 31 AND other.student_id = e.student_id
) ORDER BY e.student_id;
SELECT COUNT(*) AS n FROM enrollments WHERE section_id = 36;
