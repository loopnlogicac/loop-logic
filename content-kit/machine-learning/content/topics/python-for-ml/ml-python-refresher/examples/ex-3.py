def average(values):
    if not values:
        return None
    return sum(values) / len(values)


def main():
    sizes = [2, 3, 4, 5, 6]
    result = average(sizes)
    print(f"Average: {result:.2f} cm")
    print(f"Empty list: {average([])}")


if __name__ == "__main__":
    main()
