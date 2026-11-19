class Balance:
    def __init__(self, taka):
        self.taka = taka
    def __str__(self):
        return f"{self.taka} BDT"
    def __repr__(self):
        return f"Balance({self.taka})"


def main():
    value = Balance(250)
    print(value)
    print(repr(value))
    print([value])


if __name__ == "__main__":
    main()
