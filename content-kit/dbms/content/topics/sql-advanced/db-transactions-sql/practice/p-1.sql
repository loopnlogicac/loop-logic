START TRANSACTION;
INSERT INTO orders VALUES (206, 5, '2026-03-02', 'pending');
INSERT INTO order_items VALUES (206, 1, 1, 60.00);
SELECT COUNT(*) AS orders_found FROM orders WHERE order_id = 206;
ROLLBACK;
SELECT COUNT(*) AS orders_found FROM orders WHERE order_id = 206;
