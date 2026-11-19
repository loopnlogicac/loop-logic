import numpy as np
x = np.array([-2, -1, 0, 1, 2], dtype=float)
y = 2 * x + 1
w, b = 0.0, 0.0
lr = 0.1
for iteration in range(40):
    error = w * x + b - y
    grad_w = 2 * np.mean(error * x)
    grad_b = 2 * np.mean(error)
    w, b = w - lr * grad_w, b - lr * grad_b
mse = np.mean((w * x + b - y) ** 2)
print(f"slope={w:.3f}, intercept={b:.3f}, mse={mse:.3f}")
