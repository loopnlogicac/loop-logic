counts = [0, 0, 0]
for v in map(float, input().split()):
    counts[0 if v < 10 else 1 if v < 20 else 2] += 1
print(*counts)
