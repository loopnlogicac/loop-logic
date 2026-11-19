DELIMITER //
CREATE TRIGGER guard_stock BEFORE UPDATE ON products FOR EACH ROW
BEGIN
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'stock cannot be negative';
    END IF;
END//
CREATE TRIGGER guard_product_delete BEFORE DELETE ON products FOR EACH ROW
BEGIN
    IF OLD.stock > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'clear stock before deletion';
    END IF;
END//
DELIMITER ;
UPDATE products SET stock = 0 WHERE product_id = 6;
SELECT product_id, stock FROM products WHERE product_id = 6 ORDER BY product_id;
