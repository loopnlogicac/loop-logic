def scan_chunks(chunks):
    pending = ""
    for chunk in chunks:
        print(f"load {chunk!r}")
        for char in chunk:
            if char.isascii() and char.isalpha():
                pending += char
            else:
                if pending:
                    print(f"ID {pending}")
                    pending = ""
                if not char.isspace():
                    print(f"PUNCT {char}")
    if pending:
        print(f"ID {pending}")


if __name__ == "__main__":
    scan_chunks(["mar", "ks=", "roll"])
