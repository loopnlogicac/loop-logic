CREATE SQL SECURITY INVOKER VIEW member_directory AS
SELECT member_id, member_name FROM members;
SELECT member_id, member_name FROM member_directory ORDER BY member_id;
INSERT INTO members VALUES (5, 'Maliha Noor', '2026-03-01', NULL);
SELECT member_id, member_name FROM member_directory ORDER BY member_id;
