def find(roll: int, marks: dict[int, int]) -> int | None:
    return marks.get(roll)


def main() -> None:
    roll, bonus = map(int, input().split())
    mark = find(roll, {12: 0, 25: 70})
    if mark is None:
        print("MISSING")
    else:
        print(mark + bonus)


if __name__ == "__main__":
    main()
