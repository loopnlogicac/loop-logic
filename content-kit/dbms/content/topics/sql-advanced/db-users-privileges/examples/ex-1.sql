CREATE USER 'llk_b2_reader'@'localhost' IDENTIFIED BY 'B2-reader-demo-482!';
SELECT COUNT(*) AS table_grants FROM information_schema.table_privileges
WHERE grantee = '''llk_b2_reader''@''localhost''' AND table_schema = DATABASE();
DROP USER 'llk_b2_reader'@'localhost';
