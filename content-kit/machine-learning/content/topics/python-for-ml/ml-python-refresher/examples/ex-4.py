import csv


def main():
    with open("tiny_fruits.csv", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    sizes = [float(row["size_cm"]) for row in rows]
    mangoes = [row for row in rows if row["label"] == "mango"]
    print(f"Rows: {len(rows)}")
    print(f"Mangoes: {len(mangoes)}")
    print(f"Mean size: {sum(sizes) / len(sizes):.1f} cm")


if __name__ == "__main__":
    main()
