class Room:
    def label(self):
        return "Lab A"

class Team:
    def label(self):
        return "Blue"

def show_label(item):
    print(item.label())


def main():
    show_label(Room())
    show_label(Team())


if __name__ == "__main__":
    main()
