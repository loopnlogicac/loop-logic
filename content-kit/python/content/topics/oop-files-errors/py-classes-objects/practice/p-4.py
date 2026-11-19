class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1


def main():
    counters = {"A": Counter(), "B": Counter()}
    for label in input().split():
        counters[label].increment()
    print(counters["A"].value, counters["B"].value)


if __name__ == "__main__":
    main()
