class Money:
    def __init__(self, amount):
        self.amount = amount
    def __str__(self):
        return f"{self.amount} BDT"


def main():
    print(Money(int(input())))


if __name__ == "__main__":
    main()
