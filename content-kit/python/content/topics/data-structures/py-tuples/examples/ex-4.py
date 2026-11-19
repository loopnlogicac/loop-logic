seats = {(1, 2): "occupied", (2, 1): "free"}
position = (1, 2)
print(seats[position])
print(seats.get((9, 9), "unknown"))
