CREATE TABLE result_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_marks INT,
    new_marks INT NOT NULL
) ENGINE=InnoDB;

CREATE VIEW section_overview AS
SELECT se.section_id, c.course_code, se.capacity,
    COALESCE(ec.enrolled, 0) AS enrolled,
    se.capacity - COALESCE(ec.enrolled, 0) AS remaining_seats,
    COALESCE(rc.recorded, 0) AS recorded,
    COALESCE(ec.enrolled, 0) - COALESCE(rc.recorded, 0) AS pending,
    rc.mean_marks
FROM sections AS se
JOIN courses AS c ON c.course_id = se.course_id
LEFT JOIN (
    SELECT section_id, COUNT(*) AS enrolled
    FROM enrollments GROUP BY section_id
) AS ec ON ec.section_id = se.section_id
LEFT JOIN (
    SELECT section_id, COUNT(*) AS recorded, ROUND(AVG(marks), 2) AS mean_marks
    FROM results GROUP BY section_id
) AS rc ON rc.section_id = se.section_id;

DELIMITER //
CREATE PROCEDURE register_student(IN p_student INT, IN p_section INT)
SQL SECURITY DEFINER
BEGIN
    DECLARE seat_limit INT DEFAULT NULL;
    DECLARE used_seats INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
    SELECT capacity INTO seat_limit FROM sections
    WHERE section_id = p_section FOR UPDATE;
    IF seat_limit IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Section not found';
    END IF;
    SELECT COUNT(*) INTO used_seats FROM enrollments WHERE section_id = p_section;
    IF used_seats >= seat_limit THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Section is full';
    END IF;
    INSERT INTO enrollments (student_id, section_id, enrolled_on)
    VALUES (p_student, p_section, '2026-03-02');
    COMMIT;
END//
CREATE TRIGGER audit_result_insert AFTER INSERT ON results
FOR EACH ROW
BEGIN
    INSERT INTO result_audit (student_id, section_id, operation, old_marks, new_marks)
    VALUES (NEW.student_id, NEW.section_id, 'INSERT', NULL, NEW.marks);
END//
CREATE TRIGGER audit_result_update AFTER UPDATE ON results
FOR EACH ROW
BEGIN
    IF NOT (OLD.marks <=> NEW.marks) THEN
        INSERT INTO result_audit (student_id, section_id, operation, old_marks, new_marks)
        VALUES (NEW.student_id, NEW.section_id, 'UPDATE', OLD.marks, NEW.marks);
    END IF;
END//
DELIMITER ;
