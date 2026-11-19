def main():
    records = [{"category": "food", "paisa": 1050},
               {"category": "travel", "paisa": 2000},
               {"category": "food", "paisa": 1975}]
    totals = {}
    for record in records:
        name = record["category"]
        totals[name] = totals.get(name, 0) + record["paisa"]
    for name in sorted(totals):
        amount = totals[name]
        print(name, f"{amount // 100}.{amount % 100:02d}")


if __name__ == "__main__":
    main()
