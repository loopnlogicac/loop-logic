def remember(roll, history=None):
    """Append a roll; create a fresh history when none is supplied."""
    if history is None:
        history = []
    history.append(roll)
    return history


print(remember(12))
print(remember(18))
saved = [5]
print(remember(25, saved))
print(saved)
