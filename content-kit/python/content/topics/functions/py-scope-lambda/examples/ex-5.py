late = []
fixed = []
for number in range(3):
    late.append(lambda: number)
    fixed.append(lambda number=number: number)
print([function() for function in late])
print([function() for function in fixed])
