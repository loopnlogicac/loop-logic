class Ticket:
    def __init__(self, price):
        self.price = price
    def cost(self):
        return self.price

class StudentTicket(Ticket):
    def cost(self):
        return self.price // 2


def main():
    kind = input()
    price = int(input())
    ticket = StudentTicket(price) if kind == "STUDENT" else Ticket(price)
    print(ticket.cost())


if __name__ == "__main__":
    main()
