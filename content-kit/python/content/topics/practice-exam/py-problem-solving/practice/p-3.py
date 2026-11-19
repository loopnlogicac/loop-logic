import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    seen = set()
    for value in data[1:1 + data[0]]:
        if value in seen:
            print(value)
            return
        seen.add(value)
    print("NONE")


if __name__ == "__main__":
    main()
