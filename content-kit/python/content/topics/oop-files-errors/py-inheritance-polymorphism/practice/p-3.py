class Box:
    def __init__(self, value):
        self.value = value
    def weight(self):
        return self.value

class Packet:
    def __init__(self, value):
        self.value = value
    def weight(self):
        return self.value

def total(items):
    return sum(item.weight() for item in items)


def main():
    items = [(Box if i % 2 == 0 else Packet)(v)
             for i, v in enumerate(map(int, input().split()))]
    print(total(items))


if __name__ == "__main__":
    main()
