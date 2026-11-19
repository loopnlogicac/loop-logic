import sys
from collections import Counter


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    counts = Counter(data[1:1 + data[0]])
    best = min(counts, key=lambda value: (-counts[value], value))
    print(best, counts[best])


if __name__ == "__main__":
    main()
