import sys


def main():
    a, b = map(int, sys.stdin.buffer.read().split())
    while b:
        a, b = b, a % b
    print(a)


if __name__ == "__main__":
    main()
