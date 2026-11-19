CREATE TABLE student_interests (
    student_id INT NOT NULL,
    interest VARCHAR(40) NOT NULL,
    PRIMARY KEY (student_id, interest),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO student_interests VALUES (101, 'Chess'), (101, 'Reading');
SELECT student_id, interest FROM student_interests ORDER BY student_id, interest;
SELECT COUNT(*) AS interests FROM student_interests WHERE student_id = 108;
