SELECT student_id, section_id, marks FROM results
WHERE marks BETWEEN 39 AND 40 ORDER BY student_id, section_id;
SELECT COUNT(*) AS n FROM results WHERE marks BETWEEN 101 AND 110;
