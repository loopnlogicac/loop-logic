import json

points = [(0, 1), (1, 3), (2, 6), (3, 6), (4, 9)]
slope, intercept, qx = 2, 1, 6
errors = [y - (slope*x + intercept) for x, y in points]
print(json.dumps(dict(prediction=slope*qx + intercept,
                      mse=round(sum(e*e for e in errors)/len(errors), 3)), sort_keys=True))
