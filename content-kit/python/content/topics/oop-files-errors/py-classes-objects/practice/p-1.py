class Student:
    def __init__(self, roll, marks):
        self.roll = roll
        self.marks = marks


def main():
    roll, marks = map(int, input().split())
    student = Student(roll, marks)
    print(student.roll, student.marks)


if __name__ == "__main__":
    main()
