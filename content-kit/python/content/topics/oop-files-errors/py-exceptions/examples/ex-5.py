


def main():
    operations = [lambda: 1 / 0, lambda: [1][3], lambda: {}["roll"]]
    for operation in operations:
        try:
            operation()
        except (ZeroDivisionError, IndexError, KeyError) as error:
            print(type(error).__name__)


if __name__ == "__main__":
    main()
