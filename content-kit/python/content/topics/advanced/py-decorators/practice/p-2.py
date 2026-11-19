from functools import wraps

def forward(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@forward
def add(a, b):
    return a + b


def main():
    a, b = map(int, input().split())
    print(add(a, b=b))


if __name__ == "__main__":
    main()
