import re


def main():
    text = "A12 B7"
    print(re.findall(r"[A-Z][0-9]+", text))
    print(re.findall(r"[A-Z]([0-9]+)", text))
    print(re.findall(r"([A-Z])([0-9]+)", text))


if __name__ == "__main__":
    main()
