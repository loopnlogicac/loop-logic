CREATE USER 'llk_b2_reader'@'localhost' IDENTIFIED BY 'B2-reader-demo-482!';
SET @privilege_sql = CONCAT('GRANT UPDATE (hometown) ON `', DATABASE(),
    '`.students TO \'llk_b2_reader\'@\'localhost\'');
PREPARE privilege_stmt FROM @privilege_sql;
EXECUTE privilege_stmt;
DEALLOCATE PREPARE privilege_stmt;
SELECT column_name, privilege_type FROM information_schema.column_privileges
WHERE grantee = '''llk_b2_reader''@''localhost''' AND table_schema = DATABASE() ORDER BY
    column_name, privilege_type;
SET @privilege_sql = CONCAT('REVOKE UPDATE (hometown) ON `', DATABASE(),
    '`.students FROM \'llk_b2_reader\'@\'localhost\'');
PREPARE privilege_stmt FROM @privilege_sql;
EXECUTE privilege_stmt;
DEALLOCATE PREPARE privilege_stmt;
SELECT column_name, privilege_type FROM information_schema.column_privileges
WHERE grantee = '''llk_b2_reader''@''localhost''' AND table_schema = DATABASE() ORDER BY
    column_name, privilege_type;
DROP USER 'llk_b2_reader'@'localhost';
