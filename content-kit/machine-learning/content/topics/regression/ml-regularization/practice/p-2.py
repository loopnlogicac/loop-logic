import sys
values = list(map(float, sys.stdin.read().split()))
n, alpha = int(values[0]), values[1]
weights = values[2:2+n]
print(f"{alpha*sum(abs(w) for w in weights):.3f} "
      f"{alpha*sum(w*w for w in weights):.3f}")
