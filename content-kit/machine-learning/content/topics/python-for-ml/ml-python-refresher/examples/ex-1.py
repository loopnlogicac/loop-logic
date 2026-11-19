fruits = [("apple", 2, 3), ("apple", 3, 2), ("mango", 6, 7),
          ("mango", 7, 8), ("mango", 8, 7)]
counts = {}
for label, size, sweetness in fruits:
    counts[label] = counts.get(label, 0) + 1
print(f"First card: {fruits[0]}")
print(f"Counts: {counts}")
