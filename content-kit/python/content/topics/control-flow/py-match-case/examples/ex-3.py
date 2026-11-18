request = ("borrow", 3)
match request:
    case ("borrow", count) if count > 0:
        print(f"Lend {count} books")
    case ("borrow", _):
        print("Count must be positive")
    case _:
        print("Unknown request")
