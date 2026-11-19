import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

frame = pd.read_csv("fruits.csv")
fig, ax = plt.subplots(figsize=(6, 4))
for label, marker in [("apple", "o"), ("lychee", "s"), ("mango", "^")]:
    group = frame.loc[frame["label"] == label]
    ax.scatter(group["size_cm"], group["weight_g"], label=label,
               marker=marker, alpha=0.75, s=24)
ax.set(title="Invented fruit measurements", xlabel="Size (cm)", ylabel="Weight (g)")
ax.legend(title="Fruit label")
fig.tight_layout()
fig.savefig("fruit-scatter.png", dpi=110)
plt.close(fig)
print("Saved fruit-scatter.png: size and weight, with a marker for each fruit label.")
