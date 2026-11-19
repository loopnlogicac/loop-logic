import pandas as pd

cutoff = int(input())
frame = pd.read_csv("tiny_fruits.csv")
chosen = frame.loc[frame["size_cm"] >= cutoff].copy()
chosen["size_mm"] = chosen["size_cm"] * 10
if chosen.empty:
    print("none")
else:
    for _, row in chosen.iterrows():
        print(f"{row['label']}:{int(row['size_mm'])}")
