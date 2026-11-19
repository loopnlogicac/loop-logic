SELECT e.student_id, r.marks FROM enrollments AS e
LEFT JOIN results AS r ON e.student_id = r.student_id AND e.section_id = r.section_id
WHERE e.section_id = 35 ORDER BY e.student_id;
