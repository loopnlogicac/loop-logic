y = [2, 4, 6, 8, 10]
pred = [3, 3, 7, 7, 10]

import math
errors = [a - b for a, b in zip(y, pred)]
mae = sum(abs(e) for e in errors) / len(y)
mse = sum(e * e for e in errors) / len(y)
y_mean = sum(y) / len(y)
sst = sum((v - y_mean) ** 2 for v in y)
r2 = 1 - sum(e * e for e in errors) / sst
print(f"mae={mae:.3f}, mse={mse:.3f}, rmse={math.sqrt(mse):.3f}, r2={r2:.3f}")
