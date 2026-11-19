START TRANSACTION;
UPDATE products SET stock = stock - 1 WHERE product_id = 1;
SAVEPOINT first_item;
UPDATE products SET stock = stock - 2 WHERE product_id = 2;
ROLLBACK TO SAVEPOINT first_item;
RELEASE SAVEPOINT first_item;
COMMIT;
SELECT product_id, stock FROM products WHERE product_id IN (1, 2) ORDER BY product_id;
