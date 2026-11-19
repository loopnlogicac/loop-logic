class FundsError(Exception):
    pass

class Account:
    def __init__(self, balance):
        self.balance = balance
    def withdraw(self, amount):
        if amount > self.balance:
            raise FundsError("insufficient funds")
        self.balance -= amount


def main():
    account = Account(int(input()))
    for amount in map(int, input().split()):
        try:
            account.withdraw(amount)
        except FundsError:
            print("REJECT")
    print(account.balance)


if __name__ == "__main__":
    main()
