START TRANSACTION;
INSERT INTO results (student_id, section_id, marks) VALUES (107,35,79);
UPDATE results SET marks=80 WHERE student_id=107 AND section_id=35;
UPDATE results SET marks=80 WHERE student_id=107 AND section_id=35;
SELECT audit_id, student_id, section_id, operation, old_marks, new_marks
FROM result_audit ORDER BY audit_id;
SELECT student_id, section_id, marks, grade, grade_point FROM results
WHERE student_id=107 AND section_id=35 ORDER BY student_id, section_id;
ROLLBACK;
SELECT COUNT(*) AS retained_audit_rows FROM result_audit;
