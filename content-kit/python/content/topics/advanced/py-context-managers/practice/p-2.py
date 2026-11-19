from contextlib import contextmanager

@contextmanager
def squared(number):
    yield number * number


def main():
    with squared(int(input())) as value:
        print(value)
    print("DONE")


if __name__ == "__main__":
    main()
