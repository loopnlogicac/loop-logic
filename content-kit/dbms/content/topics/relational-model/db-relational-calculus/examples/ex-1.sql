SELECT s.student_id FROM students AS s
WHERE EXISTS (
    SELECT 1 FROM results AS r WHERE r.student_id = s.student_id AND r.marks >= 80
) ORDER BY s.student_id;
