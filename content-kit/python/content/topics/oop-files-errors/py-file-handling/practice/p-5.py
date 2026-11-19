import csv
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    room, seats = input(), int(input())
    with TemporaryDirectory() as directory:
        path = Path(directory) / "room.csv"
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(["room", "seats"])
            writer.writerow([room, seats])
        with path.open(encoding="utf-8", newline="") as stream:
            row = next(csv.DictReader(stream))
        print(row["room"])
        print(int(row["seats"]))


if __name__ == "__main__":
    main()
