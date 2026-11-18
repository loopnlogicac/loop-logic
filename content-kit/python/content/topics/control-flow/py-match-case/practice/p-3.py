command = input()
count = int(input())
match (command, count):
    case ("book", quantity) if 1 <= quantity <= 5:
        print("accepted")
    case ("book", _):
        print("invalid")
    case _:
        print("unknown")
