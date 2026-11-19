def total(quantity, unit_price):
    return quantity * unit_price


def main():
    quantity, price = map(int, input().split())
    print(total(quantity, price))


if __name__ == "__main__":
    main()
