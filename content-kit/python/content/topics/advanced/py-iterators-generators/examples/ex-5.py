from itertools import count, islice


def main():
    multiples = (number * 3 for number in count(1))
    print(list(islice(multiples, 4)))
    print(next(multiples))


if __name__ == "__main__":
    main()
