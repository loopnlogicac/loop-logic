def passing(marks):
    for mark in marks:
        if mark >= 40:
            yield mark


def main():
    first = next(passing(map(int, input().split())), None)
    print("NONE" if first is None else first)


if __name__ == "__main__":
    main()
