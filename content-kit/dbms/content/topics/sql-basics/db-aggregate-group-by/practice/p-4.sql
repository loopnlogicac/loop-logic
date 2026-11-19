SELECT ROUND(AVG(r.grade_point), 2) AS simple_mean,
    ROUND(SUM(r.grade_point * c.credits) / SUM(c.credits), 2) AS weighted_mean
FROM results AS r JOIN sections AS s ON s.section_id = r.section_id
JOIN courses AS c ON c.course_id = s.course_id WHERE r.student_id = 102;
SELECT COUNT(*) AS n FROM results WHERE student_id = 108;
