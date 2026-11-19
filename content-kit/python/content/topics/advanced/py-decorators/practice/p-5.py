from functools import wraps

def counted(function):
    calls = 0
    @wraps(function)
    def wrapper(*args, **kwargs):
        nonlocal calls
        calls += 1
        return calls, function(*args, **kwargs)
    return wrapper

@counted
def square(number):
    return number * number


def main():
    limit = int(input())
    if limit == 0:
        print("EMPTY")
    for number in range(1, limit + 1):
        print(*square(number))


if __name__ == "__main__":
    main()
