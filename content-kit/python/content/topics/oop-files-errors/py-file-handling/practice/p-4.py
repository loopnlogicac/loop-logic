import json
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    text = input()
    with TemporaryDirectory() as directory:
        path = Path(directory) / "marks.json"
        path.write_text(text, encoding="utf-8")
        try:
            with path.open(encoding="utf-8") as stream:
                data = json.load(stream)
            marks = data.get("marks") if isinstance(data, dict) else None
            valid = isinstance(marks, list) and all(
                type(mark) is int and 0 <= mark <= 100 for mark in marks)
            print(sum(marks) if valid else "INVALID")
        except json.JSONDecodeError:
            print("INVALID")


if __name__ == "__main__":
    main()
