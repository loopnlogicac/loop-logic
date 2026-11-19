class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


def main():
    counter = Countdown(3)
    print(next(counter))
    print(list(counter))
    print(next(counter, "done"))


if __name__ == "__main__":
    main()
