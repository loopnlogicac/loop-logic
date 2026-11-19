def at_least(limit):
    def accepts(value):
        return value >= limit
    return accepts


pass_test = at_least(40)
distinction_test = at_least(80)
marks = [35, 40, 75, 90]
print(list(filter(pass_test, marks)))
print(list(filter(distinction_test, marks)))
