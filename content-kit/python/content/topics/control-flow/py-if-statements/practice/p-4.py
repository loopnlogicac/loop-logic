role = input()
hour = int(input())
if role == "staff":
    print("allow")
elif role == "student" and 8 <= hour <= 17:
    print("allow")
else:
    print("deny")
