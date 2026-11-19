SELECT student_id, IFNULL(hometown, 'Unknown') AS town,
    COALESCE(hometown, 'Not supplied') AS town_label
FROM students WHERE student_id >= 106 ORDER BY student_id;
SELECT student_id, section_id,
    CASE WHEN marks >= 80 THEN 'Excellent' WHEN marks >= 40 THEN 'Pass' ELSE 'Fail' END AS band
FROM results WHERE student_id = 102 ORDER BY section_id;
