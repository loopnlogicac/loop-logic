from functools import wraps

def announce(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print("begin")
        result = function(*args, **kwargs)
        print("end")
        return result
    return wrapper

@announce
def total(quantity, price):
    return quantity * price


def main():
    print(total(2, price=15))


if __name__ == "__main__":
    main()
