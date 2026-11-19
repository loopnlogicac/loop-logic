rate = 5


def outer():
    rate = 3

    def inner(amount):
        local_fee = 2
        return amount * rate + local_fee + len("A")

    return inner(10)


print(outer())
print(rate)
