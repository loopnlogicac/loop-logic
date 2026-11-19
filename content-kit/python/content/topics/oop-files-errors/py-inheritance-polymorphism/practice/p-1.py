class Course:
    def __init__(self, credits):
        self.credits = credits
    def fee(self):
        return self.credits * 1000

class LabCourse(Course):
    def __init__(self, credits, charge):
        super().__init__(credits)
        self.charge = charge
    def fee(self):
        return super().fee() + self.charge


def main():
    credits, charge = map(int, input().split())
    print(LabCourse(credits, charge).fee())


if __name__ == "__main__":
    main()
