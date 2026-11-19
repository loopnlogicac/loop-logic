CREATE TABLE lockers (
    locker_id INT PRIMARY KEY,
    student_id INT UNIQUE,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO lockers VALUES (1, 101), (2, NULL);
SELECT locker_id, student_id FROM lockers ORDER BY locker_id;
SELECT COUNT(*) AS assignments FROM lockers WHERE student_id = 108;
