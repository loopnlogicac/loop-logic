import math

a = list(map(float, input().split()))
b = list(map(float, input().split()))
dx, dy = b[0]-a[0], b[1]-a[1]
print(f"{math.hypot(dx, dy):.3f}")
print(f"{abs(dx)+abs(dy):.3f}")
