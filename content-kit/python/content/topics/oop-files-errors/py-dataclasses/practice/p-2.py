from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int


def main():
    a, b, c, d = map(int, input().split())
    print(Point(a, b) == Point(c, d))


if __name__ == "__main__":
    main()
