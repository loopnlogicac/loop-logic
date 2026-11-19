import sys
values = list(map(float, sys.stdin.read().split()))
n = int(values[0])
x = values[1:1+n]
mean = sum(x) / n
print(f"{sum((v-mean)**2 for v in x):.3f}")
