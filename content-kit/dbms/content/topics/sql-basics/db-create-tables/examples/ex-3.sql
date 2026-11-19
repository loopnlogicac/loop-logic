CREATE TABLE spare_labels (label_id INT AUTO_INCREMENT PRIMARY KEY, label_text VARCHAR(30));
INSERT INTO spare_labels (label_text) VALUES ('old');
TRUNCATE TABLE spare_labels;
INSERT INTO spare_labels (label_text) VALUES ('new');
SELECT label_id, label_text FROM spare_labels ORDER BY label_id;
DROP TABLE spare_labels;
SELECT COUNT(*) AS tables_left FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'spare_labels';
