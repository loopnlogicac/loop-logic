DELIMITER //
CREATE PROCEDURE result_status(IN p_student_id INT, OUT p_status VARCHAR(20))
SQL SECURITY INVOKER
BEGIN
    DECLARE v_count INT DEFAULT 0;
    SELECT COUNT(*) INTO v_count FROM results WHERE student_id = p_student_id;
    IF v_count = 0 THEN
        SET p_status = 'no results';
    ELSE
        SET p_status = 'recorded';
    END IF;
END//
DELIMITER ;
CALL result_status(107, @status);
SELECT @status AS result_status ORDER BY result_status;
