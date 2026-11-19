SELECT s.student_id, r.section_id, r.marks
FROM students AS s JOIN results AS r
    ON s.student_id = r.student_id AND r.marks >= 80
ORDER BY s.student_id, r.section_id;
