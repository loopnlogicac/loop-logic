import csv
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory() as directory:
        path = Path(directory) / "rooms.csv"
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(["room", "seats"])
            writer.writerow(["Lab, East", 30])
        with path.open(encoding="utf-8", newline="") as stream:
            for row in csv.DictReader(stream):
                print(row["room"], int(row["seats"]) + 5)


if __name__ == "__main__":
    main()
