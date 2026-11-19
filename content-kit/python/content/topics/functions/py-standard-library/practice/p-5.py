from itertools import combinations


def main():
    number = int(input())
    for first, second in combinations(range(1, number + 1), 2):
        print(first, second)


if __name__ == "__main__":
    main()
