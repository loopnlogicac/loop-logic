SELECT r.student_id, r.section_id, r.marks FROM results AS r
WHERE r.marks >
    (SELECT AVG(x.marks) FROM results AS x WHERE x.section_id = r.section_id)
ORDER BY r.section_id, r.student_id;
