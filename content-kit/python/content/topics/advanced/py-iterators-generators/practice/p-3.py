from itertools import count, islice

def squares():
    for value in count(1):
        yield value * value


def main():
    print(sum(islice(squares(), int(input()))))


if __name__ == "__main__":
    main()
