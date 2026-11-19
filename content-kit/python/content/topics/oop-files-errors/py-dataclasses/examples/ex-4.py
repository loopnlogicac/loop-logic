from dataclasses import dataclass, field, FrozenInstanceError

@dataclass(frozen=True)
class Group:
    label: str
    rolls: list[int] = field(default_factory=list)


def main():
    group = Group("A")
    try:
        group.label = "B"
    except FrozenInstanceError:
        print("assignment blocked")
    group.rolls.append(12)
    print(group.label, group.rolls)


if __name__ == "__main__":
    main()
