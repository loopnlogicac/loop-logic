prices = {"pen": 10, "notebook": 60, "ruler": 15}
discounted = {item: price - 5 for item, price in prices.items() if price >= 20}
squares = {number: number * number for number in range(1, 5)}
print(discounted)
print(squares)
