y = [2, 4, 6, 8, 10]
pred = [3, 3, 7, 7, 10]

import math
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
mae = mean_absolute_error(y, pred)
mse = mean_squared_error(y, pred)
print(f"mae={mae:.3f}, mse={mse:.3f}, rmse={math.sqrt(mse):.3f}, r2={r2_score(y, pred):.3f}")
