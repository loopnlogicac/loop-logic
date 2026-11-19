SELECT r.student_id,
    ROUND(SUM(r.grade_point * c.credits) / SUM(c.credits), 2) AS cgpa
FROM results AS r
JOIN sections AS s ON s.section_id = r.section_id
JOIN courses AS c ON c.course_id = s.course_id
GROUP BY r.student_id ORDER BY r.student_id;
