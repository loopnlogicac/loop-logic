import pandas as pd

column = input().strip()
frame = pd.read_csv("tiny_fruits.csv")
summary = frame.groupby("label", sort=True)[column].agg(["count", "mean"])
for label, row in summary.iterrows():
    print(f"{label}:{int(row['count'])}:{row['mean']:.1f}")
