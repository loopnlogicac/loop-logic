class Desk:
    room = "A"


def main():
    first, second = Desk(), Desk()
    first.room = "B"
    Desk.room = "C"
    print(first.room, second.room, Desk.room)


if __name__ == "__main__":
    main()
