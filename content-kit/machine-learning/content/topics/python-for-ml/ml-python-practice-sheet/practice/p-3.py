import pandas as pd

label = input().strip()
frame = pd.read_csv("fruits.csv")
chosen = frame.loc[frame["label"] == label]
X = chosen[["size_cm", "sweetness"]].to_numpy()
y = chosen["label"].to_numpy()
print(f"X_shape={X.shape}")
print(f"y_count={len(y)}")
