rows, columns = [int(token) for token in input().split()]
grid = [[(row + 1) * (column + 1) for column in range(columns)]
        for row in range(rows)]
for row in grid:
    print(*row)
