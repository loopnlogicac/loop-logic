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
SELECT student_id, section_id, marks, pass_label(marks) AS result_label
FROM results WHERE section_id = 34 ORDER BY student_id;
SELECT pass_label(NULL) AS pending_label ORDER BY pending_label;
