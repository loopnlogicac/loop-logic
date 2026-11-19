import json
import numpy as np

X = np.array([[1, 2], [3, 1], [2, 4], [0, 2], [4, 0]])
w = np.array([2, 1])
output = X @ w
print(json.dumps(dict(rows=X.shape[0], cols=X.shape[1], total=int(output.sum())),
                 sort_keys=True))
