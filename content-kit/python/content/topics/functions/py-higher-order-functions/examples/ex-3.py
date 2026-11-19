def passed(mark):
    return mark >= 40


marks = [35, 40, 79, 0]
print(list(filter(passed, marks)))
print(list(filter(None, [0, 2, "", "lab", None])))
print([mark for mark in marks if passed(mark)])
