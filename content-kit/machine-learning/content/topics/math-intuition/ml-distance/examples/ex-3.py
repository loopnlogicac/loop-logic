import numpy as np
import pandas as pd
from sklearn.metrics import pairwise_distances

X = pd.read_csv("tiny_fruits.csv")[["size_cm", "sweetness"]].to_numpy()
difference = X[1] - X[0]
manual = float(np.sqrt(np.sum(difference ** 2)))
library = float(pairwise_distances(X[:1], X[1:2], metric="euclidean")[0, 0])
print(f"manual={manual:.3f} library={library:.3f}")
print(f"city blocks={np.abs(difference).sum():.3f}")
