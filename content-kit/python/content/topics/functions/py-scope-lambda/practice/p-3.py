values = [int(token) for token in input().split()]
print(*sorted(values, key=lambda value: (abs(value), value)))
