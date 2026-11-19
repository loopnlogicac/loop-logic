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
    for course in [Course(3), LabCourse(3, 500)]:
        print(course.fee())


if __name__ == "__main__":
    main()
