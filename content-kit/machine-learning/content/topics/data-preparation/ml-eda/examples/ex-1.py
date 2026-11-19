from math import sqrt
x = [-2, -1, 0, 0, 1, 2]
noise = [1, -2, 1, 1, -2, 1]
x_scale = sqrt(sum(v*v for v in x) / len(x))
e_scale = sqrt(sum(v*v for v in noise) / len(noise))
x = [v/x_scale for v in x]
e = [v/e_scale for v in noise]
y = [0.6*a + sqrt(1-0.6**2)*b for a, b in zip(x, e)]

xx = sum(v*v for v in x)
yy = sum(v*v for v in y)
xy = sum(a*b for a, b in zip(x, y))
print(f"r: {xy / sqrt(xx*yy):.3f}")
print(f"Slope: {xy/xx:.3f}")
print(f"Intercept: {sum(y)/len(y):.3f}")
