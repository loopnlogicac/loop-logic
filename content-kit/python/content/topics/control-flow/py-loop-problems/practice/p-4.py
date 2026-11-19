first = abs(int(input()))
second = abs(int(input()))
while second:
    first, second = second, first % second
print(first)
