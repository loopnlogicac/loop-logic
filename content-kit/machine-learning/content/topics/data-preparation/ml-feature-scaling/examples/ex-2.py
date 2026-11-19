import numpy as np
from sklearn.preprocessing import MinMaxScaler
rows = np.array([[1, 100], [2, 900], [3, 300], [3, 680], [5, 500], [6, 600]])
query = np.array([[3, 800]])
scaler = MinMaxScaler().fit(rows)
scaled = scaler.transform(rows)
q = scaler.transform(query)[0]
print(f"Raw nearest: {np.argmin(((rows-query[0])**2).sum(axis=1))+1}")
print(f"Scaled nearest: {np.argmin(((scaled-q)**2).sum(axis=1))+1}")
print(f"First: {scaled[0, 0]:.3f}, {scaled[0, 1]:.3f}")
