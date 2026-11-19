import pandas as pd


def main():
    count = int(input())
    rows = [input().split() for _ in range(count)]
    if not rows:
        print("EMPTY")
        return
    frame = pd.DataFrame(rows, columns=["category", "taka"])
    frame["taka"] = frame["taka"].astype("int64")
    for category, amount in frame.groupby("category", sort=True)["taka"].sum().items():
        print(category, f"{amount:.2f}")


if __name__ == "__main__":
    main()
