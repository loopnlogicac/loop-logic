CREATE SQL SECURITY DEFINER VIEW public_students AS
SELECT student_id, student_name FROM students;
CREATE USER 'llk_b2_reader'@'localhost' IDENTIFIED BY 'B2-reader-demo-482!';
SET @privilege_sql = CONCAT('GRANT SELECT ON `', DATABASE(),
    '`.public_students TO \'llk_b2_reader\'@\'localhost\'');
PREPARE privilege_stmt FROM @privilege_sql;
EXECUTE privilege_stmt;
DEALLOCATE PREPARE privilege_stmt;
SELECT table_name, privilege_type FROM information_schema.table_privileges
WHERE grantee = '''llk_b2_reader''@''localhost''' AND table_schema = DATABASE()
ORDER BY table_name, privilege_type;
DROP USER 'llk_b2_reader'@'localhost';
