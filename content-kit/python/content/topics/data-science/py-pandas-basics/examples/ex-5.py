import pandas as pd


def main():
    marks = pd.Series([40.0, 60.0, 80.0, float("nan")])
    stats = marks.describe()
    for label in ["count", "mean", "std", "min", "25%", "50%", "75%", "max"]:
        print(label, f"{stats.loc[label]:.2f}")
    print("missing", int(marks.isna().sum()))


if __name__ == "__main__":
    main()
