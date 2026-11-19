import numpy as np

sizes = np.array(list(map(int, input().split())))
counts, _ = np.histogram(sizes, bins=[0, 3, 6, 9])
print(counts.tolist())
