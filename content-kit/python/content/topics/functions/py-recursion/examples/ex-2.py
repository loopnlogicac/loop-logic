def countdown(number):
    print(f"enter {number}")
    if number == 0:
        print("base")
        return
    countdown(number - 1)
    print(f"leave {number}")


countdown(3)
