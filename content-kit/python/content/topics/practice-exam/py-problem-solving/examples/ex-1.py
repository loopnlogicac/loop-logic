import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    print(sum(data[1:1 + data[0]]))


if __name__ == "__main__":
    main()
