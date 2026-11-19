import numpy as np
X = np.array([[1, 0], [2, 1], [3, 0], [4, 1], [5, 0], [6, 1]], dtype=float)
y = 10 + 2 * X[:, 0] + 3 * X[:, 1]

from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X, y)
print(f"intercept={model.intercept_:.3f}, hours={model.coef_[0]:.3f}, "
      f"attendance={model.coef_[1]:.3f}")
print(f"query={model.predict([[3, 1]])[0]:.3f}")
