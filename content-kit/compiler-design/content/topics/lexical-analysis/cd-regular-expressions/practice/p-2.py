import re
import sys


def scan(text):
    patterns = [("EQ", r"=="), ("ASSIGN", r"="), ("ID", r"[A-Za-z_][A-Za-z0-9_]*")]
    pos = 0
    while pos < len(text):
        if text[pos].isspace():
            pos += 1
            continue
        candidates = []
        for kind, pattern in patterns:
            match = re.match(pattern, text[pos:])
            if match:
                candidates.append((kind, match.group()))
        if not candidates:
            print(f"ERROR {text[pos]}")
            pos += 1
            continue
        kind, lexeme = max(candidates, key=lambda item: len(item[1]))
        print(f"{kind} {lexeme}")
        pos += len(lexeme)


if __name__ == "__main__":
    scan(sys.stdin.read())
