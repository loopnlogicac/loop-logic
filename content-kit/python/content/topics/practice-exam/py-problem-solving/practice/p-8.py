import sys


def main():
    stack = []
    opening = {")": "(", "]": "["}
    for char in sys.stdin.readline().strip():
        if char in "([":
            stack.append(char)
        elif not stack or stack.pop() != opening[char]:
            print("NO")
            return
    print("YES" if not stack else "NO")


if __name__ == "__main__":
    main()
