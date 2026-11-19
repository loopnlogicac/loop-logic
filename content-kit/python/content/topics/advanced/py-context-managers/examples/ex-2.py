class Cleanup:
    def __enter__(self):
        print("enter")
        return self
    def __exit__(self, exc_type, exc_value, traceback):
        print("cleanup")
        return False


def main():
    try:
        with Cleanup():
            raise ValueError("bad")
    except ValueError:
        print("caught outside")


if __name__ == "__main__":
    main()
