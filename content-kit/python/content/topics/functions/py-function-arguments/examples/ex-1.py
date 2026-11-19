def receipt(item, quantity, unit_price=10):
    """Return a one-line receipt using a default price if omitted."""
    return f"{item}: {quantity * unit_price} taka"


print(receipt("pen", 3))
print(receipt(quantity=2, item="ruler", unit_price=15))
print(receipt("notebook", unit_price=60, quantity=2))
