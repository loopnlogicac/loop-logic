from functools import wraps

def tag(label):
    def decorate(function):
        @wraps(function)
        def wrapper():
            print(f"{label} enter")
            function()
            print(f"{label} exit")
        return wrapper
    return decorate

@tag("outer")
@tag("inner")
def action():
    print("body")


def main():
    action()


if __name__ == "__main__":
    main()
