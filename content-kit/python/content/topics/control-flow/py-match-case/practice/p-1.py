command = input()
match command:
    case "help":
        print("guide")
    case "quit":
        print("bye")
    case _:
        print("unknown")
