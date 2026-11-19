rows, columns = input().split()
matrix = []
for row_number in range(int(rows)):
    row = []
    for token in input().split():
        row.append(int(token))
    matrix.append(row)
for row in matrix:
    print(sum(row))
