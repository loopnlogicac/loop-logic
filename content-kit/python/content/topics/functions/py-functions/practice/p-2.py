def divide_parts(dividend, divisor):
    """Return floor quotient and nonnegative remainder."""
    return dividend // divisor, dividend % divisor


a, b = [int(token) for token in input().split()]
quotient, remainder = divide_parts(a, b)
print(quotient, remainder)
