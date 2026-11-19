import json
import numpy as np

values = np.array([2, 2, 3, 3, 4, 6], dtype=float)
print(json.dumps(dict(mean=round(float(values.mean()), 3),
                      median=round(float(np.median(values)), 3),
                      variance=round(float(values.var(ddof=0)), 3),
                      std=round(float(values.std(ddof=0)), 3)), sort_keys=True))
