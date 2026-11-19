import sys


def main():
    word = sys.stdin.buffer.read().strip().decode("ascii")
    print("YES" if word == word[::-1] else "NO")


if __name__ == "__main__":
    main()
