from functools import wraps

def keep_metadata(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@keep_metadata
def square(number):
    """Return the square."""
    return number * number


def main():
    print(square.__name__)
    print(square.__doc__)
    print(square.__wrapped__(4))


if __name__ == "__main__":
    main()
