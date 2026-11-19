CREATE TABLE scratch_notes (note_id INT PRIMARY KEY);
ALTER TABLE scratch_notes ADD note_text VARCHAR(20) NOT NULL DEFAULT '';
INSERT INTO scratch_notes VALUES (1, 'Ready');
SELECT note_id, note_text FROM scratch_notes ORDER BY note_id;
TRUNCATE TABLE scratch_notes;
SELECT COUNT(*) AS n FROM scratch_notes;
DROP TABLE scratch_notes;
