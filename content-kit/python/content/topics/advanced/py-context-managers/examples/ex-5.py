from contextlib import contextmanager

@contextmanager
def named(label):
    print(f"open {label}")
    try:
        yield label
    finally:
        print(f"close {label}")


def main():
    with named("A"), named("B"):
        print("body")


if __name__ == "__main__":
    main()
