SELECT s.student_id FROM students AS s
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments AS e WHERE e.student_id = s.student_id
    AND NOT EXISTS (
        SELECT 1 FROM results AS r
        WHERE r.student_id = e.student_id AND r.section_id = e.section_id
    )
) ORDER BY s.student_id;
