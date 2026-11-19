import numpy as np

sizes = np.array(list(map(int, input().split())))
cutoff = int(input())
print(sizes[sizes >= cutoff].tolist())
