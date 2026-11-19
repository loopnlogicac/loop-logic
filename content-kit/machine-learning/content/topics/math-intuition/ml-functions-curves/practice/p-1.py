import math

x = float(input())
values = [2*x+1, x*x, math.exp(x), math.log(x), 1/(1+math.exp(-x))]
for value in values:
    print(f"{value:.3f}")
