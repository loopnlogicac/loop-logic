import json
import numpy as np

x = np.array([4.0])
for _ in range(12):
    gradient = 2 * (x - 1)
    x = x - 0.25 * gradient
print(json.dumps(dict(x=round(float(x[0]), 3),
                      cost=round(float((x[0]-1)**2), 3)), sort_keys=True))
