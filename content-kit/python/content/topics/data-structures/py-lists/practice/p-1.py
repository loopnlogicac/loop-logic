marks = []
for word in input().split():
    marks.append(int(word))
print(*marks[::-1])
