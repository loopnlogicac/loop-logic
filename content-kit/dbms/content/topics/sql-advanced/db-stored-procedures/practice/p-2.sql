DELIMITER //
CREATE FUNCTION pass_label(p_marks INT) RETURNS VARCHAR(12)
DETERMINISTIC NO SQL SQL SECURITY INVOKER
BEGIN
    IF p_marks IS NULL THEN
        RETURN 'pending';
    ELSEIF p_marks >= 40 THEN
        RETURN 'pass';
    END IF;
    RETURN 'fail';
END//
DELIMITER ;
SELECT pass_label(39) AS label ORDER BY label;
SELECT pass_label(40) AS label, pass_label(NULL) AS missing_label ORDER BY label;
