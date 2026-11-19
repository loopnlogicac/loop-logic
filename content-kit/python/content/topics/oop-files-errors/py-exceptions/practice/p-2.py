def validate(mark):
    if not 0 <= mark <= 100:
        raise ValueError("mark outside range")
    return mark


def main():
    mark = int(input())
    try:
        validate(mark)
    except ValueError:
        print("RANGE")
    else:
        print("OK")


if __name__ == "__main__":
    main()
