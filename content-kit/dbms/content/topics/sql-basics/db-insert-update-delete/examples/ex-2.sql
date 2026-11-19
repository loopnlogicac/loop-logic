SELECT product_id, price_bdt FROM products WHERE product_id = 1 ORDER BY product_id;
START TRANSACTION;
UPDATE products SET price_bdt = 65.00 WHERE product_id = 1;
SELECT product_id, price_bdt FROM products WHERE product_id = 1 ORDER BY product_id;
ROLLBACK;
