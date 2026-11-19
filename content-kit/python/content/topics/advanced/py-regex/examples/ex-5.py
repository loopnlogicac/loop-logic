import re


def main():
    literal = "lab.a+"
    pattern = re.compile(re.escape(literal))
    print(pattern.findall("lab.a+ laba lab.a+"))
    print(re.findall(r"[0-9]+", "roll12 seat25"))


if __name__ == "__main__":
    main()
