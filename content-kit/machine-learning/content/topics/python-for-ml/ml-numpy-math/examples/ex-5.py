import numpy as np

rng = np.random.default_rng(0)
first = rng.integers(0, 10, size=5)
second = rng.integers(0, 10, size=5)
restarted = np.random.default_rng(0).integers(0, 10, size=5)
print(f"First draw: {first.tolist()}")
print(f"Next draw: {second.tolist()}")
print(f"Restart repeats first: {np.array_equal(first, restarted)}")
