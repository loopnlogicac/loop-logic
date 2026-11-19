CREATE TABLE mark_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    old_marks INT NOT NULL,
    new_marks INT NOT NULL
) ENGINE=InnoDB;
DELIMITER //
CREATE TRIGGER audit_mark_update AFTER UPDATE ON results FOR EACH ROW
BEGIN
    IF NOT (OLD.marks <=> NEW.marks) THEN
        INSERT INTO mark_audit (student_id, section_id, old_marks, new_marks)
        VALUES (NEW.student_id, NEW.section_id, OLD.marks, NEW.marks);
    END IF;
END//
DELIMITER ;
START TRANSACTION;
UPDATE results SET marks = 45 WHERE student_id = 106 AND section_id = 32;
ROLLBACK;
SELECT COUNT(*) AS n FROM mark_audit;
SELECT marks FROM results WHERE student_id = 106 AND section_id = 32 ORDER BY marks;
START TRANSACTION;
UPDATE results SET marks = 45 WHERE student_id = 106 AND section_id = 32;
COMMIT;
SELECT COUNT(*) AS n FROM mark_audit;
SELECT marks FROM results WHERE student_id = 106 AND section_id = 32 ORDER BY marks;
