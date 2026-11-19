def largest(values: list[int]) -> int | None:
    return max(values) if values else None


def main() -> None:
    value = largest(list(map(int, input().split())))
    print("EMPTY" if value is None else value)


if __name__ == "__main__":
    main()
