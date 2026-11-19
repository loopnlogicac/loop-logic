import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

kind = input().strip()
sizes = [2, 3, 4, 6, 7]
sweetness = [3, 2, 3, 7, 8]
fig, ax = plt.subplots()
if kind == "scatter":
    ax.scatter(sizes, sweetness)
else:
    ax.plot(sizes, sweetness, marker="o")
ax.set(title="Teaching fruit measurements", xlabel="Size (cm)", ylabel="Sweetness (0-10)")
fig.savefig("view.png")
plt.close(fig)
print(f"Saved view.png ({kind})")
