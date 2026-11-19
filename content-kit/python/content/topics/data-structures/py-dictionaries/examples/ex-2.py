stock = {"pen": 12, "notebook": 5}
keys = stock.keys()
stock["ruler"] = 4
print(list(keys))
print(sum(stock.values()))
for item, quantity in stock.items():
    print(f"{item}: {quantity}")
