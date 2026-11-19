def remember(roll, history=[]):
    """Append to a shared default history; avoid this API design."""
    history.append(roll)
    return history.copy()


print(remember(12))
print(remember(18))
print(remember(25, []))
