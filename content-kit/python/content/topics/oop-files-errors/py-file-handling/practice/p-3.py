import csv
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    rows = [input().split() for _ in range(int(input()))]
    with TemporaryDirectory() as directory:
        path = Path(directory) / "marks.csv"
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(["roll", "mark"])
            writer.writerows(rows)
        with path.open(encoding="utf-8", newline="") as stream:
            print(sum(int(row["mark"]) for row in csv.DictReader(stream)))


if __name__ == "__main__":
    main()
