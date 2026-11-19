x = [1, 2, 3, 4, 5]
y = [3, 4, 5, 4, 9]

x_mean = sum(x) / len(x)
y_mean = sum(y) / len(y)
sxx = sum((v - x_mean) ** 2 for v in x)
sxy = sum((a - x_mean) * (b - y_mean) for a, b in zip(x, y))
w = sxy / sxx
b = y_mean - w * x_mean
mse = sum((target - (w * value + b)) ** 2 for value, target in zip(x, y)) / len(x)
print(f"slope={w:.3f}, intercept={b:.3f}, mse={mse:.3f}")
