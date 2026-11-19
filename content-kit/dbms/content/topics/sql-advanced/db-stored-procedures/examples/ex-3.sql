DELIMITER //
CREATE PROCEDURE sum_steps(IN p_limit INT, OUT p_total INT)
SQL SECURITY INVOKER
BEGIN
    DECLARE v_step INT DEFAULT 1;
    SET p_total = 0;
    IF p_limit IS NULL OR p_limit < 0 OR p_limit > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'limit must be between 0 and 100';
    END IF;
    WHILE v_step <= p_limit DO
        SET p_total = p_total + v_step;
        SET v_step = v_step + 1;
    END WHILE;
END//
DELIMITER ;
CALL sum_steps(4, @total);
SELECT @total AS total ORDER BY total;
