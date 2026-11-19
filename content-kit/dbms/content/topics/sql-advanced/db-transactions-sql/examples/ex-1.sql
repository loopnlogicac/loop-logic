START TRANSACTION;
UPDATE products SET stock = stock - 2 WHERE product_id = 1 AND stock >= 2;
COMMIT;
SELECT product_id, stock FROM products WHERE product_id = 1 ORDER BY product_id;
