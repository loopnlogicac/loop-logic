def at_least(limit):
    def accepts(mark):
        return mark >= limit
    return accepts


threshold = int(input())
marks = [int(token) for token in input().split()]
print(*filter(at_least(threshold), marks))
