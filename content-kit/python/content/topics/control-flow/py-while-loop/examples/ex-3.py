number = 15
divisor = 2
while divisor * divisor <= number:
    if number % divisor == 0:
        print(f"Divisor: {divisor}")
        break
    divisor += 1
else:
    print("No small divisor")
