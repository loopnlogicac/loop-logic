DELIMITER //
CREATE PROCEDURE count_registrations(IN p_student_id INT, OUT p_count INT)
SQL SECURITY INVOKER
BEGIN
    SELECT COUNT(*) INTO p_count FROM enrollments WHERE student_id = p_student_id;
END//
DELIMITER ;
CALL count_registrations(101, @registrations);
SELECT @registrations AS registrations ORDER BY registrations;
CALL count_registrations(108, @registrations);
SELECT @registrations AS registrations ORDER BY registrations;
