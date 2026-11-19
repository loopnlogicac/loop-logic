def mean(values):
    """Return the arithmetic mean, or None for no values."""
    if not values:
        return None
    return sum(values) / len(values)


for marks in [[], [70, 80, 90]]:
    average = mean(marks)
    if average is None:
        print("No marks")
    else:
        print(f"Average: {average:.1f}")
