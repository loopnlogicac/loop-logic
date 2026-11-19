import numpy as np

X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])
print(f"shape={X.shape}, ndim={X.ndim}")
print(f"Third row: {X[2].tolist()}")
print(f"Last sweetness: {int(X[-1, 1])}")
print(f"First two rows: {X[:2].tolist()}")
print(f"Size column: {X[:, 0].tolist()}")
