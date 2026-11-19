import numpy as np
from sklearn.impute import SimpleImputer
rows = np.array([[2, 1], [4, 2], [np.nan, 3], [6, np.nan], [8, 5], [np.nan, 6]])
imputer = SimpleImputer(strategy="median")
filled = imputer.fit_transform(rows)
print(f"Fill x: {imputer.statistics_[0]:.3f}")
print(f"Fill y: {imputer.statistics_[1]:.3f}")
print(f"Missing: {np.isnan(rows).sum()}")
print(f"Total: {filled.sum():.3f}")
