def total(subtotal, fee=20):
    """Return subtotal plus the delivery fee."""
    return subtotal + fee


subtotal = int(input())
print(total(subtotal))
print(total(subtotal, fee=0))
