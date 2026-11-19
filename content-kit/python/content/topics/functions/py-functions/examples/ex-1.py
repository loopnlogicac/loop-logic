def bill(quantity, unit_price):
    """Return the total cost in whole taka."""
    total = quantity * unit_price
    return total


cost = bill(3, 20)
print(f"Bill: {cost} taka")
print(bill(2, 15) + 5)
