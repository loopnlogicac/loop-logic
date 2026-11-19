import numpy as np
import pandas as pd

frame = pd.read_csv("fruits.csv")
features = ["size_cm", "weight_g", "sweetness", "colour_score"]
X = frame.loc[:, features].to_numpy(dtype=np.float64)
y = frame["label"].to_numpy()
print(f"X shape: {X.shape}; y shape: {y.shape}")
print(f"All features finite: {bool(np.isfinite(X).all())}")
print(f"Rows aligned: {len(X) == len(y)}")
print(f"First fruit: {y[0]}, size {X[0, 0]:.1f} cm")
