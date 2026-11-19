SELECT section_id, pending FROM section_overview
WHERE section_id IN (35,36) ORDER BY section_id;
START TRANSACTION;
INSERT INTO results (student_id,section_id,marks) VALUES (107,35,40);
SELECT section_id, pending FROM section_overview
WHERE section_id IN (35,36) ORDER BY section_id;
ROLLBACK;
