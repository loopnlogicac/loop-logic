import sys


def main():
    word = sys.stdin.readline().strip()
    best = current = 0
    for char in word:
        current = current + 1 if char == "1" else 0
        best = max(best, current)
    print(best)


if __name__ == "__main__":
    main()
