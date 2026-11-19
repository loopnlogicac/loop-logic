SELECT student_id, section_id, marks FROM results
WHERE (student_id, section_id) IN
    (SELECT student_id, section_id FROM enrollments WHERE section_id = 31)
ORDER BY student_id, section_id;
