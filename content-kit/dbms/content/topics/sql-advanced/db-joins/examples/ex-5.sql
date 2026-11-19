SELECT e.student_id, e.section_id, r.marks
FROM enrollments AS e
LEFT JOIN results AS r
    ON r.student_id = e.student_id AND r.section_id = e.section_id
UNION ALL
SELECT r.student_id, r.section_id, r.marks
FROM results AS r
LEFT JOIN enrollments AS e
    ON e.student_id = r.student_id AND e.section_id = r.section_id
WHERE e.student_id IS NULL
ORDER BY student_id, section_id;
