rows = [[2, 4], [], [6, 8, 10]]
flat = [value for row in rows for value in row]
even_positions = [flat[index] for index in range(0, len(flat), 2)]
print(flat)
print(even_positions)
