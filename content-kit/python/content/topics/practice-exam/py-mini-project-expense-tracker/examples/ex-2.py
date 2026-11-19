import csv
import json
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    records = [{"category": "food, campus", "paisa": 1250}]
    with TemporaryDirectory() as folder:
        path = Path(folder) / "expenses.json"
        with path.open("w", encoding="utf-8") as stream:
            json.dump(records, stream, ensure_ascii=False)
        with path.open(encoding="utf-8") as stream:
            loaded = json.load(stream)
        csv_path = Path(folder) / "expenses.csv"
        with csv_path.open("w", newline="", encoding="utf-8") as stream:
            writer = csv.writer(stream)
            writer.writerow(["category", "amount_bdt"])
            writer.writerow([loaded[0]["category"], "12.50"])
        with csv_path.open(newline="", encoding="utf-8") as stream:
            rows = list(csv.reader(stream))
        print(rows[1][0], rows[1][1])


if __name__ == "__main__":
    main()
