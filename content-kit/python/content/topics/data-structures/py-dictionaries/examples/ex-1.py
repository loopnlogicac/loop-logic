marks = {12: 72, 18: 85}
print(marks[12])
print(marks.get(99, "missing"))
marks[12] = 78
marks[25] = 91
print(list(marks.items()))
