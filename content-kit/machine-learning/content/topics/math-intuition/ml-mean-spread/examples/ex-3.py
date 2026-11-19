import pandas as pd

sizes = pd.read_csv("fruits.csv")["size_cm"]
summary = sizes.describe()
for name in ["count", "mean", "std", "min", "50%", "max"]:
    print(f"{name}: {summary[name]:.3f}")
print(f"population std: {sizes.std(ddof=0):.3f}")
print("modes:", sizes.mode().tolist())
