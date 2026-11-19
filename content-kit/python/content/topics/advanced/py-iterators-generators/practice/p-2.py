def running(values):
    total = 0
    for value in values:
        total += value
        yield total


def main():
    print(*running(map(int, input().split())))


if __name__ == "__main__":
    main()
