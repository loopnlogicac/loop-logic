import re


def classify(word):
    if word in {"let", "print"}:
        return "KEYWORD"
    if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", word):
        return "IDENTIFIER"
    if re.fullmatch(r"[0-9]+", word):
        return "INTEGER"
    return "ERROR"


if __name__ == "__main__":
    for word in ["let", "marks", "85", "printable", "2roll"]:
        print(f"{word}: {classify(word)}")
