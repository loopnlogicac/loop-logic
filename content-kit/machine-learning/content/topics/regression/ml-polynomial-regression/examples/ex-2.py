import numpy as np
x = np.linspace(-1, 1, 15)
y = 2 + x - 2 * x**2 + x**3 + 0.3 * np.cos(np.arange(15) * 2)
valid_x = np.linspace(-0.95, 0.95, 30)
valid_y = 2 + valid_x - 2 * valid_x**2 + valid_x**3

from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

degree = 3
model = make_pipeline(PolynomialFeatures(degree, include_bias=False), LinearRegression())
model.fit(x[:, None], y)
train_pred = model.predict(x[:, None])
valid_pred = model.predict(valid_x[:, None])

print(f"degree={degree}, train_mse={np.mean((y - train_pred) ** 2):.3f}, "
      f"validation_mse={np.mean((valid_y - valid_pred) ** 2):.3f}")
