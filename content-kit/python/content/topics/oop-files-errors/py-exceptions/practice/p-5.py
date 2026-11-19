def parse_mark(text):
    try:
        return int(text)
    except ValueError as error:
        raise ValueError("invalid mark") from error


def main():
    try:
        print(parse_mark(input()))
    except ValueError as error:
        print(str(error))
        print(type(error.__cause__).__name__)


if __name__ == "__main__":
    main()
