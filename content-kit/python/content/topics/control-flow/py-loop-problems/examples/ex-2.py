number = int(input("n from 0 to 100: "))
# One also gives the right result when the range is empty.
factorial = 1
for factor in range(2, number + 1):
    factorial *= factor
print(factorial)
