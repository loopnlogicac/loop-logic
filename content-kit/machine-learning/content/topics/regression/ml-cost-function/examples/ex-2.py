import numpy as np
x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([3, 4, 5, 4, 9], dtype=float)

from sklearn.metrics import mean_squared_error
b = 1.4
slopes = np.arange(-10, 41) / 10
costs = [mean_squared_error(y, w * x + b) for w in slopes]
best = int(np.argmin(costs))
selected = 1.0
print(f"slope={selected:.3f}, mse={mean_squared_error(y, selected*x+b):.3f}, "
      f"best_slope={slopes[best]:.3f}, best_mse={costs[best]:.3f}")
