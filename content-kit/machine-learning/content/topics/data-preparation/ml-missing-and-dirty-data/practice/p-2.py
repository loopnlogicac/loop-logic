hours = map(float, input().split())
print(sum(v < 0 or v > 24 for v in hours))
