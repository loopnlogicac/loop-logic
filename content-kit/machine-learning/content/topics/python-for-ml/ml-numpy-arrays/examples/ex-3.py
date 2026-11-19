import numpy as np

X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])
y = np.array(["apple", "apple", "apple", "mango", "mango"])
mask = X[:, 0] >= 4
print(f"Mask: {mask.tolist()}")
print(f"Chosen rows: {X[mask].tolist()}")
print(f"Chosen labels: {y[mask].tolist()}")
