class Wallet:
    def __init__(self, taka):
        self.taka = taka

    def deposit(self, amount):
        self.taka += amount
        return self.taka


def main():
    wallet = Wallet(100)
    alias = wallet
    print(wallet.deposit(25))
    print(alias.taka)


if __name__ == "__main__":
    main()
