SELECT section_id, enrolled, remaining_seats FROM section_overview
WHERE section_id=36 ORDER BY section_id;
CALL register_student(108,36);
SELECT section_id, enrolled, remaining_seats FROM section_overview
WHERE section_id=36 ORDER BY section_id;
SELECT student_id, section_id, enrolled_on FROM enrollments
WHERE student_id=108 ORDER BY section_id;
