class Record:
    def __init__(self, roll):
        self.roll = roll
    def report(self):
        return str(self.roll)

class MarkedRecord(Record):
    def __init__(self, roll, mark):
        super().__init__(roll)
        self.mark = mark
    def report(self):
        return f"{super().report()}:{self.mark}"


def main():
    roll, mark = map(int, input().split())
    print(MarkedRecord(roll, mark).report())


if __name__ == "__main__":
    main()
