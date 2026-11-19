x, degree = input().split()
x = float(x)
print(" ".join(f"{x**j:.3f}" for j in range(1,int(degree)+1)))
