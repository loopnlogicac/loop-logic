from dataclasses import dataclass, field

@dataclass
class Group:
    rolls: list[int] = field(default_factory=list)


def main():
    a, b = Group(), Group()
    a.rolls.extend(map(int, input().split()))
    print(len(a.rolls), len(b.rolls))


if __name__ == "__main__":
    main()
