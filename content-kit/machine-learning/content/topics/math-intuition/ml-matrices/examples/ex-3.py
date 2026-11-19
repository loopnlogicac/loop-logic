import numpy as np
import pandas as pd

X = pd.read_csv("tiny_fruits.csv")[["size_cm", "sweetness"]].to_numpy()
w = np.array([2.0, 1.0])
scores = X @ w
print(f"X shape={X.shape}; transpose={X.T.shape}; scores={scores.shape}")
print("first three toy scores:", [round(float(v), 3) for v in scores[:3]])
print("column totals:", [round(float(v), 3) for v in X.T @ np.ones(len(X))])
