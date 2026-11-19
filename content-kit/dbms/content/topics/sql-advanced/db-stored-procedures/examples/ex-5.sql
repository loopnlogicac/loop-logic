DELIMITER //
CREATE PROCEDURE add_credit(INOUT p_value DECIMAL(10,2), IN p_extra DECIMAL(10,2))
SQL SECURITY INVOKER
BEGIN
    SET p_value = p_value + p_extra;
END//
DELIMITER ;
SET @credit = 20.00;
CALL add_credit(@credit, 15.00);
SELECT @credit AS credit_bdt ORDER BY credit_bdt;
