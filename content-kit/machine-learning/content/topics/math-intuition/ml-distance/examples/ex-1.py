import json
import math

a, b = [1, 1], [4, 5]
dx, dy = b[0] - a[0], b[1] - a[1]
result = dict(dx=dx, dy=dy, euclidean=round(math.sqrt(dx*dx + dy*dy), 3),
              manhattan=abs(dx) + abs(dy))
print(json.dumps(result, sort_keys=True))
