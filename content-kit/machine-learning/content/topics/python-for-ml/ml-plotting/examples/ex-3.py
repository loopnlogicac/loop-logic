import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

sizes = np.array([2, 3, 4, 6, 7, 9])
edges = [0, 3, 6, 9]
counts, _ = np.histogram(sizes, bins=edges)
fig, ax = plt.subplots(figsize=(6, 4))
ax.hist(sizes, bins=edges, edgecolor="black")
ax.set(title="Six teaching fruit sizes", xlabel="Size (cm)", ylabel="Fruit count",
       xticks=edges, yticks=[0, 1, 2, 3])
fig.tight_layout()
fig.savefig("size-histogram.png", dpi=110)
plt.close(fig)
print(f"Bin counts: {counts.tolist()}")
print("Saved size-histogram.png: counts in [0,3), [3,6), and [6,9].")
