from functools import wraps

def minimum(limit):
    def decorate(function):
        @wraps(function)
        def wrapper(amount):
            if amount < limit:
                raise ValueError("below minimum")
            return function(amount)
        return wrapper
    return decorate

@minimum(10)
def accept(amount):
    return amount * 2


def main():
    print(accept(12))
    try:
        accept(5)
    except ValueError as error:
        print(str(error))


if __name__ == "__main__":
    main()
