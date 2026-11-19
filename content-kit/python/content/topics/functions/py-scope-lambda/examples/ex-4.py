records = [(12, 80), (18, 70), (25, 80)]
ranked = sorted(records, key=lambda record: (-record[1], record[0]))
print(ranked)
add_tax = lambda price: price * 1.05
print(f"{add_tax(100):.2f}")
