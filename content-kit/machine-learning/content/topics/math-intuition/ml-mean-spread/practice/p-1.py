import math

values = list(map(float, input().split()))
mean = sum(values)/len(values)
variance = sum((v-mean)**2 for v in values)/len(values)
print(f"{mean:.3f}")
print(f"{variance:.3f}")
print(f"{math.sqrt(variance):.3f}")
