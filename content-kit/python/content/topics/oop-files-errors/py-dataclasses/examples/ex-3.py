from dataclasses import dataclass

@dataclass(order=True)
class Score:
    marks: int
    roll: int


def main():
    items = [Score(80, 25), Score(70, 12), Score(80, 10)]
    print([item.roll for item in sorted(items)])
    print(Score(80, 10) == Score(80, 10))


if __name__ == "__main__":
    main()
