import json
import math

x = 2
result = dict(line=2*x + 1, square=x*x, exp=round(math.exp(x), 3),
              log=round(math.log(x), 3), sigmoid=round(1/(1+math.exp(-x)), 3))
print(json.dumps(result, sort_keys=True))
