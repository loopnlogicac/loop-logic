import runpy


def total(quantity, price):
    return quantity * price


def main():
    print(f"Entry name: {__name__}")
    namespace = runpy.run_path(__file__, run_name="billing_library")
    print(namespace["total"](3, 20))


if __name__ == "__main__":
    main()
