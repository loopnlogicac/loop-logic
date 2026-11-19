class Notice:
    def show(self):
        print("base")

class Urgent(Notice):
    def show(self):
        super().show()
        print("urgent")


def main():
    Urgent().show()


if __name__ == "__main__":
    main()
