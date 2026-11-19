WITH mark_totals AS (
    SELECT student_id, COUNT(*) AS recorded, SUM(marks) AS total_marks
    FROM results GROUP BY student_id
)
SELECT student_id, recorded, total_marks FROM mark_totals ORDER BY student_id;
