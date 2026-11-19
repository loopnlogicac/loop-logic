import sys


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    count, target = data[:2]
    values = sorted(data[2:2 + count])
    left, right = 0, len(values) - 1
    while left < right:
        total = values[left] + values[right]
        if total == target:
            print("YES")
            return
        if total < target:
            left += 1
        else:
            right -= 1
    print("NO")


if __name__ == "__main__":
    main()
