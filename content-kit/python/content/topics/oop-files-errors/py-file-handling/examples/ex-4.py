import json
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory() as directory:
        path = Path(directory) / "record.json"
        with path.open("w", encoding="utf-8") as stream:
            json.dump({"label": "ঢাকা", "marks": [75, 80]}, stream, ensure_ascii=False)
        with path.open(encoding="utf-8") as stream:
            record = json.load(stream)
        print(record["label"], sum(record["marks"]))


if __name__ == "__main__":
    main()
