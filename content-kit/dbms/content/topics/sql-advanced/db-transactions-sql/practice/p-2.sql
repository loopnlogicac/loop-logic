START TRANSACTION;
UPDATE students SET hometown = 'Gazipur' WHERE student_id = 101;
SAVEPOINT town_edit;
UPDATE students SET hometown = 'Dhaka' WHERE student_id = 102;
ROLLBACK TO SAVEPOINT town_edit;
COMMIT;
SELECT student_id, hometown FROM students WHERE student_id IN (101, 102) ORDER BY student_id;
START TRANSACTION;
ROLLBACK;
