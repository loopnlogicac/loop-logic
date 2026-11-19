def search(values, target, low, high):
    if low >= high:
        return -1
    middle = (low + high) // 2
    if values[middle] == target:
        return middle
    if target < values[middle]:
        return search(values, target, low, middle)
    return search(values, target, middle + 1, high)


values = [int(token) for token in input().split()]
target = int(input())
print(search(values, target, 0, len(values)))
