values = map(float, input().split())
print(" ".join(f"{v / 100:.2f}" for v in values))
