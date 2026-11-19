labels = input().split()
counts = {"apple": 0, "mango": 0}
for label in labels:
    counts[label] += 1
for label in ["apple", "mango"]:
    print(f"{label}={counts[label]}")
