UPDATE results SET marks = 80 WHERE student_id = 101 AND section_id = 33;
SELECT student_id, marks,
    ROW_NUMBER() OVER (ORDER BY marks DESC, student_id) AS row_no,
    RANK() OVER (ORDER BY marks DESC) AS competition_rank,
    DENSE_RANK() OVER (ORDER BY marks DESC) AS dense_place
FROM results WHERE section_id = 33 ORDER BY row_no;
