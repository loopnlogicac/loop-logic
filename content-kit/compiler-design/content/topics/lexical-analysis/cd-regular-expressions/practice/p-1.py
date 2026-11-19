import re
import sys


def main():
    pattern = re.compile(r"[0-9]+(?:\.[0-9]+)?")
    for word in sys.stdin.read().splitlines():
        print("VALID" if pattern.fullmatch(word) else "INVALID")


if __name__ == "__main__":
    main()
