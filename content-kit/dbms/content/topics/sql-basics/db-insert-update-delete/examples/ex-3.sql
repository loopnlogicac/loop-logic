START TRANSACTION;
DELETE FROM order_items WHERE order_id = 204 AND product_id = 2;
SELECT COUNT(*) AS items_left FROM order_items WHERE order_id = 204;
ROLLBACK;
SELECT COUNT(*) AS items_restored FROM order_items WHERE order_id = 204;
