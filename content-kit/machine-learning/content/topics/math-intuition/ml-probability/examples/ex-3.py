import numpy as np

rng = np.random.default_rng(0)
coins = rng.random(10000) < 0.5
dice = rng.integers(1, 7, size=10000)
for n in [10, 100, 1000, 10000]:
    print(f"n={n}: heads={coins[:n].mean():.3f} sixes={(dice[:n] == 6).mean():.3f}")
