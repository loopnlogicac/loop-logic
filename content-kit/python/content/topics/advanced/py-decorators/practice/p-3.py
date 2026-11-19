from functools import wraps

def add_charge(charge):
    def decorate(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            return function(*args, **kwargs) + charge
        return wrapper
    return decorate

def identity(amount):
    return amount


def main():
    charge, amount = map(int, input().split())
    charged = add_charge(charge)(identity)
    print(charged(amount))


if __name__ == "__main__":
    main()
