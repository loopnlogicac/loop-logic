import sys


def main():
    digits = sys.stdin.buffer.read().strip().decode("ascii")
    print(sum(int(digit) for digit in digits))


if __name__ == "__main__":
    main()
