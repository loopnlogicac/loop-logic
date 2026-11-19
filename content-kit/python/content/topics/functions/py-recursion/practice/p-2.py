def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)


base, exponent = [int(token) for token in input().split()]
print(power(base, exponent))
