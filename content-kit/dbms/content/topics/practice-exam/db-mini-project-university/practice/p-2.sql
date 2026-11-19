START TRANSACTION;
UPDATE results SET marks=85 WHERE student_id=101 AND section_id=31;
UPDATE results SET marks=86 WHERE student_id=101 AND section_id=31;
SELECT operation, old_marks, new_marks FROM result_audit ORDER BY audit_id;
ROLLBACK;
SELECT COUNT(*) AS retained_events FROM result_audit;
