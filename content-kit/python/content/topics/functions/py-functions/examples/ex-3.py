def announce(mark):
    """Display a mark without returning a calculated result."""
    print(f"Mark: {mark}")


saved = announce(80)
print(saved)
print(saved is None)
