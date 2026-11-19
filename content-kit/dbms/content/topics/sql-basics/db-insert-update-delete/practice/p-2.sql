INSERT INTO customers (customer_id, customer_name, city) VALUES (6, 'Reza Alam', 'Dhaka');
SELECT customer_id, customer_name, phone FROM customers WHERE customer_id = 6 ORDER BY customer_id;
DELETE FROM customers WHERE customer_id = 999;
SELECT COUNT(*) AS n FROM customers WHERE customer_id = 6;
DELETE FROM customers WHERE customer_id = 6;
SELECT COUNT(*) AS n FROM customers WHERE customer_id = 6;
