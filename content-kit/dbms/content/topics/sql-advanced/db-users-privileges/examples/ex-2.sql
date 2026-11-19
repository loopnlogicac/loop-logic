CREATE USER 'llk_b2_reader'@'localhost' IDENTIFIED BY 'B2-reader-demo-482!';
SET @privilege_sql = CONCAT('GRANT SELECT ON `', DATABASE(),
    '`.students TO \'llk_b2_reader\'@\'localhost\'');
PREPARE privilege_stmt FROM @privilege_sql;
EXECUTE privilege_stmt;
DEALLOCATE PREPARE privilege_stmt;
SELECT privilege_type FROM information_schema.table_privileges
WHERE grantee = '''llk_b2_reader''@''localhost'''
    AND table_schema = DATABASE() AND table_name = 'students'
ORDER BY privilege_type;
SET @privilege_sql = CONCAT('REVOKE SELECT ON `', DATABASE(),
    '`.students FROM \'llk_b2_reader\'@\'localhost\'');
PREPARE privilege_stmt FROM @privilege_sql;
EXECUTE privilege_stmt;
DEALLOCATE PREPARE privilege_stmt;
SELECT privilege_type FROM information_schema.table_privileges
WHERE grantee = '''llk_b2_reader''@''localhost'''
    AND table_schema = DATABASE() AND table_name = 'students'
ORDER BY privilege_type;
DROP USER 'llk_b2_reader'@'localhost';
