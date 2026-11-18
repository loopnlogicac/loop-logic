import math

number = int(input())
if number < 2:
    print("neither")
else:
    for divisor in range(2, math.isqrt(number) + 1):
        if number % divisor == 0:
            print("composite")
            break
    else:
        print("prime")
