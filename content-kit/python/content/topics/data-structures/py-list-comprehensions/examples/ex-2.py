marks = [35, 60, 79, 40]
passes = [mark for mark in marks if mark >= 40]
labels = ["pass" if mark >= 40 else "retry" for mark in marks]
print(passes)
print(labels)
