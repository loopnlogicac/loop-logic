def add_roll(roster: list[int], roll: int) -> None:
    roster.append(roll)


def main() -> None:
    rolls: list[int] = []
    add_roll(rolls, 12)
    print(rolls)


if __name__ == "__main__":
    main()
