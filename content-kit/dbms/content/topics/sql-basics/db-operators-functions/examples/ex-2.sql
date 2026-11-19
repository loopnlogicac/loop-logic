SELECT student_id, section_id, marks FROM results
WHERE marks BETWEEN 75 AND 80 ORDER BY marks, student_id, section_id;
