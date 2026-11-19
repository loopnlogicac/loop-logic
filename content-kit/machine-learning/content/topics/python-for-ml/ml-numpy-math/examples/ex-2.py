import numpy as np

X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])
offsets = np.array([10, 20])
result = X + offsets
print(f"Result: {result.tolist()}")
print(f"Total: {int(result.sum())}")
