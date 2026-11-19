from math import sqrt
x = [-2, -1, 0, 0, 1, 2]
noise = [1, -2, 1, 1, -2, 1]
x_scale = sqrt(sum(v*v for v in x) / len(x))
e_scale = sqrt(sum(v*v for v in noise) / len(noise))
x = [v/x_scale for v in x]
e = [v/e_scale for v in noise]
y = [0.6*a + sqrt(1-0.6**2)*b for a, b in zip(x, e)]

import numpy as np
from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(np.array(x).reshape(-1, 1), y)
print(f"r: {np.corrcoef(x, y)[0, 1]:.3f}")
print(f"Slope: {model.coef_[0]:.3f}")
print(f"Intercept: {abs(model.intercept_):.3f}")
