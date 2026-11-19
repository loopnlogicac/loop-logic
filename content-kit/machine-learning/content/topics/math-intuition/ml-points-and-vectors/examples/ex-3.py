import numpy as np
import pandas as pd

data = pd.read_csv("fruits.csv")
columns = ["size_cm", "weight_g", "sweetness", "colour_score"]
X = data[columns].to_numpy(dtype=float)
centre = X.mean(axis=0)
print(f"rows={X.shape[0]} features={X.shape[1]}")
print("mean vector:", [round(float(v), 3) for v in centre])
print("first centred row:", [round(float(v), 3) for v in X[0] - centre])
