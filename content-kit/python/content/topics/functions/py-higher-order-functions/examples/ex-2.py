def square(number):
    return number * number


mapped = map(square, [2, -3, 4])
print(list(mapped))
print(list(mapped))
sums = map(lambda a, b: a + b, [1, 2, 3], [10, 20])
print(list(sums))
