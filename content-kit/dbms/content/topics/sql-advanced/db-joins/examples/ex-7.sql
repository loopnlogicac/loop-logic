SELECT s.student_id, r.marks
FROM students AS s LEFT JOIN results AS r
    ON r.student_id = s.student_id AND r.marks >= 80
WHERE s.student_id >= 106
ORDER BY s.student_id, r.section_id;
SELECT s.student_id, r.marks
FROM students AS s LEFT JOIN results AS r ON r.student_id = s.student_id
WHERE s.student_id >= 106 AND r.marks >= 80
ORDER BY s.student_id, r.section_id;
