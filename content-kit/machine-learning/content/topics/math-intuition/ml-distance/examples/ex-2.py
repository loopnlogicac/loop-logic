import json
import numpy as np

difference = np.array([4, 5]) - np.array([1, 1])
result = dict(dx=int(difference[0]), dy=int(difference[1]),
              euclidean=round(float(np.linalg.norm(difference)), 3),
              manhattan=int(np.abs(difference).sum()))
print(json.dumps(result, sort_keys=True))
