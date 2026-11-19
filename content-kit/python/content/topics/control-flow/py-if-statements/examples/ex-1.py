mark = int(input("Mark from 0 to 100: "))
if not 0 <= mark <= 100:
    print("Invalid mark")
elif mark >= 80:
    print("Excellent")
elif mark >= 40:
    print("Pass")
else:
    print("Try again")
