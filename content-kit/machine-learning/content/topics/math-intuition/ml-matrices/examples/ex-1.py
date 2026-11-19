import json

X = [[1, 2], [3, 1], [2, 4], [0, 2], [4, 0]]
w = [2, 1]
output = [sum(value*weight for value, weight in zip(row, w)) for row in X]
print(json.dumps(dict(rows=len(X), cols=len(w), total=sum(output)), sort_keys=True))
