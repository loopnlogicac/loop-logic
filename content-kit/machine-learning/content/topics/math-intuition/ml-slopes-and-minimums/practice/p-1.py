x_text, rate_text, count_text = input().split()
x, rate, count = float(x_text), float(rate_text), int(count_text)
for _ in range(count):
    x -= rate*2*(x-1)
print(f"{x:.3f}")
print(f"{(x-1)**2:.3f}")
