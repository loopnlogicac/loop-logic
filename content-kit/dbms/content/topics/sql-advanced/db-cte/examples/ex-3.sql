CREATE TABLE teacher_links (
    teacher_id INT PRIMARY KEY,
    mentor_id INT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (mentor_id) REFERENCES teachers(teacher_id)
) ENGINE=InnoDB;
INSERT INTO teacher_links VALUES (11, NULL), (12, 11), (13, 12), (14, 11);
WITH RECURSIVE team AS (
    SELECT teacher_id, mentor_id, 0 AS depth FROM teacher_links WHERE mentor_id IS NULL
    UNION ALL
    SELECT child.teacher_id, child.mentor_id, parent.depth + 1
    FROM teacher_links AS child JOIN team AS parent ON child.mentor_id = parent.teacher_id
    WHERE parent.depth < 10
)
SELECT team.teacher_id, t.teacher_name, team.depth
FROM team JOIN teachers AS t ON t.teacher_id = team.teacher_id
ORDER BY team.depth, team.teacher_id;
