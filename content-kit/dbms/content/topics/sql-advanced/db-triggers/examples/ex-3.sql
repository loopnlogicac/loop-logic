CREATE TABLE loan_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    action_name VARCHAR(10) NOT NULL,
    loan_id INT NOT NULL
) ENGINE=InnoDB;
CREATE TRIGGER loan_insert AFTER INSERT ON loans FOR EACH ROW
    INSERT INTO loan_events (action_name, loan_id) VALUES ('insert', NEW.loan_id);
CREATE TRIGGER loan_delete AFTER DELETE ON loans FOR EACH ROW
    INSERT INTO loan_events (action_name, loan_id) VALUES ('delete', OLD.loan_id);
INSERT INTO loans VALUES (406, 5, 4, '2026-03-01', '2026-03-15', NULL);
DELETE FROM loans WHERE loan_id = 406;
SELECT action_name, loan_id FROM loan_events ORDER BY event_id;
