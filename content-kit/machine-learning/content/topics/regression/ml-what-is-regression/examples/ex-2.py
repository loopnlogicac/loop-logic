import numpy as np
x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([3, 4, 5, 4, 9], dtype=float)

from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(x.reshape(-1, 1), y)
prediction = model.predict(x.reshape(-1, 1))
print(f"slope={model.coef_[0]:.3f}, intercept={model.intercept_:.3f}, "
      f"mse={np.mean((y - prediction) ** 2):.3f}")
