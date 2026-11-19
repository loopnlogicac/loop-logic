sizes = list(map(int, input().split()))
print(f"count={len(sizes)}")
print(f"mean={sum(sizes) / len(sizes):.2f}")
