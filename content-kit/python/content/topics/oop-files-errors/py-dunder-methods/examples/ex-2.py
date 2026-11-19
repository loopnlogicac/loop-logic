class Marks:
    def __init__(self, values):
        self.values = list(values)
    def __len__(self):
        return len(self.values)


def main():
    group = Marks([70, 80])
    empty = Marks([])
    print(len(group), bool(group), bool(empty))


if __name__ == "__main__":
    main()
