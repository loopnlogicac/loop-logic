"""Teacher reference for cards-to-points; the lesson itself needs no code."""
import csv
from pathlib import Path


def main():
    dataset = Path(__file__).resolve().parents[5] / "shared/datasets/tiny_fruits.csv"
    with dataset.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    points = [(float(row["size_cm"]), float(row["sweetness"])) for row in rows]
    apples = sum(row["label"] == "apple" for row in rows)
    print(f"cards={len(points)} apples={apples} mangoes={len(points) - apples}")
    print(f"p6: size={points[5][0]:g} sweetness={points[5][1]:g} label=mango")


if __name__ == "__main__":
    main()
