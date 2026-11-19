marks = [[70, 80, 90], [65, 75, 85]]
columns = [[row[column] for row in marks] for column in range(3)]
print(columns)
print([sum(column) for column in columns])
