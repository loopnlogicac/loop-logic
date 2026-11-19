SELECT member_id, COALESCE(email, 'Not supplied') AS contact FROM members ORDER BY member_id;
SELECT COUNT(*) AS n FROM members WHERE email LIKE 'z%';
