import re


def main():
    text = "Take CSE212 today"
    pattern = r"[A-Z]{3}[0-9]{3}"
    found = re.search(pattern, text)
    print(found.group(0) if found else "missing")
    print(re.match(pattern, text) is None)
    print(re.fullmatch(pattern, "CSE212") is not None)
    print(re.fullmatch(pattern, "CSE212x") is None)


if __name__ == "__main__":
    main()
