count = int(input("Term count from 0 to 30: "))
previous, current = 0, 1
for _ in range(count):
    print(previous)
    # Both new terms must use the old pair.
    previous, current = current, previous + current
