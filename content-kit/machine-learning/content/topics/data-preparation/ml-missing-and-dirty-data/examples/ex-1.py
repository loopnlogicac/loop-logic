from statistics import median
rows = [[2, 1], [4, 2], [None, 3], [6, None], [8, 5], [None, 6]]
fills = [median(row[j] for row in rows if row[j] is not None) for j in range(2)]
filled = [[fills[j] if value is None else value for j, value in enumerate(row)]
          for row in rows]
print(f"Fill x: {fills[0]:.3f}")
print(f"Fill y: {fills[1]:.3f}")
print(f"Missing: {sum(value is None for row in rows for value in row)}")
print(f"Total: {sum(map(sum, filled)):.3f}")
