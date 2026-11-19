SELECT section_id, student_id, marks,
    ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY marks DESC, student_id) AS position
FROM results ORDER BY section_id, position;
