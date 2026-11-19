from functools import wraps

def double_result(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return 2 * function(*args, **kwargs)
    return wrapper

@double_result
def identity(number):
    return number


def main():
    print(identity(int(input())))


if __name__ == "__main__":
    main()
