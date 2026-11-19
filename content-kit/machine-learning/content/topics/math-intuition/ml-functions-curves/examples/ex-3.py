import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-4, 4, 81)
positive = x[x > 0]
fig, axes = plt.subplots(1, 5, figsize=(14, 3))
curves = [(x, 2*x+1, "Line"), (x, x*x, "Square"), (x, np.exp(x), "Exp"),
          (positive, np.log(positive), "Log"), (x, 1/(1+np.exp(-x)), "Sigmoid")]
for axis, (inputs, outputs, title) in zip(axes, curves):
    axis.plot(inputs, outputs)
    axis.set_title(title)
    axis.set_xlabel("x")
    axis.grid(alpha=0.3)
fig.tight_layout()
fig.savefig("five-curves.png")
plt.close(fig)
print("Saved five curves: log uses only positive x; sigmoid stays between 0 and 1.")
