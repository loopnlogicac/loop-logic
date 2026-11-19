SELECT section_id, student_id FROM (
    SELECT section_id, student_id,
        ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY marks DESC, student_id) AS pos
    FROM results
) AS ranked WHERE pos = 1 ORDER BY section_id;
START TRANSACTION;
DELETE FROM results;
SELECT section_id, student_id FROM (
    SELECT section_id, student_id,
        ROW_NUMBER() OVER (PARTITION BY section_id ORDER BY marks DESC, student_id) AS pos
    FROM results
) AS ranked WHERE pos = 1 ORDER BY section_id;
ROLLBACK;
