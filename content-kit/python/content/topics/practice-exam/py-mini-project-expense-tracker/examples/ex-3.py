import argparse
import csv
import json
from pathlib import Path
import re
import tempfile
from decimal import Decimal


def money(paisa):
    return f"{paisa // 100}.{paisa % 100:02d}"


def category_name(text):
    name = text.strip().casefold()
    if not name or len(name) > 40 or not all(c.isprintable() for c in name):
        raise ValueError("invalid category")
    return name


def parse_amount(text):
    text = text.strip()
    if len(text) > 16 or not re.fullmatch(r"[0-9]+(?:\.[0-9]{1,2})?", text):
        raise ValueError("invalid amount")
    paisa = int(Decimal(text) * 100)
    if not 1 <= paisa <= 1_000_000_000:
        raise ValueError("amount outside range")
    return paisa


def validate_records(records):
    if not isinstance(records, list):
        raise ValueError("expected list")
    for record in records:
        if not isinstance(record, dict) or set(record) != {"category", "paisa"}:
            raise ValueError("invalid record")
        category, paisa = record["category"], record["paisa"]
        if not isinstance(category, str) or category_name(category) != category:
            raise ValueError("invalid stored category")
        if type(paisa) is not int or not 1 <= paisa <= 1_000_000_000:
            raise ValueError("invalid stored amount")
    return records


def load_records(path):
    try:
        with path.open(encoding="utf-8") as stream:
            return validate_records(json.load(stream))
    except FileNotFoundError:
        return []


def save_records(path, records):
    validate_records(records)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent,
                                         prefix=".expenses-", delete=False) as stream:
            temporary = Path(stream.name)
            json.dump(records, stream, ensure_ascii=False, indent=2, allow_nan=False)
            stream.write("\n")
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def category_totals(records):
    totals = {}
    for record in records:
        category = record["category"]
        totals[category] = totals.get(category, 0) + record["paisa"]
    return totals


def export_csv(path, records):
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.writer(stream)
        writer.writerow(["category", "amount_bdt"])
        for record in records:
            writer.writerow([record["category"], money(record["paisa"])])


def run_menu(path):
    try:
        records = load_records(path)
    except (OSError, ValueError):
        print("Storage error; existing data left unchanged")
        return
    while True:
        print("1 Add | 2 Summary | 3 Export CSV | 4 Quit")
        try:
            choice = input().strip()
            if choice == "1":
                print("Category:")
                category = category_name(input())
                print("Amount (BDT):")
                paisa = parse_amount(input())
                candidate = records + [{"category": category, "paisa": paisa}]
                save_records(path, candidate)
                records = candidate
                print("Added")
            elif choice == "2":
                totals = category_totals(records)
                if not totals:
                    print("No expenses")
                for category in sorted(totals):
                    print(category, money(totals[category]))
                print("Total", money(sum(totals.values())))
            elif choice == "3":
                export_csv(path.with_name("expenses.csv"), records)
                print("Exported expenses.csv")
            elif choice == "4":
                print("Bye")
                return
            else:
                print("Unknown choice")
        except EOFError:
            print("Bye")
            return
        except ValueError:
            print("Invalid expense")
        except OSError:
            print("File operation failed")


def main():
    parser = argparse.ArgumentParser(description="Track expenses in BDT")
    parser.add_argument("--path", type=Path, default=Path("expenses.json"))
    args = parser.parse_args()
    run_menu(args.path)


if __name__ == "__main__":
    main()
