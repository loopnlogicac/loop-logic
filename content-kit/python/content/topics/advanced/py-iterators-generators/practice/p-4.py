class Stepper:
    def __init__(self, start, stop, step):
        self.current, self.stop, self.step = start, stop, step
    def __iter__(self):
        return self
    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value


def main():
    print(*Stepper(*map(int, input().split())))
    print("END")


if __name__ == "__main__":
    main()
