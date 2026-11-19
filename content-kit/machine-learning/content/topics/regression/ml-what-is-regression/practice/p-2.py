import sys
values = list(map(float, sys.stdin.read().split()))
n = int(values[0])
print(f"{sum(values[1:1+n])/n:.3f}")
