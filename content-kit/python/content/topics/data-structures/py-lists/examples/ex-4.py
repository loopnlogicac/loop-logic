grid = []
for row in range(2):
    grid.append([0, 0, 0])
grid[0][1] = 7
shallow = grid.copy()
shallow[1][2] = 9
print(grid)
print(grid[0] is grid[1])
