first = int(input("First integer: "))
second = int(input("Second integer: "))
first, second = abs(first), abs(second)
while second != 0:
    first, second = second, first % second
print(first)
