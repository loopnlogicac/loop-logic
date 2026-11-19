from dataclasses import dataclass, field

@dataclass
class Roster:
    rolls: list[int] = field(default_factory=list)


def main():
    a, b = Roster(), Roster()
    a.rolls.append(12)
    print(a.rolls, b.rolls)
    print(a.rolls is b.rolls)


if __name__ == "__main__":
    main()
