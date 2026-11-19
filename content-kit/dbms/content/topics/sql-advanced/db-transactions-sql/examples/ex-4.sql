SELECT @@session.autocommit AS autocommit_mode ORDER BY autocommit_mode;
SET autocommit = 0;
UPDATE products SET stock = 7 WHERE product_id = 4;
ROLLBACK;
SET autocommit = 1;
SELECT product_id, stock FROM products WHERE product_id = 4 ORDER BY product_id;
