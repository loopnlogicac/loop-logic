from math import sqrt
values = list(map(float, input().split()))
mean = sum(values) / len(values)
spread = sqrt(sum((v-mean)**2 for v in values) / len(values))
print(" ".join(f"{(v-mean)/(spread or 1):.3f}" for v in values))
