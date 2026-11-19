values = list(map(int, input().split()))
heads = 0
for t, value in enumerate(values, 1):
    heads += value
    print(f"{heads/t:.3f}")
