rate = 10


def calculate(amount, rate):
    return amount * rate


amount, local_rate = [int(token) for token in input().split()]
print(calculate(amount, local_rate))
print(rate)
