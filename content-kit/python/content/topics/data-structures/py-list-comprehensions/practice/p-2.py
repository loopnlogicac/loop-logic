prices = [int(token) for token in input().split()]
print(*[price - 10 for price in prices if price >= 100])
