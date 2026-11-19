import re

IDENTIFIER = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
NUMBER = re.compile(r"[0-9]+(?:\.[0-9]+)?")


def classify(word):
    if word in {"let", "print"}:
        return "KEYWORD"
    if IDENTIFIER.fullmatch(word):
        return "IDENTIFIER"
    if NUMBER.fullmatch(word):
        return "NUMBER"
    return "ERROR"


if __name__ == "__main__":
    for word in ["_roll2", "print", "print2", "85.5", "85.", ".5", "১২"]:
        print(f"{word}: {classify(word)}")
