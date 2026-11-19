def options_total(**options):
    """Return the sum of all numeric option values."""
    return sum(options.values())


options = {}
for token in input().split():
    name, value = token.split("=", 1)
    options[name] = int(value)
print(options_total(**options))
