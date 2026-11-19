import numpy as np
x = np.linspace(-1, 1, 15)
y = 2 + x - 2 * x**2 + x**3 + 0.3 * np.cos(np.arange(15) * 2)
valid_x = np.linspace(-0.95, 0.95, 30)
valid_y = 2 + valid_x - 2 * valid_x**2 + valid_x**3

degree = 3
A = np.vander(x, degree + 1, increasing=True)
weights = np.linalg.lstsq(A, y, rcond=None)[0]
train_pred = A @ weights
valid_pred = np.vander(valid_x, degree + 1, increasing=True) @ weights

print(f"degree={degree}, train_mse={np.mean((y - train_pred) ** 2):.3f}, "
      f"validation_mse={np.mean((valid_y - valid_pred) ** 2):.3f}")
