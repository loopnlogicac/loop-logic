import numpy as np

X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])
offsets = np.array([1, 2, 3, 4, 5]).reshape(5, 1)
print(f"Column broadcast: {(X + offsets).tolist()}")
print(f"Column sums: {X.sum(axis=0).tolist()}")
print(f"Row sums: {X.sum(axis=1).tolist()}")
print(f"Column means: {np.round(X.mean(axis=0), 1).tolist()}")
print(f"Column minima: {X.min(axis=0).tolist()}")
print(f"Column maxima: {X.max(axis=0).tolist()}")
