


def main():
    a, b = map(int, input().split())
    try:
        print(a // b)
    except ZeroDivisionError:
        print("ZERO")
    finally:
        print("DONE")


if __name__ == "__main__":
    main()
