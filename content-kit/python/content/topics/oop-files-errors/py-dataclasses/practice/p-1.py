from dataclasses import dataclass

@dataclass
class Course:
    code: str
    credits: int


def main():
    course = Course(input(), int(input()))
    print(f"{course.code}:{course.credits}")


if __name__ == "__main__":
    main()
