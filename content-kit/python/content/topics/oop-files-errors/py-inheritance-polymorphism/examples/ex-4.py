class Wallet:
    def __init__(self, balance):
        self.balance = balance

class Student:
    def __init__(self, roll, wallet):
        self.roll = roll
        self.wallet = wallet


def main():
    student = Student(12, Wallet(250))
    print(student.roll, student.wallet.balance)
    print(isinstance(student, Wallet))


if __name__ == "__main__":
    main()
