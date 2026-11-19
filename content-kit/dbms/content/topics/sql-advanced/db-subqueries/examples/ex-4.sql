SELECT s.student_id, s.student_name FROM students AS s
WHERE NOT EXISTS
    (SELECT 1 FROM enrollments AS e WHERE e.student_id = s.student_id)
ORDER BY s.student_id;
