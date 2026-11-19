def marks():
    print("start")
    yield 75
    print("resume")
    yield 80


def main():
    values = marks()
    print("created")
    print(next(values))
    print(next(values))


if __name__ == "__main__":
    main()
