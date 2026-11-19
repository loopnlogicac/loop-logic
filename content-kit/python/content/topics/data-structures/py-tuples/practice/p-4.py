row, column = [int(token) for token in input().split()]
seats = {(1, 1): "occupied", (1, 2): "occupied"}
print(seats.get((row, column), "free"))
