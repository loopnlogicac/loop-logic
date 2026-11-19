import numpy as np
X = np.array([[1, 0], [2, 1], [3, 0], [4, 1], [5, 0], [6, 1]], dtype=float)
y = 10 + 2 * X[:, 0] + 3 * X[:, 1]

A = np.column_stack([np.ones(len(X)), X])
weights = np.linalg.pinv(A) @ y
print(f"intercept={weights[0]:.3f}, hours={weights[1]:.3f}, attendance={weights[2]:.3f}")
print(f"query={np.array([1, 3, 1]) @ weights:.3f}")
