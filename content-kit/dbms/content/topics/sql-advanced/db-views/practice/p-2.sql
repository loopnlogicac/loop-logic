CREATE SQL SECURITY INVOKER VIEW stocked AS
SELECT product_id, stock FROM products WHERE stock > 0 WITH CHECK OPTION;
SELECT product_id, stock FROM stocked WHERE product_id = 4 ORDER BY product_id;
UPDATE products SET stock = 3 WHERE product_id = 4;
SELECT product_id, stock FROM stocked WHERE product_id = 4 ORDER BY product_id;
