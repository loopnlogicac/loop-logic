CREATE SQL SECURITY INVOKER VIEW enrollment_totals AS
SELECT student_id, COUNT(*) AS registrations FROM enrollments GROUP BY student_id;
SELECT student_id, registrations FROM enrollment_totals ORDER BY student_id;
