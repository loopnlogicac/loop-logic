def total(values: list[int]) -> int:
    return sum(values)


def main() -> None:
    print(total(list(map(int, input().split()))))


if __name__ == "__main__":
    main()
