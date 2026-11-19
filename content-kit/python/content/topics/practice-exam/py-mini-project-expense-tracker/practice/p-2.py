import json
import re
import sys


def main():
    try:
        rows = json.load(sys.stdin)
        valid = isinstance(rows, list)
        if valid:
            for row in rows:
                if not isinstance(row, dict) or set(row) != {"category", "paisa"}:
                    valid = False
                    break
                name, amount = row["category"], row["paisa"]
                if (not isinstance(name, str) or not re.fullmatch(r"[a-z]+", name)
                        or type(amount) is not int or not 1 <= amount <= 1_000_000_000):
                    valid = False
                    break
    except (ValueError, TypeError):
        valid = False
    print("VALID" if valid else "INVALID")


if __name__ == "__main__":
    main()
