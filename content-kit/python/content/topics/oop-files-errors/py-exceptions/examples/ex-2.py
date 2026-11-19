class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds("balance too small")
    return balance - amount


def main():
    try:
        print(withdraw(100, 150))
    except InsufficientFunds as error:
        print(str(error))
    print(withdraw(100, 40))


if __name__ == "__main__":
    main()
