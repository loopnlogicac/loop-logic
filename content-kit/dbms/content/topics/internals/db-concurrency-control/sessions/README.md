# Two MySQL connections

Run each numbered command in the labelled connection, in this order.
The deadlock section sends A’s second UPDATE asynchronously, then sends B’s second UPDATE.
The server may choose a different deadlock victim on another run.

Initial state: accounts(id PRIMARY KEY, balance INT NOT NULL), InnoDB; (1,1000), (2,1000).

1. Session B

```sql
UPDATE accounts SET balance=1000 WHERE id=1;
```
Affected rows: 0.

2. Session A

```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```
Affected rows: 0.

3. Session A

```sql
START TRANSACTION;
```
Affected rows: 0.

4. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[1000]]
```

5. Session B

```sql
START TRANSACTION;
```
Affected rows: 0.

6. Session B

```sql
UPDATE accounts SET balance=900 WHERE id=1;
```
Affected rows: 1.

7. Session B

```sql
COMMIT;
```
Affected rows: 0.

8. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[1000]]
```

9. Session A

```sql
COMMIT;
```
Affected rows: 0.

10. Session B

```sql
UPDATE accounts SET balance=1000 WHERE id=1;
```
Affected rows: 1.

11. Session A

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```
Affected rows: 0.

12. Session A

```sql
START TRANSACTION;
```
Affected rows: 0.

13. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[1000]]
```

14. Session B

```sql
START TRANSACTION;
```
Affected rows: 0.

15. Session B

```sql
UPDATE accounts SET balance=900 WHERE id=1;
```
Affected rows: 1.

16. Session B

```sql
COMMIT;
```
Affected rows: 0.

17. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[900]]
```

18. Session A

```sql
COMMIT;
```
Affected rows: 0.

19. Session B

```sql
UPDATE accounts SET balance=1000 WHERE id=1;
```
Affected rows: 1.

20. Session A

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```
Affected rows: 0.

21. Session A

```sql
START TRANSACTION;
```
Affected rows: 0.

22. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[1000]]
```

23. Session B

```sql
START TRANSACTION;
```
Affected rows: 0.

24. Session B

```sql
UPDATE accounts SET balance=900 WHERE id=1;
```
Affected rows: 1.

25. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id;
```
```text
[[900]]
```

26. Session B

```sql
ROLLBACK;
```
Affected rows: 0.

27. Session A

```sql
COMMIT;
```
Affected rows: 0.

28. Session A

```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```
Affected rows: 0.

29. Session B

```sql
SET SESSION innodb_lock_wait_timeout=1;
```
Affected rows: 0.

30. Session A

```sql
START TRANSACTION;
```
Affected rows: 0.

31. Session A

```sql
SELECT balance FROM accounts WHERE id=1 ORDER BY id FOR UPDATE;
```
```text
[[1000]]
```

32. Session B

```sql
START TRANSACTION;
```
Affected rows: 0.

33. Session B

```sql
UPDATE accounts SET balance=800 WHERE id=1;
```
```text
ERROR 1205: Lock wait timeout exceeded; try restarting transaction
```

34. Session B

```sql
ROLLBACK;
```
Affected rows: 0.

35. Session A

```sql
COMMIT;
```
Affected rows: 0.

36. Session B

```sql
SET SESSION innodb_lock_wait_timeout=10;
```
Affected rows: 0.

37. Session A

```sql
START TRANSACTION;
```
Affected rows: 0.

38. Session B

```sql
START TRANSACTION;
```
Affected rows: 0.

39. Session A

```sql
UPDATE accounts SET balance=balance-10 WHERE id=1;
```
Affected rows: 1.

40. Session B

```sql
UPDATE accounts SET balance=balance-10 WHERE id=2;
```
Affected rows: 1.

41. Session A

```sql
UPDATE accounts SET balance=balance+10 WHERE id=2;
```
Affected rows: 1.

42. Session B

```sql
UPDATE accounts SET balance=balance+10 WHERE id=1;
```
```text
ERROR 1213: Deadlock found when trying to get lock; try restarting transaction
```

43. Session A

```sql
ROLLBACK;
```
Affected rows: 0.

44. Session B

```sql
ROLLBACK;
```
Affected rows: 0.
