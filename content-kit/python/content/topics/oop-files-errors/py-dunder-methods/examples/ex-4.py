class Result:
    def __init__(self, marks, roll):
        self.marks, self.roll = marks, roll
    def __eq__(self, other):
        if not isinstance(other, Result):
            return NotImplemented
        return (self.marks, self.roll) == (other.marks, other.roll)
    def __lt__(self, other):
        if not isinstance(other, Result):
            return NotImplemented
        return (self.marks, self.roll) < (other.marks, other.roll)


def main():
    items = [Result(80, 25), Result(70, 12), Result(80, 10)]
    print([item.roll for item in sorted(items)])
    print(Result(80, 10) == Result(80, 10))


if __name__ == "__main__":
    main()
