import numpy as np

X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])
weights = np.array([2, 1])
print(f"Element-wise: {(X * weights).tolist()}")
print(f"First dot product: {int(np.dot(X[0], weights))}")
print(f"All weighted sums: {(X @ weights).tolist()}")
W = np.array([[2, 1], [1, 0]])
print(f"Matrix product: {(X @ W).tolist()}")
