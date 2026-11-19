import numpy as np

X = np.array(list(map(int, input().split()))).reshape(5, 2)
print(X.shape)
print(X[:, 0].tolist())
