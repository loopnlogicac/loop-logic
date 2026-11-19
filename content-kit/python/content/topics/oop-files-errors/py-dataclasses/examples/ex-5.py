from dataclasses import dataclass

@dataclass
class Result:
    marks: int
    def __post_init__(self):
        if not 0 <= self.marks <= 100:
            raise ValueError("marks outside range")


def main():
    print(Result(0))
    try:
        Result(101)
    except ValueError as error:
        print(str(error))


if __name__ == "__main__":
    main()
