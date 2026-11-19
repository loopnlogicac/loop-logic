CREATE TABLE teacher_links (
    teacher_id INT PRIMARY KEY,
    mentor_id INT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (mentor_id) REFERENCES teachers(teacher_id)
) ENGINE=InnoDB;
INSERT INTO teacher_links VALUES (11, NULL), (12, 11), (13, 12), (14, 11);
UPDATE teacher_links SET mentor_id = 13 WHERE teacher_id = 11;
WITH RECURSIVE walk AS (
    SELECT teacher_id, CAST(CONCAT(',', teacher_id, ',') AS CHAR(200)) AS path, 0 AS depth
    FROM teacher_links WHERE teacher_id = 11
    UNION ALL
    SELECT child.teacher_id, CONCAT(parent.path, child.teacher_id, ','), parent.depth + 1
    FROM teacher_links AS child JOIN walk AS parent ON child.mentor_id = parent.teacher_id
    WHERE parent.depth < 10
        AND LOCATE(CONCAT(',', child.teacher_id, ','), parent.path) = 0
)
SELECT teacher_id, depth, path FROM walk ORDER BY depth, teacher_id;
