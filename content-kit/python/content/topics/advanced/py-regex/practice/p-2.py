import re


def main():
    print(sum(map(int, re.findall(r"[0-9]+", input()))))


if __name__ == "__main__":
    main()
