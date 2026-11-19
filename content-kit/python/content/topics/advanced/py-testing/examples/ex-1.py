def passed(mark):
    if not 0 <= mark <= 100:
        raise ValueError("mark outside range")
    return mark >= 40


def main():
    assert passed(0) is False
    assert passed(39) is False
    assert passed(40) is True
    assert passed(100) is True
    print("4 boundary checks passed")


if __name__ == "__main__":
    main()
