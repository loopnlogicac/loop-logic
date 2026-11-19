region = input()
weight = int(input())
match (region, weight):
    case ("city", kg) if 1 <= kg <= 10:
        print("city-route")
    case ("town", kg) if 1 <= kg <= 5:
        print("town-route")
    case _:
        print("rejected")
