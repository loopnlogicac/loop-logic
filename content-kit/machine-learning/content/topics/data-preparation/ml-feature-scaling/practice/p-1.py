low, high = map(float, input().split())
values = map(float, input().split())
print(" ".join(f"{(v-low)/(high-low):.3f}" for v in values))
