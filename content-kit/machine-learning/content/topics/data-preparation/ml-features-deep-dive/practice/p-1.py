height, weight = map(float, input().split())
if height <= 0 or weight <= 0:
    print("INVALID")
else:
    print(f"{weight / height ** 2:.3f}")
