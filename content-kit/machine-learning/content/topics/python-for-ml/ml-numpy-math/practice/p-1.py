import numpy as np
import pandas as pd

offsets = np.array(list(map(int, input().split())))
frame = pd.read_csv("tiny_fruits.csv")
X = frame[["size_cm", "sweetness"]].to_numpy(dtype=int)
print((X + offsets).tolist())
