SELECT e.student_id, e.section_id FROM enrollments AS e
WHERE NOT EXISTS (SELECT 1 FROM results AS r
    WHERE r.student_id = e.student_id AND r.section_id = e.section_id)
ORDER BY e.student_id, e.section_id;
START TRANSACTION;
DELETE FROM results;
SELECT e.student_id, e.section_id FROM enrollments AS e
WHERE NOT EXISTS (SELECT 1 FROM results AS r
    WHERE r.student_id = e.student_id AND r.section_id = e.section_id)
ORDER BY e.student_id, e.section_id;
ROLLBACK;
