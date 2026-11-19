day = input()
match day:
    case "Fri" | "Sat":
        print("short")
    case _:
        print("regular")
