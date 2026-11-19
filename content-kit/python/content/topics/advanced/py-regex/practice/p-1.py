import re


def main():
    print("VALID" if re.fullmatch(r"[A-Z]{3}[0-9]{3}", input()) else "INVALID")


if __name__ == "__main__":
    main()
