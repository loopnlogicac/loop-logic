def passed(mark):
    if not 0 <= mark <= 100:
        raise ValueError("mark outside range")
    return mark >= 40

def test_below_cutoff():
    assert passed(39) is False

def test_at_cutoff():
    assert passed(40) is True

def test_endpoints():
    assert passed(0) is False
    assert passed(100) is True


def main():
    test_below_cutoff()
    test_at_cutoff()
    test_endpoints()
    print("3 test functions passed")


if __name__ == "__main__":
    main()
