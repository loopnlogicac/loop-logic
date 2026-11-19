SELECT student_id, section_id FROM results
WHERE marks BETWEEN 60 AND 80 ORDER BY student_id, section_id;
SELECT student_id, section_id FROM results
WHERE marks >= 60 AND marks <= 80 ORDER BY student_id, section_id;
