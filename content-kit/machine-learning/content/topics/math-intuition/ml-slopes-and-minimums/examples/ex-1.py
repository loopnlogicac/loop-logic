import json

x, lr = 4.0, 0.25
for _ in range(12):
    slope = 2 * (x - 1)
    x = x - lr * slope
print(json.dumps(dict(x=round(x, 3), cost=round((x-1)**2, 3)), sort_keys=True))
