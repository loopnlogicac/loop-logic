from math import sqrt
x = list(map(float, input().split()))
y = list(map(float, input().split()))
x_mean, y_mean = sum(x)/len(x), sum(y)/len(y)
dx = [v-x_mean for v in x]
dy = [v-y_mean for v in y]
xx, yy = sum(v*v for v in dx), sum(v*v for v in dy)
if xx == 0 or yy == 0:
    print("UNDEFINED")
else:
    print(f"{sum(a*b for a,b in zip(dx,dy))/sqrt(xx*yy):.3f}")
