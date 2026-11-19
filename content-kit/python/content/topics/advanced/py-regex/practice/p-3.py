import re


def main():
    print(re.sub(r"[ \t]+", "_", input()))


if __name__ == "__main__":
    main()
