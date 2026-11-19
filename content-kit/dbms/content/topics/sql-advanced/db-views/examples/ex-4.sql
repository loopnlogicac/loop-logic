CREATE SQL SECURITY INVOKER VIEW available_products AS
SELECT product_id, product_name, stock FROM products WHERE stock > 0;
START TRANSACTION;
UPDATE products SET stock = 0 WHERE product_id = 1;
SELECT product_id FROM available_products ORDER BY product_id;
ROLLBACK;
SELECT product_id FROM available_products ORDER BY product_id;
