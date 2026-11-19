def increment(number):
    return number + 1


def apply_twice(function, value):
    return function(function(value))


print(apply_twice(increment, int(input())))
