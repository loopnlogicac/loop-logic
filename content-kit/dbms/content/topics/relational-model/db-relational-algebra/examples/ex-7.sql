SELECT s.student_id FROM students AS s
WHERE NOT EXISTS (
    SELECT 1 FROM sections AS required
    WHERE required.section_id IN (31, 33) AND NOT EXISTS (
        SELECT 1 FROM enrollments AS e
        WHERE e.student_id = s.student_id AND e.section_id = required.section_id
    )
) ORDER BY s.student_id;
