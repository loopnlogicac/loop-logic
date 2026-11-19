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
UPDATE results SET marks = 41 WHERE student_id = 102 AND section_id = 34;
SELECT student_id, section_id, old_marks, new_marks FROM mark_audit ORDER BY audit_id;
SELECT student_id, marks, grade FROM results
WHERE student_id = 102 AND section_id = 34 ORDER BY student_id;
