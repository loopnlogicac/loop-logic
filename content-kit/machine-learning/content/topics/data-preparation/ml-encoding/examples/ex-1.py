districts = ["Badda", "Mirpur", "Uttara", "Badda", "Mirpur", "Uttara"]
categories = sorted(set(districts))
rows = [[int(value == category) for category in categories] for value in districts]
print(f"Columns: {', '.join(categories)}")
print(f"Rows: {len(rows)}")
print(f"Ones: {sum(map(sum, rows))}")
print(f"First: {rows[0]}")
