while True:
    command = input("Command (stop ends): ")
    if command == "stop":
        break
    print(f"Received: {command}")
print("Session ended")
