from dataclasses import dataclass, replace

@dataclass(frozen=True)
class Booking:
    room: str
    seats: int


def main():
    room = input()
    old, new = map(int, input().split())
    booking = Booking(room, old)
    revised = replace(booking, seats=new)
    print(booking.seats, revised.seats, booking is revised)


if __name__ == "__main__":
    main()
