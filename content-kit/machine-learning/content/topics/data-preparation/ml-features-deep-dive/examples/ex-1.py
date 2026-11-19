heights = [2, 2, 1.5, 2, 1.5, 2]
weights = [80, 100, 45, 72, 54, 88]
for height, weight in zip(heights, weights):
    print(f"{weight / height ** 2:.1f}")
