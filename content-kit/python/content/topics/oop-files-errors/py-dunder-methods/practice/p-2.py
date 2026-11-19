class Roster:
    def __init__(self, rolls):
        self.rolls = rolls
    def __len__(self):
        return len(self.rolls)


def main():
    roster = Roster(input().split())
    print(len(roster), bool(roster))


if __name__ == "__main__":
    main()
