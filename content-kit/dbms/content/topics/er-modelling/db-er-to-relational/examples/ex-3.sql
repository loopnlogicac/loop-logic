CREATE TABLE student_phones (
    student_id INT NOT NULL,
    phone_label VARCHAR(12) NOT NULL,
    phone_text VARCHAR(20) NOT NULL,
    PRIMARY KEY (student_id, phone_label),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO student_phones VALUES (101, 'home', 'test-home'), (101, 'mobile', 'test-mobile');
SELECT student_id, phone_label, phone_text FROM student_phones
ORDER BY student_id, phone_label;
