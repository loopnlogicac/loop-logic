import re


def main():
    pattern = re.compile(r"(?P<department>[A-Z]{3})(?P<number>[0-9]{3})")
    match = pattern.fullmatch("CSE212")
    if match:
        print(match.group("department"), int(match.group("number")))
        print(match.span())


if __name__ == "__main__":
    main()
