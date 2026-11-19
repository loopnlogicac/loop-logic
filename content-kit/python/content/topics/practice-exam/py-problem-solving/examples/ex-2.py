import sys


def main():
    people, capacity = map(int, sys.stdin.buffer.read().split())
    print((people + capacity - 1) // capacity)


if __name__ == "__main__":
    main()
