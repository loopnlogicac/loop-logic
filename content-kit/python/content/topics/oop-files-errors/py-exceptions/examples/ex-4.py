def calculate():
    try:
        return 42
    finally:
        print("cleanup")


def main():
    print(calculate())


if __name__ == "__main__":
    main()
