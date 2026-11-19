import re


if __name__ == "__main__":
    text = "roll@"
    pattern = r"[A-Za-z_][A-Za-z0-9_]*"
    prefix = re.match(pattern, text)
    whole = re.fullmatch(pattern, text)
    print(f"prefix: {prefix.group() if prefix else 'none'}")
    print(f"whole: {whole.group() if whole else 'none'}")
