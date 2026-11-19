index = int(input())
left, right = 0, 1
for _ in range(index):
    left, right = right, left + right
print(left)
