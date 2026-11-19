SELECT student_id, admitted_on FROM students
WHERE admitted_on >= '2025-01-01' AND admitted_on < '2026-01-01'
ORDER BY student_id;
SELECT student_id, admitted_on FROM students
WHERE YEAR(admitted_on) = 2025 ORDER BY student_id;
