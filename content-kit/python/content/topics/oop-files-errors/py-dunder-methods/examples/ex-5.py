class InvalidLength:
    def __len__(self):
        return -1


def main():
    try:
        len(InvalidLength())
    except ValueError:
        print("length must be nonnegative")


if __name__ == "__main__":
    main()
