class IgnoreMissing:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, KeyError)


def main():
    with IgnoreMissing():
        {}["missing"]
    print("continued")


if __name__ == "__main__":
    main()
