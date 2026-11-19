class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)


def main():
    x1, y1, x2, y2 = map(int, input().split())
    result = Vector(x1, y1) + Vector(x2, y2)
    print(result.x, result.y)


if __name__ == "__main__":
    main()
