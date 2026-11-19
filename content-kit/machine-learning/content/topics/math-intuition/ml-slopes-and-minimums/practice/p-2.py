x, y, lr = map(float, input().split())
gx, gy = 2*(x-1), 4*(y+2)
new_x, new_y = x-lr*gx, y-lr*gy
print(f"{new_x:.3f} {new_y:.3f}")
