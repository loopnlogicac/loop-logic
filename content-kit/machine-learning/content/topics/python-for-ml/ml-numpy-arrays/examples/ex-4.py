import numpy as np

flat = np.array([2, 3, 3, 2, 4, 3, 6, 7, 7, 8])
X = flat.reshape(5, 2)
column = X[:, 0].reshape(-1, 1)
print(f"X: {X.tolist()}")
print(f"One-feature shape: {column.shape}")
copy = X[:2].copy()
copy[0, 0] = 99
print(f"Original first size: {int(X[0, 0])}")
