SET SESSION sql_safe_updates = 1;
UPDATE products SET stock = stock + 1 WHERE product_id = 4;
SELECT product_id, stock FROM products WHERE product_id = 4 ORDER BY product_id;
