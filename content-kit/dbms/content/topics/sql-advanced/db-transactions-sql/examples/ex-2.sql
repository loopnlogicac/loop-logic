START TRANSACTION;
UPDATE results SET marks = 100 WHERE student_id = 106 AND section_id = 32;
SELECT marks, grade FROM results WHERE student_id = 106 AND section_id = 32 ORDER BY marks;
ROLLBACK;
SELECT marks, grade FROM results WHERE student_id = 106 AND section_id = 32 ORDER BY marks;
