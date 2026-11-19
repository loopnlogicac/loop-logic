import numpy as np
from sklearn.linear_model import LinearRegression
x = np.array([-2, -1, 0, 1, 2], dtype=float)
y = 2 * x + 1
model = LinearRegression().fit(x[:, None], y)
mse = np.mean((model.predict(x[:, None]) - y) ** 2)
print(f"slope={model.coef_[0]:.3f}, intercept={model.intercept_:.3f}, mse={mse:.3f}")
