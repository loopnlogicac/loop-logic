def largest(values):
    """Return the maximum, or None for an empty sequence."""
    if not values:
        return None
    return max(values)


values = [int(token) for token in input().split()]
result = largest(values)
print("EMPTY" if result is None else result)
