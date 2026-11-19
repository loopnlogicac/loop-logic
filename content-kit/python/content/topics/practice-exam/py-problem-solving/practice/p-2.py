import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    values = sorted(set(data[1:1 + data[0]]))
    print(" ".join(map(str, values)) if values else "EMPTY")


if __name__ == "__main__":
    main()
