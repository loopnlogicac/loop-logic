values = []
for word in input().split():
    values.append(int(word))
ordered = values.copy()
ordered.sort()
print(*values)
print(*ordered)
