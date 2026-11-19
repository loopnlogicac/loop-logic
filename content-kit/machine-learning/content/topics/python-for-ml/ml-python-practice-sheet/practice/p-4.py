import numpy as np

values = np.array(list(map(int, input().split())))
counts, _ = np.histogram(values, bins=[0, 5, 10])
print(counts.tolist())
print(f"total={int(counts.sum())}")
