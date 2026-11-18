command = input("Command: ")
match command:
    case "help":
        print("Commands: help, quit")
    case "quit":
        print("Goodbye")
    case _:
        print("Unknown command")
