def double(number):
    return number * 2


def apply_twice(function, value):
    return function(function(value))


saved = double
print(saved(5))
print(apply_twice(double, 5))
