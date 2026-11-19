from functools import wraps

def finishing(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        finally:
            print("END")
    return wrapper

@finishing
def reciprocal_denominator(number):
    return 100 // number


def main():
    try:
        print(reciprocal_denominator(int(input())))
    except ZeroDivisionError:
        print("ZERO")


if __name__ == "__main__":
    main()
