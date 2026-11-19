def evens(limit):
    for number in range(0, limit + 1, 2):
        yield number


def main():
    print(*evens(int(input())))


if __name__ == "__main__":
    main()
