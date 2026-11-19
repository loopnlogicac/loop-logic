import sys

KEYWORDS = {"let": "LET", "print": "PRINT"}
SINGLE = {"=": "ASSIGN", "+": "PLUS", "-": "MINUS", "*": "STAR",
          "/": "SLASH", "(": "LPAREN", ")": "RPAREN", ";": "SEMI"}


def letter(char):
    return char.isascii() and (char.isalpha() or char == "_")


def digit(char):
    return "0" <= char <= "9"


def tokenize(source):
    pos, line, column = 0, 1, 1
    while pos < len(source):
        char = source[pos]
        if char in " \t\r":
            pos, column = pos + 1, column + 1
            continue
        if char == "\n":
            pos, line, column = pos + 1, line + 1, 1
            continue
        if source.startswith("//", pos):
            while pos < len(source) and source[pos] != "\n":
                pos, column = pos + 1, column + 1
            continue
        start, start_column = pos, column
        if letter(char):
            pos += 1
            while pos < len(source) and (letter(source[pos]) or digit(source[pos])):
                pos += 1
            lexeme = source[start:pos]
            kind = KEYWORDS.get(lexeme, "ID")
        elif digit(char):
            pos += 1
            while pos < len(source) and digit(source[pos]):
                pos += 1
            kind = "INT"
        elif source.startswith("==", pos):
            pos += 2
            kind = "EQ"
        elif char in SINGLE:
            pos += 1
            kind = SINGLE[char]
        else:
            # Recovery must consume the bad character so scanning can continue.
            yield "ERROR", char, line, column
            pos, column = pos + 1, column + 1
            continue
        lexeme = source[start:pos]
        column += pos - start
        yield kind, lexeme, line, start_column
    yield "EOF", "", line, column



def main():
    counts = {}
    for kind, lexeme, line, column in tokenize(sys.stdin.read()):
        if kind not in {"ERROR", "EOF"}:
            counts[kind] = counts.get(kind, 0) + 1
    for kind in sorted(counts):
        print(f"{kind} {counts[kind]}")


if __name__ == "__main__":
    main()
