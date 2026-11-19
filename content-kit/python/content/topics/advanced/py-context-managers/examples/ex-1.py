class Session:
    def __enter__(self):
        print("enter")
        return "ready"
    def __exit__(self, exc_type, exc_value, traceback):
        print("exit", exc_type is None)
        return False


def main():
    with Session() as state:
        print(state)


if __name__ == "__main__":
    main()
