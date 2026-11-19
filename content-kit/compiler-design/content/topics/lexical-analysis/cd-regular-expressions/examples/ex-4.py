import re

PATTERN = re.compile(r"[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?")


if __name__ == "__main__":
    for word in ["8", "8.5", "8e2", "8.5E-2", "8e", "8.e2"]:
        print(f"{word}: {bool(PATTERN.fullmatch(word))}")
