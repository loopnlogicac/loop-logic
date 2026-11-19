import json
import numpy as np

table = np.array([[9, 1], [99, 891]], dtype=float)
positive = float(table[:, 0].sum())
print(json.dumps(dict(truePositive=float(table[0, 0]), falsePositive=float(table[1, 0]),
                      positive=positive, posterior=round(float(table[0, 0])/positive, 3)),
                 sort_keys=True))
