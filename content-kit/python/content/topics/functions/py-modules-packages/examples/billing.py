"""Small reusable billing calculations."""

CURRENCY = "BDT"


def total(quantity, unit_price):
    """Return the total cost in whole taka."""
    return quantity * unit_price


if __name__ == "__main__":
    print(total(2, 15))
