number = int(input())
product = 1
for factor in range(2, number + 1):
    product *= factor
print(product)
