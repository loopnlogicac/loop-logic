SELECT section_id, student_id, marks FROM (
    SELECT section_id, student_id, marks,
        RANK() OVER (PARTITION BY section_id ORDER BY marks DESC) AS place
    FROM results
) AS ranked WHERE place = 1 ORDER BY section_id, student_id;
