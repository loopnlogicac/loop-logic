START TRANSACTION;
UPDATE products SET stock = stock + 5 WHERE product_id = 4;
SELECT product_id, stock FROM products WHERE product_id = 4 ORDER BY product_id;
ROLLBACK;
SELECT product_id, stock FROM products WHERE product_id = 4 ORDER BY product_id;
