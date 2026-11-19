


def main():
    marks = [35, 40, 75, 90]
    passed = (mark for mark in marks if mark >= 40)
    print(sum(passed))
    print(list(passed))


if __name__ == "__main__":
    main()
