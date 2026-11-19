import sys


def main():
    line, column = 1, 1
    for char in sys.stdin.read():
        if char == "@":
            print(f"{line}:{column}")
        if char == "\n":
            line, column = line + 1, 1
        else:
            column += 1


if __name__ == "__main__":
    main()
