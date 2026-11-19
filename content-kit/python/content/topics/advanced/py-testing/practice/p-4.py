import io
import unittest

class Account:
    def __init__(self, balance):
        self.balance = balance
    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount


def main():
    balance, amount = map(int, input().split())
    class AccountTest(unittest.TestCase):
        def test_withdrawal(self):
            account = Account(balance)
            if amount > balance:
                with self.assertRaises(ValueError):
                    account.withdraw(amount)
                self.assertEqual(account.balance, balance)
            else:
                account.withdraw(amount)
                self.assertEqual(account.balance, balance - amount)
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(AccountTest)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    print("PASS" if result.wasSuccessful() else "FAIL")


if __name__ == "__main__":
    main()
