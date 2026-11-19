x = [1, 2, 3, 4, 5]
y = [3, 4, 5, 4, 9]

b = 1.4
slopes = [i / 10 for i in range(-10, 41)]
costs = [sum((target - (w * value + b)) ** 2
             for value, target in zip(x, y)) / len(x) for w in slopes]
best = min(range(len(slopes)), key=lambda i: costs[i])
selected = 1.0
mse = sum((target - (selected * value + b)) ** 2
          for value, target in zip(x, y)) / len(x)
print(f"slope={selected:.3f}, mse={mse:.3f}, "
      f"best_slope={slopes[best]:.3f}, best_mse={costs[best]:.3f}")
