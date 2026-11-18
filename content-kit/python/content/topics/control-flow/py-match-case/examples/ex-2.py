day = "Fri"
match day:
    case "Fri" | "Sat":
        print("Reduced lab hours")
    case _:
        print("Regular lab hours")
