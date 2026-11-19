CREATE TABLE study_groups (group_id INT PRIMARY KEY, group_name VARCHAR(30) NOT NULL);
ALTER TABLE study_groups ADD capacity INT NOT NULL DEFAULT 10;
INSERT INTO study_groups (group_id, group_name) VALUES (1, 'Database Circle');
SELECT group_id, group_name, capacity FROM study_groups ORDER BY group_id;
