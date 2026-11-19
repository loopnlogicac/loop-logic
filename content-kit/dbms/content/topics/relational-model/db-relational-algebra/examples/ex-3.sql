SELECT s.student_id AS sid, c.course_id AS cid
FROM students AS s CROSS JOIN courses AS c
WHERE s.student_id <= 102 AND c.course_id <= 22
ORDER BY sid, cid;
