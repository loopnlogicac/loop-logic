from typing import Optional

def find_mark(roll: int, marks: dict[int, int]) -> Optional[int]:
    return marks.get(roll)


def main() -> None:
    for roll in [12, 25]:
        mark = find_mark(roll, {12: 0})
        if mark is None:
            print("missing")
        else:
            print(mark + 1)


if __name__ == "__main__":
    main()
