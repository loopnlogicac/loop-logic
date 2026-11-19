def passed(mark):
    return mark >= 40


def main():
    cases = [(0, False), (39, False), (40, True), (100, True)]
    indices = list(map(int, input().split()))
    for index in indices:
        mark, expected = cases[index]
        assert passed(mark) is expected
    print(len(indices))


if __name__ == "__main__":
    main()
