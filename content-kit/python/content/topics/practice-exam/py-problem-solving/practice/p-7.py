import sys


def main():
    tokens = iter(map(int, sys.stdin.buffer.read().split()))
    count = next(tokens)
    intervals = sorted((next(tokens), next(tokens)) for _ in range(count))
    merged = []
    for left, right in intervals:
        if merged and left <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], right)
        else:
            merged.append([left, right])
    print(len(merged))
    for left, right in merged:
        print(left, right)


if __name__ == "__main__":
    main()
