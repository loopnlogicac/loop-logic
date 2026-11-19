rolls = []
for word in input().split():
    rolls.append(int(word))
target = int(input())
if target in rolls:
    rolls.remove(target)
print(*rolls)
