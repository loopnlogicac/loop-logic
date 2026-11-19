from dataclasses import dataclass

@dataclass
class Course:
    code: str
    credits: int = 3


def main():
    course = Course("CSE212")
    print(course)
    print(course.code, course.credits)


if __name__ == "__main__":
    main()
