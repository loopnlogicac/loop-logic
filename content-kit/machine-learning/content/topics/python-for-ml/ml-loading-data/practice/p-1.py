import pandas as pd

label = input().strip()
frame = pd.read_csv("tiny_fruits.csv")
chosen = frame.loc[frame["label"] == label, "size_cm"]
print(f"count={chosen.count()}")
print(f"mean_size={chosen.mean():.1f}")
