import json
import numpy as np

points = np.array([[0, 1], [1, 3], [2, 6], [3, 6], [4, 9]])
predictions = 2 * points[:, 0] + 1
mse = np.mean((points[:, 1] - predictions) ** 2)
print(json.dumps(dict(prediction=2*6+1, mse=round(float(mse), 3)), sort_keys=True))
