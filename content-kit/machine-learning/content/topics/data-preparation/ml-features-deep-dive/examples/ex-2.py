import numpy as np
heights = np.array([2, 2, 1.5, 2, 1.5, 2])
weights = np.array([80, 100, 45, 72, 54, 88])
for bmi in weights / heights ** 2:
    print(f"{bmi:.1f}")
