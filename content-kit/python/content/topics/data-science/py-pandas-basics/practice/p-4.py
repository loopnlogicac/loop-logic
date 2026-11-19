import pandas as pd


def main():
    tokens = input().split()
    marks = pd.Series([float("nan") if x == "NA" else float(x) for x in tokens],
                      dtype="float64")
    count = int(marks.count())
    print(count, int(marks.isna().sum()))
    print(f"{marks.mean():.2f}" if count else "NA")


if __name__ == "__main__":
    main()
