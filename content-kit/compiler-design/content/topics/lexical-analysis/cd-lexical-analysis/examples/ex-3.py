def inspect(source):
    line = 1
    column = 1
    for char in source:
        if not (char.isascii() and (char.isalnum() or char in "_ =;\n")):
            print(f"line {line}, column {column}: invalid {char!r}")
        if char == "\n":
            line += 1
            column = 1
        else:
            column += 1


if __name__ == "__main__":
    inspect("marks=85;\nroll=@7;")
