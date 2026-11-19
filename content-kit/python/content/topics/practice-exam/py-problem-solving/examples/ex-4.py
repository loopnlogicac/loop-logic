import sys


def main():
    a, b, c = sorted(map(int, sys.stdin.buffer.read().split()))
    print("VALID" if a > 0 and a + b > c else "INVALID")


if __name__ == "__main__":
    main()
