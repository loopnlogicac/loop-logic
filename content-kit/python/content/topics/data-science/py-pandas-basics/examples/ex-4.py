import pandas as pd


def main():
    frame = pd.DataFrame({
        "category": ["food", "travel", "food"],
        "taka": [50, 30, 70],
    })
    totals = frame.groupby("category", sort=True)["taka"].sum()
    for category, amount in totals.items():
        print(category, f"{amount:.2f}")


if __name__ == "__main__":
    main()
