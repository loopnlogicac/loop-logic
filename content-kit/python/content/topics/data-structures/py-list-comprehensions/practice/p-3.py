rows = []
for row_number in range(int(input())):
    rows.append([int(token) for token in input().split()])
print(*[value for row in rows for value in row])
