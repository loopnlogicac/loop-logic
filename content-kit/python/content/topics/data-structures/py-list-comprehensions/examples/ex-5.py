seats = [[0 for column in range(3)] for row in range(2)]
seats[0][1] = 1
print(seats)
print(seats[0] is seats[1])
