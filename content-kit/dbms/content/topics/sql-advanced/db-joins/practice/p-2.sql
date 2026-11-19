SELECT b.book_id, b.title FROM books AS b
LEFT JOIN loans AS l ON l.book_id = b.book_id
WHERE l.loan_id IS NULL ORDER BY b.book_id;
START TRANSACTION;
DELETE FROM loans;
SELECT b.book_id, b.title FROM books AS b
LEFT JOIN loans AS l ON l.book_id = b.book_id
WHERE l.loan_id IS NULL ORDER BY b.book_id;
ROLLBACK;
