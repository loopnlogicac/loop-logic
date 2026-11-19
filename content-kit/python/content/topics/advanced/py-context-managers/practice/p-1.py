class Marker:
    def __enter__(self):
        print("OPEN")
        return self
    def __exit__(self, exc_type, exc_value, traceback):
        print("CLOSE")
        return False


def main():
    word = input()
    with Marker():
        print(word)


if __name__ == "__main__":
    main()
