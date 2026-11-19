import json
import numpy as np

x = 2
result = dict(line=2*x + 1, square=x*x, exp=round(float(np.exp(x)), 3),
              log=round(float(np.log(x)), 3),
              sigmoid=round(float(1/(1+np.exp(-x))), 3))
print(json.dumps(result, sort_keys=True))
