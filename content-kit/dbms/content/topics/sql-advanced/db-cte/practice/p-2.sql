CREATE TABLE teacher_links (
    teacher_id INT PRIMARY KEY,
    mentor_id INT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (mentor_id) REFERENCES teachers(teacher_id)
) ENGINE=InnoDB;
INSERT INTO teacher_links VALUES (11, NULL), (12, 11), (13, 12), (14, 11);
WITH RECURSIVE team AS (
    SELECT teacher_id, 0 AS depth FROM teacher_links WHERE teacher_id = 12
    UNION ALL
    SELECT c.teacher_id, p.depth + 1 FROM teacher_links AS c
    JOIN team AS p ON c.mentor_id = p.teacher_id WHERE p.depth < 10
)
SELECT teacher_id, depth FROM team ORDER BY depth, teacher_id;
WITH RECURSIVE team AS (
    SELECT teacher_id, 0 AS depth FROM teacher_links WHERE teacher_id = 14
    UNION ALL
    SELECT c.teacher_id, p.depth + 1 FROM teacher_links AS c
    JOIN team AS p ON c.mentor_id = p.teacher_id WHERE p.depth < 10
)
SELECT teacher_id, depth FROM team ORDER BY depth, teacher_id;
