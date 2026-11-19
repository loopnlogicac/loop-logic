def factorial_loop(number):
    result = 1
    for factor in range(2, number + 1):
        result *= factor
    return result


print(factorial_loop(20))
print(factorial_loop(0))
