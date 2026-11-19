import re
import sys


def main():
    for word in sys.stdin.read().splitlines():
        if word in {"let", "print"}:
            print("KEYWORD")
        elif re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", word):
            print("IDENTIFIER")
        elif re.fullmatch(r"[0-9]+", word):
            print("INTEGER")
        else:
            print("ERROR")


if __name__ == "__main__":
    main()
