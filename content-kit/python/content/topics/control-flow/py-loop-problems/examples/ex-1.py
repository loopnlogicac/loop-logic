import math

number = int(input("Nonnegative integer: "))
# Zero and one are outside the definition of a prime.
if number < 2:
    print("Not prime")
else:
    for divisor in range(2, math.isqrt(number) + 1):
        if number % divisor == 0:
            print("Not prime")
            break
    else:
        print("Prime")
