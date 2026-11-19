class Shared:
    marks = []

class Separate:
    def __init__(self):
        self.marks = []


def main():
    a, b = Shared(), Shared()
    a.marks.append(75)
    print(b.marks)
    x, y = Separate(), Separate()
    x.marks.append(75)
    print(y.marks)


if __name__ == "__main__":
    main()
