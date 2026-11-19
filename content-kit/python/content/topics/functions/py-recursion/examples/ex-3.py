def gcd(first, second):
    """Return the nonnegative greatest common divisor."""
    if second == 0:
        return abs(first)
    return gcd(second, first % second)


print(gcd(48, 18))
print(gcd(0, 0))
