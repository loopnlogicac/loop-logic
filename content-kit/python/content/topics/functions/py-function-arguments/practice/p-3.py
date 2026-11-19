def add_roll(roll, history=None):
    """Return a history after appending one roll."""
    if history is None:
        history = []
    history.append(roll)
    return history


first, second = [int(token) for token in input().split()]
print(add_roll(first))
print(add_roll(second))
