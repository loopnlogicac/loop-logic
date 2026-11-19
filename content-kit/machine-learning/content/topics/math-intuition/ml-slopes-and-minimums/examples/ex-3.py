import numpy as np

point = np.array([4.0, 2.0])
gradient = np.array([2*(point[0]-1), 4*(point[1]+2)])
moved = point - 0.1 * gradient
old_cost = (point[0]-1)**2 + 2*(point[1]+2)**2
new_cost = (moved[0]-1)**2 + 2*(moved[1]+2)**2
print("gradient:", [round(float(v), 3) for v in gradient])
print("new point:", [round(float(v), 3) for v in moved])
print(f"cost: {old_cost:.3f} -> {new_cost:.3f}")
