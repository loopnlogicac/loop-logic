start, lr, updates = input().split()
x, lr = float(start), float(lr)
for _ in range(int(updates)):
    x -= lr * 2 * (x - 2)
print(f"{x:.3f} {(x-2)**2:.3f}")
