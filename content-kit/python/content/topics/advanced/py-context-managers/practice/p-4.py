class MissingLookup:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, KeyError)


def main():
    key = input()
    with MissingLookup():
        print({"A": 10, "B": 20}[key])
    print("DONE")


if __name__ == "__main__":
    main()
