import re


def main():
    pairs = re.findall(r"(?<!\S)R([0-9]+):([0-9]{1,3})(?!\S)", input())
    valid = [(int(roll), int(mark)) for roll, mark in pairs if int(mark) <= 100]
    if not valid:
        print("NONE")
    for roll, mark in valid:
        print(roll, mark)


if __name__ == "__main__":
    main()
