import numpy as np
from sklearn.linear_model import Lasso
X = np.array([[-1, -1], [-1, 1], [1, -1], [1, 1]], dtype=float)
y = 3 * X[:, 0]
model = Lasso(alpha=1.0, max_iter=10000, tol=1e-10, random_state=0).fit(X, y)
print(f"First weight: {model.coef_[0]:.3f}")
print(f"Second weight: {model.coef_[1]:.3f}")
