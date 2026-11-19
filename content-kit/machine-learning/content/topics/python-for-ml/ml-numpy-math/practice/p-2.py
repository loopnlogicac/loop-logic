import numpy as np

X = np.array(list(map(int, input().split()))).reshape(5, 2)
axis = int(input())
print(X.sum(axis=axis).tolist())
