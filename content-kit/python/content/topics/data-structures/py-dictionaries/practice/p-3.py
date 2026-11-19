marks = [int(token) for token in input().split()]
threshold = int(input())
kept = {index: mark for index, mark in enumerate(marks, 1) if mark >= threshold}
for index, mark in kept.items():
    print(index, mark)
