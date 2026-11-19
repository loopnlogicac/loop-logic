def make_multiplier(factor):
    return lambda value: factor * value


factor, value = [int(token) for token in input().split()]
multiply = make_multiplier(factor)
print(multiply(value))
