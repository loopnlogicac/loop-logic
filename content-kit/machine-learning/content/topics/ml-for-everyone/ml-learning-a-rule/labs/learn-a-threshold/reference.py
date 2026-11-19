"""Teacher reference for the half-centimetre threshold search."""
import csv
from pathlib import Path


def mistakes(points, threshold):
    return sum(int(x > threshold) != label for x, label in points)


def main():
    dataset = Path(__file__).resolve().parents[5] / "shared/datasets/tiny_fruits.csv"
    with dataset.open(encoding="utf-8", newline="") as handle:
        points = [(float(row["size_cm"]), int(row["label"] == "mango"))
                  for row in csv.DictReader(handle)]
    candidates = [index / 2 for index in range(21)]
    best = min(candidates, key=lambda t: (mistakes(points, t), t))
    print(f"threshold=5 mistakes={mistakes(points, 5)}")
    print(f"bestThreshold={best:g} bestMistakes={mistakes(points, best)}")
    for threshold in [3, 4, 5, 6]:
        print(f"fence={threshold} mistakes={mistakes(points, threshold)}")


if __name__ == "__main__":
    main()
