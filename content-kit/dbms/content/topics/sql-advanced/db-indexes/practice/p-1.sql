CREATE INDEX idx_return_due ON loans (returned_on, due_on);
SELECT loan_id FROM loans
WHERE returned_on IS NULL AND due_on < '2026-03-01' ORDER BY loan_id;
SELECT loan_id FROM loans
WHERE returned_on IS NULL AND due_on < '2026-01-01' ORDER BY loan_id;
