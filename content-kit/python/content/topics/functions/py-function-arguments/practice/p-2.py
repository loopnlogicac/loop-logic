def add_all(*values):
    """Return the sum of all supplied numbers."""
    return sum(values)


values = [int(token) for token in input().split()]
print(add_all(*values))
