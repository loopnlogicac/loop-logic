m, c = map(float, input().split())
xs = list(map(float, input().split()))
ys = list(map(float, input().split()))
mse = sum((y-(m*x+c))**2 for x,y in zip(xs,ys))/5
print(f"{mse:.3f}")
