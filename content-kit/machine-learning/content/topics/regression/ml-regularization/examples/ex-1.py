import numpy as np
x = np.linspace(-1, 1, 15)
y = 2 + x - 2 * x**2 + x**3 + 0.3 * np.cos(np.arange(15) * 2)
valid_x = np.linspace(-0.95, 0.95, 30)
valid_y = 2 + valid_x - 2 * valid_x**2 + valid_x**3

degree = 8
raw = np.column_stack([x**power for power in range(1, degree + 1)])
mean = raw.mean(axis=0)
scale = raw.std(axis=0)
Z = (raw - mean) / scale
centered_y = y - y.mean()
alpha = 1.0

weights = np.linalg.solve(Z.T @ Z + alpha * np.eye(degree), Z.T @ centered_y)
prediction = y.mean() + Z @ weights

print(f"alpha={alpha:.3f}, weight_norm={np.linalg.norm(weights):.3f}, "
      f"train_mse={np.mean((y - prediction) ** 2):.3f}")
