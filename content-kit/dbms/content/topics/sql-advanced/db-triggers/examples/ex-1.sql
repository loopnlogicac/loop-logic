DELIMITER //
CREATE TRIGGER trim_member_name BEFORE INSERT ON members FOR EACH ROW
BEGIN
    SET NEW.member_name = TRIM(NEW.member_name);
END//
DELIMITER ;
INSERT INTO members VALUES (5, '  Maliha Noor  ', '2026-03-01', NULL);
SELECT member_id, member_name FROM members WHERE member_id = 5 ORDER BY member_id;
