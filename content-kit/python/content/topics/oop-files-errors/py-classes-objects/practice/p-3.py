class Register:
    def __init__(self):
        self.marks = []

    def add(self, mark):
        self.marks.append(mark)

    def passed(self):
        return sum(mark >= 40 for mark in self.marks)


def main():
    register = Register()
    for mark in map(int, input().split()):
        register.add(mark)
    print(register.passed())


if __name__ == "__main__":
    main()
