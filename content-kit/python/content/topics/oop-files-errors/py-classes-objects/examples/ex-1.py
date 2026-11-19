class Student:
    def __init__(self, roll, marks):
        self.roll = roll
        self.marks = marks

    def passed(self):
        return self.marks >= 40


def main():
    first = Student(12, 75)
    second = Student(25, 35)
    print(first.roll, first.passed())
    print(second.roll, second.passed())


if __name__ == "__main__":
    main()
