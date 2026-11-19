import json
import numpy as np

a = np.array([2, 1])
b = np.array([1, 3])
total = a + b
scaled = 2 * total
print(json.dumps(dict(sumX=int(total[0]), sumY=int(total[1]),
                      scaledX=int(scaled[0]), scaledY=int(scaled[1])), sort_keys=True))
