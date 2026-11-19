def square(number):
    return number * number


def main():
    cases = [(0, 0), (-3, 9), (5, 25)]
    number, expected = cases[int(input())]
    result = square(number)
    assert result == expected
    print(result)


if __name__ == "__main__":
    main()
