def parse_prices(text):
    return [int(token) for token in text.split()]


def total(prices):
    return sum(prices)


def main():
    print(total(parse_prices(input())))


if __name__ == "__main__":
    main()
