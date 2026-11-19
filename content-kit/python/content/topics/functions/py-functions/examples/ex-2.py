def bounds(values):
    """Return the smallest and largest items of a nonempty sequence."""
    return min(values), max(values)


low, high = bounds([72, 85, 64, 91])
pair = bounds([50])
print(low, high)
print(pair)
