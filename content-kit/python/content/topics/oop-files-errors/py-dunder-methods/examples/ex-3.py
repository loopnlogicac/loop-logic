class Distance:
    def __init__(self, metres):
        self.metres = metres
    def __add__(self, other):
        if not isinstance(other, Distance):
            return NotImplemented
        return Distance(self.metres + other.metres)


def main():
    a, b = Distance(20), Distance(35)
    print((a + b).metres, a.metres)
    try:
        a + "5"
    except TypeError:
        print("unsupported")


if __name__ == "__main__":
    main()
