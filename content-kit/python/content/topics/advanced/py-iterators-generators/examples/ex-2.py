def squares(limit):
    for number in range(limit):
        yield number * number


def main():
    values = squares(4)
    print(next(values))
    print(list(values))
    print(list(values))


if __name__ == "__main__":
    main()
