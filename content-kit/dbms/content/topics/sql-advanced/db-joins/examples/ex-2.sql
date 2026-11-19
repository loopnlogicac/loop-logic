SELECT s.student_id, COUNT(e.section_id) AS enrollment_count
FROM students AS s
LEFT JOIN enrollments AS e ON e.student_id = s.student_id
GROUP BY s.student_id
ORDER BY s.student_id;
