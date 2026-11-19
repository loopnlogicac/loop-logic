SELECT e.student_id, c.course_code, s.section_label
FROM enrollments AS e
JOIN sections AS s ON s.section_id = e.section_id
JOIN courses AS c ON c.course_id = s.course_id
WHERE e.student_id = 101
ORDER BY c.course_code, s.section_id;
