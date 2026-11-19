from itertools import chain, combinations, count, islice, product


def main():
    print(list(chain([1, 2], [], [3])))
    print(list(product(["A", "B"], [1, 2])))
    print(list(combinations([1, 2, 3], 2)))
    print(list(islice(count(10, 5), 4)))


if __name__ == "__main__":
    main()
